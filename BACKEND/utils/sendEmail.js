import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Diagnostic: SMTP Connection Failed -", error.message);
    throw error;
  }
};
