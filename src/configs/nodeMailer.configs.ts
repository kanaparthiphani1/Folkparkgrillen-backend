import nodeMailer from "nodemailer";

console.log("PAsswors :", process.env.GMAIL_PASS?.trim());

export const mailerSender = nodeMailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: "naihujlmyazsjlsj",
  },
});
