import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const buildUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  age: user.age ?? null,
  sex: user.sex || "",
  profession: user.profession || "",
});

const buildAuthResponse = (user, token) => ({
  user: buildUserResponse(user),
  token,
});

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "Usuario ya existe",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json(
      buildAuthResponse(
        user,
        generateToken(user._id)
      )
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
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.json(
        buildAuthResponse(
          user,
          generateToken(user._id)
        )
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

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email ya está en uso",
      });
    }

    const user = await User.findById(
      req.user._id
    ).select("-password");

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

    const updatedUser = await user.save();

    res.status(200).json({
      user: buildUserResponse(updatedUser),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
