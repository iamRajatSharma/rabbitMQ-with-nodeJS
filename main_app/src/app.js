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
const dotenv = require("dotenv");
dotenv.config();
const app = (0, express_1.default)();
const amqplib_1 = __importDefault(require("amqplib"));
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema_1 = __importDefault(require("./model/ProductSchema"));
const PORT = 8001;
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
}));
app.use(express_1.default.json());
function startamqp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect("mongodb://127.0.0.1/rabbit_mq")
                .then((success) => {
                console.log('DB Connected');
            })
                .catch((error) => {
                console.log('DB Error');
            });
            const connection = yield amqplib_1.default.connect("amqp://localhost");
            const channel = yield connection.createChannel();
            // when product is created
            channel.assertQueue("product_created", { durable: false });
            channel.consume("product_created", (msg) => {
                const response = JSON.parse(msg.content.toString());
                const data = new ProductSchema_1.default({
                    admin_id: response.id,
                    title: response.title,
                    image: response.image,
                    likes: response.likes
                });
                console.log(data);
                data.save();
            }, { noAck: true });
            // whene product is deleted
            channel.assertQueue("product_deleted", { durable: false });
            channel.consume("product_deleted", (msg) => __awaiter(this, void 0, void 0, function* () {
                const response = JSON.parse(msg.content.toString());
                const data = yield ProductSchema_1.default.deleteOne({ admin_id: response.id });
                if (data) {
                    console.log("Record deleted : ");
                    console.log(data);
                }
            }), { noAck: true });
            // when product is updated
            channel.assertQueue("product_updated", { durable: false });
            channel.consume("product_updated", (msg) => __awaiter(this, void 0, void 0, function* () {
                const response = JSON.parse(msg.content.toString());
                const data = yield ProductSchema_1.default.updateOne({ admin_id: response.id }, { $set: { title: response.title, image: response.image } });
                if (data) {
                    console.log("Product Updated : ");
                    console.log(data);
                }
            }), { noAck: true });
            // when product is like by someoe
            channel.assertQueue("product_likes", { durable: false });
            channel.consume("product_likes", (msg) => __awaiter(this, void 0, void 0, function* () {
                const response = JSON.parse(msg.content.toString());
                const data = yield ProductSchema_1.default.updateOne({ admin_id: response.id }, { $set: { likes: response.likes } });
                if (data) {
                    console.log("Product Like : ");
                    console.log(data);
                }
            }), { noAck: true });
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
