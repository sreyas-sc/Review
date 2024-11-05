import express from "express";
import {signup, login } from "../controllers/user-controller.js";

const userRouter = express.Router();

// To get the all users


// To signup a user
userRouter.post("/signup", signup);

// login
userRouter.post("/login", login);




export default userRouter