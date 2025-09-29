
import { ClientError, globalError } from "shokhijakhon-error-handler";
import { changePasswordSchema, loginSchema, registerSchema } from "../utils/validation/user.validation.js";
import User from "../model/User.js";
import hashService from "../lib/hash.js";
import otpService from "../utils/otp.service.js";
import createNodemailer from "../lib/nodemailer.js";
import { resendSchema, verifySchema } from "../utils/validation/otp.validation.js";
import JwtConfig from "../lib/jwt.config.js";

class AuthController {
  REGISTER = async (req, res) => {
    try {
      const newUser = req.body;
      const validate = registerSchema.validate(newUser, { abortEarly: false });
      if (validate.error) throw new ClientError(validate.error.message, 400);

      const findUser = await User.findOne({ email: newUser.email });
      if (findUser) throw new ClientError("User already exists!", 400);

      const hashing = await hashService.hashPassword(newUser.password);

      const { otp, otpTime } = otpService();
      await createNodemailer(newUser.email, otp);

      const createUser = await User.create({
        ...newUser,
        password: hashing,
        otp,
        otpTime,
      });

      res.status(201).json({
        message: "User successfully registered!",
        status: 201,
        id: createUser._id,
      });
    } catch (err) {
      return globalError(err, res);
    }
  };

  VERIFY = async (req, res) => {
    try {
      const data = req.body;
      const validate = await verifySchema.validateAsync(data, { abortEarly: false });
      if (validate.error) throw new ClientError(validate.error.message, 400);

      const checkUser = await User.findOne({ email: data.email });
      if (!checkUser) throw new ClientError("User not found", 400);

      const currentDate = Date.now();
      if (currentDate > checkUser.otpTime) {
        await User.findOneAndUpdate({ email: data.email }, { otp: null });
        throw new ClientError("OTP expired", 410);
      }

      if (checkUser.otp !== data.otp) throw new ClientError("OTP Invalid", 422);

      await User.findOneAndUpdate({ email: data.email }, { isVerified: true });
      return res.json({ message: "OTP successfully verified!", status: 200 });
    } catch (err) {
      return globalError(err, res);
    }
  };

  RESEND_OTP = async (req, res) => {
    try {
      let data = req.body;
      const validate = await resendSchema.validateAsync(data);
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const checkUser = await User.findOne({ email: data.email });
      if (!checkUser) throw new ClientError("User not found", 400);
      if (checkUser.isVerified) throw new ClientError("User is already verified", 400);
      const { otp, otpTime } = otpService();
      await createNodemailer(data.email, otp);
      await User.findOneAndUpdate({ email: data.email }, { otp, otpTime })
      return res.json({ message: "OTP successfully resend, check your email", status: 200 })
    } catch (error) {
      return globalError(error, res)
    }
  };

  FORGOT_PASSWORD = async (req, res) => {
    try {
      let data = req.body;
      const validate = await resendSchema.validateAsync(data);
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const checkUser = await User.findOne({ email: data.email });
      if (!checkUser) throw new ClientError("User not found", 400);
      await User.findOneAndUpdate({ email: data.email }, { isVerified: false, otp: null });
      const { otp, otpTime } = otpService();
      await createNodemailer(data.email, otp);
      await User.findOneAndUpdate({ email: data.email }, { otp, otpTime });
      return res.json({ message: "We send new otp please check your email", status: 200 })
    } catch (error) {
      return globalError(error, res)
    }
  };

  CHANGE_PASSWORD = async (req, res) => {
    try {
      const data = req.body;
      const validate = await changePasswordSchema.validateAsync(data, { abortEarly: false });
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const checkUser = await User.findOne({ email: data.email });
      if (!checkUser) throw new ClientError("User not found !", 400);
      const hashing = await hashService.hashPassword(data.new_password);
      await User.findOneAndUpdate({ email: data.email }, { password: hashing });
      res.json({ message: "Password successfully yangilandi !", status: 200 });
    } catch (err) {
      return globalError(err, res);
    }
  };


  LOGIN = async (req, res) => {
    try {
      let data = req.body;
      const validate = await loginSchema.validateAsync(data);
      if (validate.error) throw new ClientError(validate.error.message, 400);
      const findUser = await User.findOne({ email: data.email });
      if (!findUser) throw new ClientError("User not found", 404);
      let checkPassword = await hashService.comparePassword(data.password, findUser.password);
      if (!checkPassword) throw new ClientError('User not found', 404);

      const payload = { user_id: findUser._id, role: findUser.role };
      const accessToken = JwtConfig.createAccessToken(payload);
      const refreshToken = JwtConfig.createRefreshToken({ ...payload, userAgent: req.headers["user-agent"] });

      findUser.refreshTokens.push({ token: refreshToken, role: findUser.role, userAgent: req.headers["user-agent"] });
      await findUser.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV == "production" ? true : false,
        maxAge: 30 * 24 * 60 * 60 * 1000
      })


      return res.json({ message: "User successfully Logged in qildi ", status: 200, accessToken });

    } catch (error) {
      return globalError(error, res)
    }
  };


  REFRESH = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken)
      if (!refreshToken) throw new ClientError('Refresh token not found', 401);
      let parseToken = JwtConfig.verifyRefreshToken(refreshToken);
      if (req.headers["user-agent"] !== parseToken.userAgent) throw new ClientError('Invalid access token', 401);
      const findUser = await User.findById(parseToken.user_id);
      if (!findUser) throw new ClientError('Invalid access token', 401);
      req.user = parseToken;
      req.admin = parseToken.role == 'admin' ? true : false;
      let payload = { user_id: findUser._id, userAgent: req.headers["user-agent"], role: findUser.role };
      let accessToken = JwtConfig.createAccessToken(payload);
      return res.json({ message: "Acces token successfully generated !", accessToken, status: 200 });
    } catch (err) {
      return globalError(err, res);
    }
  };

  LOGOUT = async (req, res) => {
    
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new ClientError('Token not found', 400);
      const findUser = await User.findOne({ "refreshTokens.token": refreshToken });
      if (!findUser) {
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: "strict" });
        return res.json({ message: "User successfully logged out", status: 200 })
      };
      findUser.refreshTokens = findUser.refreshTokens.filter((token) => token !== refreshToken);

      await findUser.save();

      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

      return res.json({ message: "User successfully logged out", status: 200 });

    } catch (err) {
      return globalError(err, res);
    }

  }

}

export default new AuthController();
