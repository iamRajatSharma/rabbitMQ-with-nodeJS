import express, { Request, Response } from "express"
import cors from "cors";
const dotenv = require("dotenv")
dotenv.config()
const app = express();
import amqp from "amqplib"
import mongoose from "mongoose";
import ProductSchema from "./model/ProductSchema"

const PORT = 8001;
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
}));

app.use(express.json())


async function startamqp() {
    try {

        await mongoose.connect("mongodb://127.0.0.1/rabbit_mq")
            .then((success) => {
                console.log('DB Connected')
            })
            .catch((error) => {
                console.log('DB Error')
            })

        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()

        // when product is created
        channel.assertQueue("product_created", { durable: false })
        channel.consume("product_created", (msg) => {
            const response = JSON.parse(msg.content.toString())
            const data = new ProductSchema({
                admin_id: response.id,
                title: response.title,
                image: response.image,
                likes: response.likes
            })
            console.log(data)
            data.save();
        }, { noAck: true })


        // whene product is deleted
        channel.assertQueue("product_deleted", { durable: false })
        channel.consume("product_deleted", async (msg) => {
            const response = JSON.parse(msg.content.toString())
            const data = await ProductSchema.deleteOne({ admin_id: response.id })
            if (data) {
                console.log("Record deleted : ")
                console.log(data)
            }
        }, { noAck: true })


        // when product is updated
        channel.assertQueue("product_updated", { durable: false })
        channel.consume("product_updated", async (msg) => {
            const response = JSON.parse(msg.content.toString())
            const data = await ProductSchema.updateOne({ admin_id: response.id }, { $set: { title: response.title, image: response.image } })
            if (data) {
                console.log("Product Updated : ")
                console.log(data)
            }
        }, { noAck: true })


        // when product is like by someoe
        channel.assertQueue("product_likes", { durable: false })
        channel.consume("product_likes", async (msg) => {
            const response = JSON.parse(msg.content.toString())
            const data = await ProductSchema.updateOne({ admin_id: response.id }, { $set: { likes: response.likes } })
            if (data) {
                console.log("Product Like : ")
                console.log(data)
            }
        }, { noAck: true })


        process.on('beforeExit', () => {
            connection.close()
        })
    }
    catch (e) {
        console.log(e)
    }
}
startamqp()

app.listen(PORT, () => {
    console.log('Server started on port : ' + PORT)
})