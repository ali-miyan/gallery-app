import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import ImageModel from "../models/imageModel";
import userModel from "../models/userModel";
config();

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
    console.log(process.env.WEB_TOKEN);

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
          secure: process.env.NODE_ENV === "production",
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
      let imageUrl = null;

      if (files && files.length > 0) {
        const file = files[0];

        imageUrl = `${file.filename}`;
      }

      const updatedImage = await ImageModel.findByIdAndUpdate(
        id,
        {
          title,
          ...(imageUrl && { url: imageUrl }),
        },
        { new: true }
      );

      if (!updatedImage) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.status(200).json({ message: "Image updated successfully" });
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

    const imagePromises = files.map((file, index) => {
      return ImageModel.create({
        userId: userId,
        order: nextOrder + index,
        title: titles[index],
        url: `${file.filename}`,
      });
    });

    await Promise.all(imagePromises);
    res.json({ status: true, message: "Uploaded and saved successfully" });
  }
);

export const deleteImage = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const imageToDelete = await ImageModel.findById(req.params.id);

    await ImageModel.findByIdAndDelete(req.params.id);

    if (!imageToDelete) {
      return res.status(404).json({ message: "Image not found" });
    }

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
