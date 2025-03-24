import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/userModel";

const userDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "_id fullName email avatar role isVerified preferences"
  );
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User found successfully."));
});

export { userDetails };
