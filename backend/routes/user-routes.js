import express from "express";
import {signup, login } from "../controllers/user-controller.js";

const userRouter = express.Router();

// To get the all users
// userRouter.get("/", getAllUsers); //localhost:5000/user

// userRouter.get("/:id", verifyUserToken, getUserDetails);

// To signup a user
userRouter.post("/signup", signup);

// login
userRouter.post("/login", login);

// // To get the bookings of the user
// userRouter.get("/bookings/:id", verifyUserToken, getBookingsOfUser);

// userRouter.post("/getUserByEmail",  getUserByEmail);


export default userRouter