import express from 'express';
import authenticateToken from "../middlewares/authenticate.middleware.js";
import { getAllMoodOptions } from '../controllers/mood.controller.js';


const router = express.Router();


router.get("/allMoodOptions", authenticateToken, getAllMoodOptions);

export default router;