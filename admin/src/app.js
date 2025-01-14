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
const amqplib_1 = __importDefault(require("amqplib"));
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
function startamqp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield amqplib_1.default.connect("amqp://localhost");
            const channel = yield connection.createChannel();
            // get all products
            app.get("/api/product", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield prisma.product.findMany();
                    return res.send(data);
                }
                catch (error) {
                    return res.send(error);
                }
            }));
            // get product by id
            app.get("/api/product/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
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
            app.post("/api/product", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield prisma.product.create({
                        data: {
                            title: req.body.title,
                            image: req.body.image
                        }
                    });
                    // channel.assertQueue("product_created", { durable: false });
                    channel.sendToQueue("product_created", Buffer.from(JSON.stringify(data)));
                    return res.send(data);
                }
                catch (error) {
                    return res.send(error);
                }
            }));
            // update product
            app.put("/api/product/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield prisma.product.update({
                        data: {
                            title: req.body.title,
                            image: req.body.image
                        },
                        where: {
                            id: parseInt(req.params.id)
                        }
                    });
                    channel.sendToQueue("product_updated", Buffer.from(JSON.stringify(data)));
                    return res.send(data);
                }
                catch (error) {
                    return res.send(error);
                }
            }));
            // delete product
            app.delete("/api/product/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield prisma.product.delete({
                        where: {
                            id: parseInt(req.params.id)
                        }
                    });
                    channel.sendToQueue("product_deleted", Buffer.from(JSON.stringify(data)));
                    return res.send(data);
                }
                catch (error) {
                    return res.send(error);
                }
            }));
            // like a proeuct
            app.post("/api/product/:id/like", (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield prisma.product.update({
                        data: {
                            likes: { increment: 1 }
                        },
                        where: {
                            id: parseInt(req.params.id)
                        }
                    });
                    channel.sendToQueue("product_likes", Buffer.from(JSON.stringify(data)));
                    return res.send(data);
                }
                catch (error) {
                    return res.send(error);
                }
            }));
            process.on('beforeExit', () => {
                connection.close();
            });
        }
        catch (e) {
            console.log(e);
        }
    });
}
startamqp();
app.listen(PORT, () => {
    console.log('Server started on port : ' + PORT);
});
