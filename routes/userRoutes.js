import { Router } from "express";
import { Login, SignUp, getUsers, getUsersById } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/login", Login);
userRouter.post("/signup", SignUp);
userRouter.get("/getusers", getUsers);
userRouter.get("/getuser/:id", getUsersById);
export default userRouter;
