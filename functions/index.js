const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendEmail = functions.https.onCall(async (data, context) => {
  const {to, subject, body, attachmentPath} = data;

  const file = admin.storage().bucket().file(attachmentPath);
  const [fileContents] = await file.download();

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
    attachments: [{
      filename: attachmentPath.split("/")[1],
      content: fileContents,
    }],
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

