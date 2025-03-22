import { Request, Response, NextFunction } from "express";

export const rawBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let data: Buffer[] = [];

  req.on("data", (chunk: Buffer) => {
    data.push(chunk);
  });

  req.on("end", () => {
    req.rawBody = Buffer.concat(data);
    next();
  });
};
