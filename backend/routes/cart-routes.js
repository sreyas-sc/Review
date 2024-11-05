import express from 'express';
import { addToCartController } from '../controllers/cart-controller.js';

const cartRouter = express.Router();

cartRouter.post('/cart', addToCartController);



export default cartRouter;












