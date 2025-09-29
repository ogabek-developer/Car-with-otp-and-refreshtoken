import {Router} from "express";
import authController from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", authController.REGISTER);
authRouter.post('/verify', authController.VERIFY);
authRouter.post('/resend/otp', authController.RESEND_OTP) ;
authRouter.post('/forgot/password', authController.FORGOT_PASSWORD) ;
authRouter.post('/change/password', authController.CHANGE_PASSWORD) ;


authRouter.post('/login', authController.LOGIN) ;
authRouter.post('/logout', authController.LOGOUT) ;
authRouter.get('/refresh', authController.REFRESH)

export default authRouter;