import express from 'express';
import { signout, updateUser } from '../controllers/user.controller';
import { verifyToken } from '../../utils/verifyUser';

const router = express.Router();

router.post('/updateUser/:userId',verifyToken, updateUser);
router.post('/signout', signout);

export default router;