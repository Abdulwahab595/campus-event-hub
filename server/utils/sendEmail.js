const nodemailer = require("nodemailer");

async function sendEmail({ to, subject, text, html }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("Set SMTP_HOST, SMTP_USER and SMTP_PASS in server/.env");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Set SMTP_PORT to a valid port number");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  return transporter.sendMail({ from: process.env.SMTP_FROM || user, to, subject, text, html });
}

module.exports = sendEmail;
