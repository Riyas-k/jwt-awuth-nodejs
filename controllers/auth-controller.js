const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

//handleError
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let error = { email: "", password: "" };
  if (err.code == 11000) {
    error.email = "Already Existed";
    return error;
  }
  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "Secret123", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    await user
      .save()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({user:user._id,token});
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json(error);
  }
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.login_post = async (req, res) => {
  res.send("login");
};
