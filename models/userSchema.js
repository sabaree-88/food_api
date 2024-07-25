import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.statics.signUp = async function (
  name,
  email,
  password,
  role = "user"
) {
  if (!name || !email || !password) {
    throw new Error("All fields must be filled.");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid.");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong.");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error("Email is already registered.");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, password: hash, role });
  return user;
};

userSchema.statics.logIn = async function (email, password) {
  if (!email || !password) {
    throw new Error("All fields must be filled.");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid Password!");
  }

  return user;
};

export const User = mongoose.model("users", userSchema);

