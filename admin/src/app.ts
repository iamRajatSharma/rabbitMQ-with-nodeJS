import express from "express"
import cors from "cors"
// import { PrismaClient } from "@prisma/client"
// const prisma = new PrismaClient()

const app = express();
const PORT = 8000;
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
}));

app.use(express.json())


app.listen(PORT, (err: any) => {
    if (err) {
        console.log('Error : ' + err)
        return
    }
    console.log('Server started on port : ' + PORT)
})