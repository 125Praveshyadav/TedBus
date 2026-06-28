const validateRegister = (data) => {
  const { name, email, phone, password } =
    data;

  if (
    !name ||
    !email ||
    !phone ||
    !password
  ) {
    return "All fields are required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

module.exports = {
  validateRegister,
};