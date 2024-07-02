const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
    minlength: 8,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  image: {
    type: String,
    default: "",
  },
  age: {
    type: Number,
    require: true,
  },
  weight: {
    type: Number,
    require: true,
  },
  height: {
    type: Number,
    require: true,
  },
});

const User = model("User", userSchema);
module.exports = User;
