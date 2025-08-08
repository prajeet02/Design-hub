import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: `"desire app" <${process.env.SMTP_USER}>`,
    to,
    subject: "your desire email verification code",
    text: `your verification code is: ${code}`,
    html: `<h3>your verification code is: <b>${code}</b></h3>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetCodeEmail = async (to, code) => {
  const mailOptions = {
    from: `"desire app" <${process.env.SMTP_USER}>`,
    to,
    subject: "your desire password reset code",
    text: `your password reset code is: ${code}. This code will expire in 10 minutes.`,
    html: `<h3>your password reset code is: <b>${code}</b></h3><p>This code will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
