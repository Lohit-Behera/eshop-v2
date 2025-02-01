import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Response } from "express";
import { ApiResponse } from "./ApiResponse";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

interface File {
  buffer?: Buffer | null;
  path?: string;
}

const uploadFile = async (file: File): Promise<string | null> => {
  try {
    let response;

    if (process.env.MEMORY === "true") {
      if (!file || !file.buffer) return null;

      response = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });
      file.buffer = null;
    } else {
      if (!file || !file.path) return null;

      response = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });
      fs.unlinkSync(file.path);
    }
    return (response as any).url;
  } catch (error) {
    console.error(error);
    if (process.env.MEMORY === "false" && file.path) {
      fs.unlinkSync(file.path);
    } else if (process.env.MEMORY === "true") {
      file.buffer = null;
    }
    return null;
  }
};

const deleteFile = async (
  filePath: string | undefined,
  res: Response
): Promise<any> => {
  try {
    if (!filePath) {
      return res
        .status(500)
        .json(new ApiResponse(500, {}, "File path not provided"));
    }
    const response = await cloudinary.uploader.destroy(filePath);
    return response;
  } catch (error: any) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error.message,
          "Something went wrong while deleting file"
        )
      );
  }
};

export { uploadFile, deleteFile };
