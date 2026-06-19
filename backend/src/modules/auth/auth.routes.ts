import express from 'express';
import { login, refreshAccessTokenController, register } from './auth.controller';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/refresh', refreshAccessTokenController);

export default router;