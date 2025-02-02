import { sendEmail } from "./sendMail";
import { User } from "../models/userModel";
import { ApiResponse } from "./ApiResponse";
import { Response } from "express";
import mongoose from "mongoose";

export const sendVerifyMail = async (
  userId: mongoose.Types.ObjectId,
  res: Response
) => {
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }
  const verifyToken = user.generateToken();
  // save token to database
  user.token = verifyToken;
  await user.save();
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${verifyToken}`;
  const htmlContent = `<p>Click on the link below to verify your email address:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
  await sendEmail(user.email, "Verify your email address", htmlContent);
};
