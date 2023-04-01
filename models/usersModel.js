const crypto = require("crypto");
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

  role: {
    type: String,
    enum: ["admin", "user", "tour-guide"],
    default: "user"
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
  },

  passwordLastChanged: Date,
  passwordResetToken: String,
  passwordResetTokenExpire: Date
});

// Mongoose Middleware / Executes before saving the doc to DB
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.createForgetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
