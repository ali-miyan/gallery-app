"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = exports.authenticateUser = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ status: false, message: 'not token availale' });
    }
    jsonwebtoken_1.default.verify(token, process.env.WEB_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};
exports.authenticateUser = authenticateUser;
const authenticateAdmin = (req, res, next) => {
    console.log('cccccccccccccccccccccccccccccc');
    const token = req.cookies.adminToken;
    if (!token) {
        return res.json({ status: false, message: 'not token availale' });
    }
    jsonwebtoken_1.default.verify(token, process.env.WEB_TOKEN, (err, decoded) => {
        if (err) {
            return res.json({ status: false, message: 'Unauthorized' });
        }
        req.admin = decoded;
        next();
    });
};
exports.authenticateAdmin = authenticateAdmin;
