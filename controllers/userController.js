import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "1d",
  });
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.logIn(email, password);
    const token = createToken(user._id);

    res.status(200).json({
      user: { _id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(400).json({ error: "Invalid credentials" });
  }
};

export const SignUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.signUp(name, email, password);

    const token = createToken(user._id);
    res.status(201).json({ user: { _id: user._id, email: user.email }, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const result = await User.find({});
    return res.status(200).send({ result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
export const getUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findById(id);
    if (!result) {
      res.status(400).send({ message: "User not found!" });
    }
    return res.status(200).send({ result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
