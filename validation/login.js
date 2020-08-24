const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  if (!validator.isEmail(data.email)) {
    errors.email = "Email is Invalid";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field cannot be empty";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
