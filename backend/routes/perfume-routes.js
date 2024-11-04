import express from 'express';
import { createPerfume, getAllPerfume } from '../controllers/perfume-controller.js';

const perfumeRouter = express.Router();

perfumeRouter.post('/createPerfume', createPerfume);

perfumeRouter.get('/', getAllPerfume);

export default perfumeRouter;