import express from 'express';
import { createPerfume, getAllPerfume } from '../controllers/perfume-controller.js';

// Create a new router for perfume
const perfumeRouter = express.Router();

// Define routes for perfume
perfumeRouter.post('/createPerfume', createPerfume);

// Define routes for getting all perfumes
perfumeRouter.get('/', getAllPerfume);

// Export the perfumeRouter
export default perfumeRouter;