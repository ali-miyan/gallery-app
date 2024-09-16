"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.logout = exports.deleteImage = exports.uploadImages = exports.getUser = exports.getUserImages = exports.editImage = exports.login = exports.signUp = exports.auth = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const imageModel_1 = __importDefault(require("../models/imageModel"));
const userModel_2 = __importDefault(require("../models/userModel"));
(0, dotenv_1.config)();
exports.auth = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ status: true, message: "welcome to home" });
}));
exports.signUp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const existingUser = yield userModel_1.default.findOne({ email });
    if (existingUser) {
        console.log("dd1");
        res.json({ status: false, message: "This email already exists" });
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = new userModel_1.default({
        name,
        email,
        password: hashedPassword,
    });
    yield newUser.save();
    res.json({ status: true, message: "Signed up successfully!" });
}));
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("login");
    const user = yield userModel_1.default.findOne({ email });
    if (user) {
        const check = yield bcryptjs_1.default.compare(password, user.password);
        if (check) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.WEB_TOKEN, { expiresIn: "1d" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({ status: true, message: "Login successful!", token });
        }
        else {
            res.json({ status: false, message: "Invalid email or password." });
        }
    }
    else {
        res.json({ status: false, message: "User not found." });
    }
}));
exports.editImage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title } = req.body;
    const files = req.files;
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
        const updatedImage = yield imageModel_1.default.findByIdAndUpdate(id, Object.assign({ title }, (imageUrl && { url: imageUrl })), { new: true });
        if (!updatedImage) {
            return res.status(404).json({ message: "Image not found" });
        }
        res.status(200).json({ message: "Image updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update image" });
    }
}));
exports.getUserImages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const userImages = yield imageModel_1.default.find({ userId });
    return res.json({ status: true, userImages });
}));
exports.getUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const user = yield userModel_2.default.findById(userId);
    return res.json(user);
}));
exports.uploadImages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const titles = JSON.parse(req.body.titles);
    const files = req.files;
    const userId = req.user.id;
    const maxOrderImage = yield imageModel_1.default.find().sort({ order: -1 }).limit(1);
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
        return imageModel_1.default.create({
            userId: userId,
            order: nextOrder + index,
            title: titles[index],
            url: `${file.filename}`,
        });
    });
    yield Promise.all(imagePromises);
    res.json({ status: true, message: "Uploaded and saved successfully" });
}));
exports.deleteImage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageToDelete = yield imageModel_1.default.findById(req.params.id);
    yield imageModel_1.default.findByIdAndDelete(req.params.id);
    if (!imageToDelete) {
        return res.status(404).json({ message: "Image not found" });
    }
    yield imageModel_1.default.updateMany({ order: { $gt: imageToDelete.order } }, { $inc: { order: -1 } });
    res.status(200).json({
        status: true,
        message: "Image deleted successfully ",
    });
}));
exports.logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.json({ status: true, message: "logged out successfully" });
}));
exports.updateOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { updatedImages } = req.body;
    console.log(updatedImages, "siiiiiiiii");
    try {
        const bulkOps = updatedImages.map((image) => ({
            updateOne: {
                filter: { _id: image._id },
                update: { order: image.order },
            },
        }));
        yield imageModel_1.default.bulkWrite(bulkOps);
        res
            .status(200)
            .json({ status: true, message: "Order updated successfully" });
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Failed to update order" });
    }
}));
