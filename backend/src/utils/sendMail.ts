import nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  subject: string,
  htmlContent: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT as string, 10),
    auth: {
      user: process.env.EMAIL_HOST_USER as string,
      pass: process.env.EMAIL_HOST_PASSWORD as string,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_HOST_USER as string,
    to: email,
    subject: subject,
    html: htmlContent,
  });
};
