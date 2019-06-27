
var nodemailer = require("nodemailer");
var crypto = require("crypto");
const validator = require('validator');

const sendMail = async function (data, mailData) {
  let status;
  smtpTransport = nodemailer.createTransport({
    host: CONFIG.mail_server,
    port: CONFIG.mail_server_port,
    secureConnection: true,
    auth: {
      user: CONFIG.mail_server_username,
      pass: CONFIG.mail_server_password,
    }
  });

  smtpTransport.sendMail(mailData, function (err) {
    if (err) {
      logger.error('email not sent' + err);
    } else {
      logger.info('success, An e-mail has been sent to ' + data.email + ' with further instructions.');
    }
    smtpTransport.close();
  });

  return status;
}
module.exports.sendMail = sendMail;

const sendEmail = async function (data, maildata) {
  let err, user;
  let token;
  token = crypto.randomBytes(20).toString('hex');
  if (validator.isEmail(data.email)) {
    [err, user] = await to(UserAccount.findOne({
      where: {
        email: data.email
      }
    }));
  } else {
    if (err) return TE(ERROR.invalid_email);
  }

  if (user) {
    // If user exists update the user with token and expiry time
    [err, emailUpdate] = await to(UserAccount.update({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 86400000
    },
      {
        where: {
          email: data.email
        }
      }));
    if (err) return TE(err.error.message);
    let mailOptions;
    // Content to be sent to the user email
    if (maildata && maildata.attachments) {
      mailOptions = maildata;
    } else {
      mailOptions = {
        from: "Centizen <info@centizen.net>",
        to: data.email,
        subject: user.firstName + ', here\'s is the link to ' + maildata.process,
        text: 'You are receiving this because you (or someone else) have requested ' + maildata.text + 'Please click on the following link, or paste this into your browser to complete the process\n\n' +
          'http://' + CONFIG.hostUrl + '/' + maildata.route + '/' + token + '\n\n If you did not request this, please ignore this email and your password will remain unchanged.\n\n' +
          'This link will expire in 24 hours, so be sure to use it right away.'
      };
    }

    [err, status] = await to(sendMail(data, mailOptions));
  } else {
    TE(ERROR.user_not_found);
  }
  if (err) {
    return TE(err.error);
  }
  return status;
}
module.exports.sendEmail = sendEmail;