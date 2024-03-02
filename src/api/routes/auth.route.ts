import express from 'express';
import { signin, signup } from '../controllers/auth.controller';

const route = express.Router();

route.post('/signup', signup);
route.post('/signin', signin);

export default route;