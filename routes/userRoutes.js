import { Router } from "express";
import { Login, SignUp } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/login", Login);
userRouter.post("/signup", SignUp);

export default userRouter;
