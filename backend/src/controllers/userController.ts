import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import ImageModel from "../models/imageModel";
import userModel from "../models/userModel";
import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const auth = asyncHandler(async (req: Request, res: Response) => {
  res.json({ status: true, message: "welcome to home" });
});

export const signUp = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("dd1");
      res.json({ status: false, message: "This email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ status: true, message: "Signed up successfully!" });
  }
);
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    console.log("login");

    const user = await User.findOne({ email });

    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        const token = jwt.sign(
          { id: user._id },
          process.env.WEB_TOKEN as string,
          { expiresIn: "1d" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ status: true, message: "Login successful!", token });
      } else {
        res.json({ status: false, message: "Invalid email or password." });
      }
    } else {
      res.json({ status: false, message: "User not found." });
    }
  }
);

export const editImage = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id, title } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!id || !title) {
      return res
        .status(400)
        .json({ message: "Image ID and title are required" });
    }

    try {
      const existingImage = await ImageModel.findById(id);

      if (!existingImage) {
        return res.status(404).json({ message: "Image not found" });
      }

      let updateData: any = { title };

      if (files && files.length > 0) {
        const file = files[0];

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "user_uploads" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(file.buffer);
        });

        if (typeof uploadResult === "object" && uploadResult !== null) {
          updateData.url = (uploadResult as any).secure_url;
          const parts = existingImage.url.split("/");
          const publicId = parts[parts.length - 1].split(".")[0];
          console.log(publicId, "publicccc");

          try {
            const deletionResult = await cloudinary.uploader.destroy(
              `user_uploads/${publicId}`
            );
            console.log(deletionResult);
          } catch (error) {
            console.error("Error deleting image from Cloudinary:", error);
          }
        }
      }

      const updatedImage = await ImageModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedImage) {
        return res.status(404).json({ message: "Failed to update image" });
      }

      res
        .status(200)
        .json({ message: "Image updated successfully", image: updatedImage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update image" });
    }
  }
);
export const getUserImages = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).user.id;

    const userImages = await ImageModel.find({ userId });

    return res.json({ status: true, userImages });
  }
);

export const getUser = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).user.id;

    const user = await userModel.findById(userId);

    return res.json(user);
  }
);

export const uploadImages = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const titles = JSON.parse(req.body.titles);
    const files = req.files as Express.Multer.File[];
    const userId = (req as any).user.id;

    console.log(files, userId, titles);

    const maxOrderImage = await ImageModel.find().sort({ order: -1 }).limit(1);
    const nextOrder = maxOrderImage.length ? maxOrderImage[0].order + 1 : 1;

    if (!Array.isArray(req.files) || !titles || !Array.isArray(titles)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid request format" });
    }

    if (files.length !== titles.length) {
      return res.status(400).json({
        status: false,
        message: "Number of titles does not match number of files",
      });
    }

    const uploadPromises = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "user_uploads" },
          (error, result) => {
            if (error) reject(error);
            else resolve({ result, index });
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    try {
      const uploadResults = await Promise.all(uploadPromises);

      const imagePromises = uploadResults.map((uploadResult: any) => {
        const { result, index } = uploadResult;
        return ImageModel.create({
          userId: userId,
          order: nextOrder + index,
          title: titles[index],
          url: result.secure_url,
        });
      });

      await Promise.all(imagePromises);
      res.json({ status: true, message: "Uploaded and saved successfully" });
    } catch (error) {
      console.error("Error uploading images:", error);
      res
        .status(500)
        .json({ status: false, message: "Error uploading images" });
    }
  }
);

export const deleteImage = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const imageToDelete = await ImageModel.findById(req.params.id);

    if (!imageToDelete) {
      return res.status(404).json({ message: "Image not found" });
    }

    const parts = imageToDelete.url.split("/");
    const publicId = parts[parts.length - 1].split(".")[0];
    console.log(publicId, "publicccc");

    try {
      const deletionResult = await cloudinary.uploader.destroy(
        `user_uploads/${publicId}`
      );
      console.log(deletionResult);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
    await ImageModel.findByIdAndDelete(req.params.id);

    await ImageModel.updateMany(
      { order: { $gt: imageToDelete.order } },
      { $inc: { order: -1 } }
    );

    res.status(200).json({
      status: true,
      message: "Image deleted successfully ",
    });
  }
);
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ status: true, message: "logged out successfully" });
});
export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { updatedImages } = req.body;

  console.log(updatedImages, "siiiiiiiii");

  try {
    const bulkOps = updatedImages.map((image: any) => ({
      updateOne: {
        filter: { _id: image._id },
        update: { order: image.order },
      },
    }));

    await ImageModel.bulkWrite(bulkOps);

    res
      .status(200)
      .json({ status: true, message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to update order" });
  }
});
