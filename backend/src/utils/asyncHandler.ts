import { Request, Response, NextFunction } from "express";

const asyncHandler = (
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    });
  };
};

export { asyncHandler };
