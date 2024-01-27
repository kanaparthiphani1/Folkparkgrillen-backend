import nodeMailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const mailerSender = nodeMailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: "naihujlmyazsjlsj",
  },
});

mailerSender.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      layoutsDir: path.join(__dirname, "templates", "emails"),
      defaultLayout: false,
      partialsDir: path.join(__dirname, "templates", "emails"),
    },
    viewPath: path.join(__dirname, "templates", "emails"),
    extName: ".hbs",
  })
);

export default mailerSender;
