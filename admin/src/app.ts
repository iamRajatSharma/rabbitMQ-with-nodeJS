import express, { Request, Response } from "express"
import cors from "cors";
import amqp from "amqplib"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
const dotenv = require("dotenv")
dotenv.config()
const app = express();


const PORT = 8000;
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
}));

app.use(express.json())


async function startamqp() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()

        // get all products
        app.get("/api/product", async (req, res) => {
            try {
                const data = await prisma.product.findMany()
                return res.send(data)
            }
            catch (error) {
                return res.send(error)
            }
        })

        // get product by id
        app.get("/api/product/:id", async (req, res) => {
            console.log(typeof req.params.id)
            try {
                const data = await prisma.product.findFirst({
                    where: {
                        id: parseInt(req.params.id)
                    }
                })
                return res.send(data)
            }
            catch (error) {
                return res.send(error)
            }
        })

        // save product
        app.post("/api/product", async (req, res) => {
            try {
                const data = await prisma.product.create({
                    data: {
                        title: req.body.title,
                        image: req.body.image
                    }
                })
                // channel.assertQueue("product_created", { durable: false });
                channel.sendToQueue("product_created", Buffer.from(JSON.stringify(data)))
                return res.send(data)
            }
            catch (error) {
                return res.send(error)
            }
        })

        // update product
        app.put("/api/product/:id", async (req, res) => {
            try {
                const data = await prisma.product.update({
                    data: {
                        title: req.body.title,
                        image: req.body.image
                    },
                    where: {
                        id: parseInt(req.params.id)
                    }
                })
                channel.sendToQueue("product_updated", Buffer.from(JSON.stringify(data)))
                return res.send(data)
            }
            catch (error) {
                return res.send(error)
            }
        })

        // delete product
        app.delete("/api/product/:id", async (req, res) => {
            try {
                const data = await prisma.product.delete({
                    where: {
                        id: parseInt(req.params.id)
                    }
                })
                channel.sendToQueue("product_deleted", Buffer.from(JSON.stringify(data)))
                return res.send(data)
            }
            catch (error) {
                return res.send(error)
            }
        })

        // like a proeuct
        app.post("/api/product/:id/like", async (req, res) => {
            try {
                const data = await prisma.product.update({
                    data: {
                        likes: { increment: 1 }
                    },
                    where: {
                        id: parseInt(req.params.id)
                    }
                })
                channel.sendToQueue("product_likes", Buffer.from(JSON.stringify(data)))
                return res.send(data)
            }
            catch (error) {
                return res.send(error)
            }
        })

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