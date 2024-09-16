"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const config_1 = __importDefault(require("./config/config"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
(0, config_1.default)();
const port = process.env.PORT || 5000;
app.use((req, res, next) => {
    const { method, url } = req;
    console.log(`Received ${method} request to ${url}`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use('/api/user', userRoute_1.default);
app.use(errorMiddleware_1.pageNotFound);
app.use(errorMiddleware_1.errorHandler);
app.listen(port, () => {
    console.log(process.env.CLIENT_URL);
    return console.log(`Express is listening at http://localhost:${port}`);
});
