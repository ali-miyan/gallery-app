export const validateName = (value: string) => {
  if (!value || value.trim() === "") {
    return "Name is required";
  }
  return "";
};

export const validateEmail = (value: string) => {
  if (!value || value.trim() === "") {
    return "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(value)) {
    return "Invalid email address";
  }
  return "";
};

export const validatePassword = (value: string) => {
  if (!value || value.trim() === "") {
    return "Password is required";
  } else if (value.length < 8) {
    return "Password is too short";
  }
  return "";
};
