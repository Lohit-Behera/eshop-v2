import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/userModel";
import { deleteFile, uploadFile } from "../utils/cloudinary";

const userDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "_id fullName email avatar role isVerified preferences phoneNumber"
  );
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User found successfully."));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  const avatar = req.file;
  let updated = false;
  if (avatar) {
    const avatarUrl = await uploadFile(avatar, "avatar");
    if (avatarUrl && user.avatar) {
      deleteFile(user.avatar, "eshop/avatar", res);
      user.avatar = avatarUrl;
      await user.save({ validateBeforeSave: false });
      updated = true;
    }
  }
  if (!updated) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Avatar not updated."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Avatar updated successfully."));
});

export { userDetails, updateAvatar };
