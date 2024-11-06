import express from 'express';
import { addToCartController } from '../controllers/cart-controller.js';
// Import the verifyUserToken middleware
import {verifyUserToken} from '../middlewares/auth.js';

// Create a new router for cart
const cartRouter = express.Router();

// Add a new item to the cart, with  a  user authentication via verifyUserToken middleware
cartRouter.post('/cart', verifyUserToken, addToCartController);

// Export the cartRouter
export default cartRouter;












