import express from 'express';
import {createPerfume } from '../controllers/perfume-controller.js'; 

const adminRouter = express.Router();

adminRouter.post('/addPerfume', createPerfume);

export default adminRouter;