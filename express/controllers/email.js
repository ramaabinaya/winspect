'use strict';

const addEmail = async function (req, res) {
  let err, status;
  let body = req.body;
  const mailOptions = {
    text: 'the reset password for your account.\n\n',
    process: 'reset Password',
    route: 'resetPassword'
  };

  [err, status] = await to(mailService.sendEmail(body, mailOptions));
  if (err) return ReE(res, err, 422);
  return ReS(res, { status: ERROR.mail_sent });
}
module.exports.addEmail = addEmail;

const configurePassword = async function (req, res) {
  let body = req.body;
  let err, user;
  [err, user] = await to(UserAccount.findOne({
    where: {
      resetPasswordToken: body.token,
      resetPasswordExpires: { [Sequelize.Op.gt]: Date.now() }
    }
  }
  ));
  if (!user) {
    console.log('Error', 'Password reset token is invalid or has expired.');
    return ReS(res, { response: 'error' });
  }
  else {
    console.log('Password reset token is valid');
    return ReS(res, { response: 'success' });
  }
}
module.exports.configurePassword = configurePassword;
