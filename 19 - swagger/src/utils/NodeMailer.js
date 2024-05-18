import nodemailer from "nodemailer";
export default nodemailer.createTransport({
  service: "gmail",
  port: 587,

  auth: {
    user: "torresrennerguillermo@gmail.com",
    pass: process.env.APPLICATION_KEY,
  },
});
