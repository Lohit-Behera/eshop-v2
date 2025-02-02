import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse";
import { User, IUser } from "../models/userModel";
import { Request, Response, NextFunction, CookieOptions } from "express";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

// Cookie options configuration
const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 10 * 60 * 1000, // 10 minutes
};

interface DecodedToken extends JwtPayload {
  id: string;
}

class AuthError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AuthError";
  }
}

const verifyAndDecodeToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as DecodedToken;
  } catch {
    throw new AuthError(401, "Invalid or expired token");
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded.exp! < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
};

const handleTokenRefresh = async (
  user: IUser,
  refreshToken: string | null | undefined
): Promise<string> => {
  if (!refreshToken) {
    throw new AuthError(401, "Refresh token missing");
  }

  if (isTokenExpired(refreshToken)) {
    throw new AuthError(401, "Session expired");
  }

  return user.generateAccessToken();
};

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;
      // Handle expired access token
      if (isTokenExpired(accessToken)) {
        const refreshToken = req.cookies.refreshToken;
        if (isTokenExpired(refreshToken)) {
          throw new AuthError(401, "Session expired");
        }
        let decoded = jwt.decode(
          accessToken ? accessToken : refreshToken
        ) as JwtPayload;
        const user = await User.findById(decoded.id);

        if (!user) {
          throw new AuthError(401, "Invalid token: User not found");
        }

        const newAccessToken = await handleTokenRefresh(
          user,
          user.refreshToken
        );
        res.cookie("accessToken", newAccessToken, accessTokenOptions);
        req.user = user;
      } else {
        // Valid access token flow
        const decoded = verifyAndDecodeToken(accessToken);
        const user = await User.findById(decoded.id);

        if (!user) {
          throw new AuthError(401, "Invalid token: User not found");
        }

        req.user = user;
      }

      next();
    } catch (error) {
      console.log(error);

      const authError =
        error instanceof AuthError
          ? error
          : new AuthError(401, "Authentication failed");

      return res
        .status(authError.statusCode)
        .json(new ApiResponse(authError.statusCode, null, authError.message));
    }
  }
);
