const validator = require('validator');
/**
 * Async function to checking the email and password for login.
 * If email and password is match then return the user.
 * @param userAccountInfo //containes the email and password 
 */

const authUser = async function (userAccountInfo) {//returns token
    let emailId = userAccountInfo.email;
    let user;
    //Check the given email is valid email
    if (validator.isEmail(emailId)) {

    //findOne mwthod to find the user for the given email id.
    [err, user] = await to(UserAccount.findOne({
        where: { email: emailId, active: 1 },
        attributes: { exclude: ['resetPasswordExpires', 'resetPasswordToken', 'created', 'modified', 'active'] },
        include: {
            model: UserRole,
            attributes: ['name']
        }
    }));
        if (err) TE(err.message);

    } else {
        TE(ERROR.invalid_email);
    }

    if (!user) TE(ERROR.invalid_credentials);

    //For comparing the given password to the user instance
    [err, user] = await to(user.comparePassword(userAccountInfo.password));

    if (err) TE(err.message);

    return user;

}
module.exports.authUser = authUser;

/**
 * Async function to create new user .
 * If email is valid  then create new user.
 * @param userData //Contains firstName,lastName,userRoleId,customerId,email,password
 */
const createUser = async function (userData, mailData) {//returns token
    let emailId = userData.email;
    let user;
    //Check the given email is valid email
    if (validator.isEmail(emailId)) {

        //Create method to create the new user 
        [err, user] = await to(UserAccount.create(userData));
        if (err) TE(err.message);

    } else {
        TE(ERROR.invalid_email);
    }
    if (user) {
        [error, status] = await to(mailService.sendEmail(userData, mailData));
        if (error) {
            return TE(error.message);
        }
        return user;
    }
}
module.exports.createUser = createUser;

