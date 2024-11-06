import User from "../models/user-model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "USERSECRETKEY";

// User signup
export const signup = async (req, res) => {
    console.log("signup!!!!!!!!!!!!!!!!");
    console.log(req.body);
    const { name, email, password } = req.body;


    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        console.log("Creating new user");
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

// User login
export const login = async (req, res) => {
    
    const { email, password } = req.body;

    
    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        // Check if password is correct
        const isPasswordCorrect = bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: "7d" });

        // Send response
        res.status(200).json({
            message: "Login successful",
            userId: existingUser._id,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
};

