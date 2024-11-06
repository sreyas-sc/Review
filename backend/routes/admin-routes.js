import express from 'express';
import {createPerfume } from '../controllers/perfume-controller.js'; 

// Create a new router for admin
const adminRouter = express.Router();

// Add a new perfume
adminRouter.post('/addPerfume', createPerfume);

export default adminRouter;