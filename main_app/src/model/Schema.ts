import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
    admin_id: {
        type: Number
    },
    title: {
        type: String
    },
    image: {
        type: String
    }
})

module.exports = mongoose.model("prosucts", ProductSchema)