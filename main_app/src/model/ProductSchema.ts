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
    },
    likes: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("ProductSchema", ProductSchema)