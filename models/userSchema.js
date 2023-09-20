const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: [6, "Please enter 6 characters Min length is 6"],
  },
});
//fire a function after doc saved to db
// userSchema.post("save", (doc, next) => {
//   console.log(doc, "saved after");
//   next();
// });

//fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
  }
});

const User = mongoose.model("users", userSchema);
module.exports = User;
