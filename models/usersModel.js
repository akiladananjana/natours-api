const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"]
  },

  email: {
    type: String,
    required: [true, "A tour must have a email address"],
    unique: true,
    lowercase: true, // transfer email to lowercase
    validate: [validator.isEmail, "Please provide a valid email"]
  },

  photo: String,

  password: {
    type: String,
    required: [true, "A tour must have a password"],
    minlength: 8
  },

  passwordConfirm: {
    type: String,
    required: [true, "A tour must provide the password again"],
    validate: {
      validator: function(el) {
        return el === this.password;
      }
    },
    message: "Passwords are not same"
  }
});

// Mongoose Middleware / Executes before saving the doc to DB
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
