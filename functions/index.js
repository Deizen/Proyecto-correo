const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

exports.sendEmail = functions.https.onCall(async (data, context) => {
  const {to, subject, body, attachmentPath} = data;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "deizenamazon@gmail.com",
      pass: "wokpdvbsvrtzlhzy",
    },
  });

  // configure email options
  const mailOptions = {
    from: "deizenamazon@gmail.com",
    to: to,
    subject: subject,
    text: body,
    attachments: [{path: attachmentPath}],
  };

  // send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

