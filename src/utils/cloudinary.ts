import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import AppError from "./app-error";
import { StatusCodes } from "http-status-codes";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (
  localFilePath: string,
  folderName?: string,
  fileName?: string
) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: `Folkaparkgrillen/${folderName}/${fileName}_${Date.now()}`,
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export const destroyOnCloudinary = async (
  publicId: string | null | undefined
) => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId);
    if (response.result === "ok") {
      console.log(
        `Image with public ID ${publicId} has been successfully deleted from Cloudinary.`
      );
    } else {
      console.error("Error deleting image from Cloudinary:", response.result);
    }
    return response;
  } catch (error) {
    return new AppError(
      "Error deleting image from Cloudinary",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
