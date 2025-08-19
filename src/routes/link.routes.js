import express from 'express';
import { getLink } from '../controllers/url.controller.js';

const router = express.Router();


router.get('/:email', getLink);


export default router;