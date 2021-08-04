const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "cb8ee9e647ba14",
    pass: "ac3150c7838852"
  }
});