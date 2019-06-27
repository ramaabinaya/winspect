const getAllCustomer = async function (req, res) {
  let body = req.user;
  //get all rows from the assigned inspection table
  [err, customer] = await to(Customer.findAll({
    where: { id: body.customerId }
  }));
  if (err) return ReE(res, err, 422);

  return ReS(res, { customerdetails: customer });
};
module.exports.getAllCustomer = getAllCustomer;