import express from "express";
import mongoose from "mongoose"; 
import cors from 'cors';

// Importing routes
//for user
import userRouter from "./routes/user-routes.js";
//for perfume
import perfumeRouter from "./routes/perfume-routes.js";
//for cart
import cartRouter from "./routes/cart-routes.js";


const app = express();
app.use(cors());

// Middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes 

// Routes  for user
app.use("/user", userRouter);
// Routes for perfume
app.use("/perfume", perfumeRouter);
// Routes for cart
app.post("/cart", cartRouter);


// Connect to MongoDB
mongoose.connect(
        "mongodb+srv://sreyass2000:best1syett0c0me@cluster0.wm0v7.mongodb.net/perfume?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() =>
        app.listen(5000, () =>
            console.log("Connected to database and Server is Running on port 5000")
        )
    )
    .catch(e => console.log(e));

