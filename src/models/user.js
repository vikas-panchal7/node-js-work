const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [7, "Enter Min 7 character passowrd"],

      validate(value) {
        if (value.includes("password")) {
          throw new Error("password cannot conatin password");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//
//for giving specifiec data and hiding er relavant data
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  return userObject;
};

//
// for login credentails check
userSchema.statics.findByCredentails = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to Login");
  }
  return user;
};

//
//to method generate token
userSchema.methods.generateAuthtoken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "nodejs");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//
// hashing password before save to database
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//
const User = mongoose.model("User", userSchema);
module.exports = User;
