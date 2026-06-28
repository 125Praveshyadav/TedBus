export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validateName = (name) => {
  return name.trim().length >= 3;
};

export const validatePassenger = (passenger) => {
  const errors = {};
  if (!validateName(passenger.name)) errors.name = "Name must be at least 3 characters";
  if (!passenger.age || passenger.age <= 0 || passenger.age > 120) errors.age = "Valid age is required";
  if (!passenger.gender) errors.gender = "Gender is required";
  return errors;
};