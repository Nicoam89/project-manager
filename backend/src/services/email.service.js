import net from "node:net";
import tls from "node:tls";

const SMTP_TIMEOUT_MS = 15000;

const encodeBase64 = (value) => Buffer.from(value, "utf8").toString("base64");

const isConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM && process.env.FRONTEND_URL);

const readResponse = (socket) =>
  new Promise((resolve, reject) => {
    let response = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onData = (chunk) => {
      response += chunk.toString("utf8");
      const lines = response.trimEnd().split(/\r?\n/);
      const lastLine = lines.at(-1) || "";

      if (/^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(response);
      }
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });

const assertResponse = (response, expectedCodes) => {
  const code = Number(response.slice(0, 3));

  if (!expectedCodes.includes(code)) {
    throw new Error(`Respuesta SMTP inesperada: ${response.trim()}`);
  }
};

const sendCommand = async (socket, command, expectedCodes) => {
  socket.write(`${command}\r\n`);
  const response = await readResponse(socket);
  assertResponse(response, expectedCodes);

  return response;
};

const createConnection = () =>
  new Promise((resolve, reject) => {
    const port = Number(process.env.SMTP_PORT || 587);
    const host = process.env.SMTP_HOST;
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const connect = secure ? tls.connect : net.connect;
    const socket = connect({ host, port, servername: host }, () => resolve(socket));

    socket.setTimeout(SMTP_TIMEOUT_MS);
    socket.once("error", reject);
    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error("Timeout conectando al servidor SMTP"));
    });
  });

const upgradeToTls = async (socket) =>
  new Promise((resolve, reject) => {
    const secureSocket = tls.connect(
      { socket, servername: process.env.SMTP_HOST },
      () => resolve(secureSocket)
    );

    secureSocket.once("error", reject);
  });

const authenticate = async (socket) => {
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASS;

  if (!user || !password) {
    return;
  }

  await sendCommand(socket, "AUTH LOGIN", [334]);
  await sendCommand(socket, encodeBase64(user), [334]);
  await sendCommand(socket, encodeBase64(password), [235]);
};

const escapeHeader = (value) => String(value).replace(/[\r\n]+/g, " ").trim();

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const normalizeMessage = (message) => message.replace(/^\./gm, "..");

const buildEmail = ({ to, subject, text, html }) => {
  const from = process.env.SMTP_FROM;
  const fromName = process.env.SMTP_FROM_NAME || "Project Manager";
  const headers = [
    `From: ${escapeHeader(fromName)} <${escapeHeader(from)}>`,
    `To: ${escapeHeader(to)}`,
    `Subject: ${escapeHeader(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="pm-boundary"',
  ];

  return normalizeMessage([
    ...headers,
    "",
    "--pm-boundary",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    text,
    "",
    "--pm-boundary",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    html,
    "",
    "--pm-boundary--",
  ].join("\r\n"));
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!isConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SMTP_HOST, SMTP_FROM y FRONTEND_URL son obligatorios para enviar emails"
      );
    }

    console.warn("SMTP no configurado: se omitió el envío de email.");
    return { skipped: true };
  }

  let socket = await createConnection();

  try {
    assertResponse(await readResponse(socket), [220]);
    await sendCommand(socket, `EHLO ${process.env.SMTP_HELO || "localhost"}`, [250]);

    const port = Number(process.env.SMTP_PORT || 587);
    const shouldStartTls = process.env.SMTP_SECURE !== "true" && port !== 465;

    if (shouldStartTls && process.env.SMTP_STARTTLS !== "false") {
      await sendCommand(socket, "STARTTLS", [220]);
      socket = await upgradeToTls(socket);
      await sendCommand(socket, `EHLO ${process.env.SMTP_HELO || "localhost"}`, [250]);
    }

    await authenticate(socket);
    await sendCommand(socket, `MAIL FROM:<${process.env.SMTP_FROM}>`, [250]);
    await sendCommand(socket, `RCPT TO:<${to}>`, [250, 251]);
    await sendCommand(socket, "DATA", [354]);
    socket.write(`${buildEmail({ to, subject, text, html })}\r\n.\r\n`);
    assertResponse(await readResponse(socket), [250]);
    await sendCommand(socket, "QUIT", [221]);

    return { skipped: false };
  } finally {
    socket.destroy();
  }
};

export const sendVerificationEmail = async ({ email, name, token }) => {
  const baseUrl = process.env.FRONTEND_URL?.replace(/\/$/, "") || "";
  const verificationUrl = `${baseUrl}/verify-email/${token}`;
  const safeName = name || "usuario";
  const escapedName = escapeHtml(safeName);
  const escapedUrl = escapeHtml(verificationUrl);
  const escapedToken = escapeHtml(token);
  const text = [
    `Hola ${safeName},`,
    "",
    "Usa este enlace para verificar tu email:",
    verificationUrl,
    "",
    "Si el enlace no funciona, copia este token en la pantalla de verificación:",
    token,
    "",
    "El token vence en 24 horas.",
  ].join("\n");
  const html = `
    <p>Hola ${escapedName},</p>
    <p>Usa este enlace para verificar tu email:</p>
    <p><a href="${escapedUrl}">${escapedUrl}</a></p>
    <p>Si el enlace no funciona, copia este token en la pantalla de verificación:</p>
    <p><code>${escapedToken}</code></p>
    <p>El token vence en 24 horas.</p>
  `;

  return sendEmail({
    to: email,
    subject: "Verifica tu email en Project Manager",
    text,
    html,
  });
};
