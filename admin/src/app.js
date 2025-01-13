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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dotenv = require("dotenv");
dotenv.config();
const app = (0, express_1.default)();
const PORT = 8000;
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
}));
app.use(express_1.default.json());
// get all products
app.get("/api/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.product.findMany();
        return res.send(data);
    }
    catch (error) {
        return res.send(error);
    }
}));
// get product by id
app.get("/api/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(typeof req.params.id);
    try {
        const data = yield prisma.product.findFirst({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.send(data);
    }
    catch (error) {
        return res.send(error);
    }
}));
// save product
app.post("/api/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.product.create({
            data: {
                title: "Hello-1",
                image: "image"
            }
        });
        return res.send(data);
    }
    catch (error) {
        return res.send(error);
    }
}));
// update product
app.put("/api/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.product.update({
            data: {
                title: "Hello-2",
                image: "image-2"
            },
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.send(data);
    }
    catch (error) {
        return res.send(error);
    }
}));
// delete product
app.delete("/api/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.product.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.send(data);
    }
    catch (error) {
        return res.send(error);
    }
}));
// like a proeuct
app.post("/api/product/:id/like", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.product.update({
            data: {
                likes: { increment: 1 }
            },
            where: {
                id: parseInt(req.params.id)
            }
        });
        return res.send(data);
    }
    catch (error) {
        return res.send(error);
    }
}));
app.listen(PORT, () => {
    console.log('Server started on port : ' + PORT);
});
