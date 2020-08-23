const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};
  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 40 characters";
  }
  if (validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }
  if (validator.isEmpty(data.status)) {
    errors.status = "Status is required";
  }
  if (validator.isEmpty(data.skills)) {
    errors.skills = "Skills is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
