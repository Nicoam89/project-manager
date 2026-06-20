import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const VERIFICATION_TOKEN_BYTES = 32;
const VERIFICATION_TOKEN_TTL_HOURS = 24;

const buildUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  age: user.age ?? null,
  sex: user.sex || "",
  profession: user.profession || "",
  isEmailVerified: Boolean(user.isEmailVerified),
});

const buildAuthResponse = (user, token) => ({
  user: buildUserResponse(user),
  token,
});

const hashVerificationToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createEmailVerificationToken = () => {
  const token = crypto
    .randomBytes(VERIFICATION_TOKEN_BYTES)
    .toString("hex");

  return {
    token,
    tokenHash: hashVerificationToken(token),
    expires: new Date(
      Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000
    ),
  };
};

const getVerificationUrl = (token) => {
  const baseUrl = process.env.FRONTEND_URL;

  if (!baseUrl) {
    return null;
  }

  return `${baseUrl.replace(/\/$/, "")}/verify-email/${token}`;
};

const buildVerificationResponse = (user, token) => {
  const response = {
    message:
      "Registro exitoso. Verifica tu email antes de iniciar sesión.",
    user: buildUserResponse(user),
  };

  const verificationUrl = getVerificationUrl(token);

  if (verificationUrl) {
    response.verificationUrl = verificationUrl;
  }

  if (process.env.NODE_ENV !== "production") {
    response.verificationToken = token;
  }

  return response;
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Usuario ya existe",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verification = createEmailVerificationToken();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: verification.tokenHash,
      emailVerificationExpires: verification.expires,
    });

    res.status(201).json(
      buildVerificationResponse(user, verification.token)
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const tokenHash = hashVerificationToken(req.params.token);

    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token de verificación inválido o expirado",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    const verifiedUser = await user.save();

    return res.status(200).json(
      buildAuthResponse(verifiedUser, generateToken(verifiedUser._id))
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      if (!user.isEmailVerified) {
        return res.status(403).json({
          message: "Debes verificar tu email antes de iniciar sesión",
          code: "EMAIL_NOT_VERIFIED",
        });
      }

      return res.json(
        buildAuthResponse(user, generateToken(user._id))
      );
    }

    return res.status(401).json({
      message: "Credenciales inválidas",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({
    user: buildUserResponse(req.user),
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, age, sex, profession } = req.body;
    const emailChanged = email !== req.user.email;

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email ya está en uso",
      });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    user.name = name;
    user.email = email;
    user.age = age || null;
    user.sex = sex || "";
    user.profession = profession || "";

    if (emailChanged) {
      const verification = createEmailVerificationToken();
      user.isEmailVerified = false;
      user.emailVerificationToken = verification.tokenHash;
      user.emailVerificationExpires = verification.expires;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      user: buildUserResponse(updatedUser),
      ...(emailChanged
        ? {
            message:
              "Perfil actualizado. Verifica tu nuevo email antes de volver a acceder.",
          }
        : {}),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
