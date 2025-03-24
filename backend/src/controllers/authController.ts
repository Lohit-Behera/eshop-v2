import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/userModel";
import Joi from "joi";
import { uploadFile } from "../utils/cloudinary";
import { sendVerifyMail } from "../utils/sendVerifyMail";
import { generateTokens } from "../utils/generateTokens";
import { CookieOptions } from "express";
import { isTokenExpired } from "../middlewares/authMiddleware";
import jwt, { JwtPayload } from "jsonwebtoken";

// cookie options for access token
const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 10 * 60 * 1000, // 10 minutes
};

// cookie options for refresh token
const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days
};

// sing up
const singUp = asyncHandler(async (req, res) => {
  // joi schema for validation
  const schema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }

  // Check if user already exists
  const userExists = await User.findOne({ email: value.email });
  if (userExists) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User already exists"));
  }

  // Check if password and confirm password match
  if (value.password !== value.confirmPassword) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Password and confirm password do not match")
      );
  }

  //create user
  const user = await User.create({
    fullName: value.fullName,
    email: value.email,
    password: value.password,
    countryCode: value.countryCode,
    phoneNumber: value.phoneNumber,
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Something went wrong while creating account."
        )
      );
  }

  await sendVerifyMail(createdUser._id, res);

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Account created successfully."));
});

// verify email
const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;
  if (isTokenExpired(token)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Token is expired."));
  }
  const decoded = jwt.decode(token) as JwtPayload;
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  if (user.isVerified) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User is already verified."));
  }

  if (user.token !== token) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid token."));
  }
  user.isVerified = true;
  user.token = "";
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully."));
});

// login
const login = asyncHandler(async (req, res) => {
  // joi schema for validation
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }

  // Check if user exists
  const user = await User.findOne({ email: value.email });
  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User does not exist"));
  }

  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(value.password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid credentials"));
  }

  const token = await generateTokens(user._id, res);
  if (!token) return;

  return res
    .status(200)
    .cookie("accessToken", token.accessToken, accessTokenOptions)
    .cookie("refreshToken", token.refreshToken, refreshTokenOptions)
    .json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          isVerified: user.isVerified,
        },
        "Login successful"
      )
    );
});

// logout
const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "Logout successful."));
});

export { singUp, login, logout, verifyEmail };
