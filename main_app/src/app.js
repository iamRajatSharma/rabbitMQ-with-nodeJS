"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = require("dotenv");
dotenv.config();
const app = (0, express_1.default)();
const PORT = 8001;
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
}));
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log('Server started on port : ' + PORT);
});
