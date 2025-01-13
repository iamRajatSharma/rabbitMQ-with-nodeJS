import express, { Request, Response } from "express"
import cors from "cors";
const dotenv = require("dotenv")
dotenv.config()
const app = express();

const PORT = 8001;
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
}));

app.use(express.json())



app.listen(PORT, () => {
    console.log('Server started on port : ' + PORT)
})