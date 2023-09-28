import mongoose from "mongoose";

const chatsCollection = 'chats'

const chatsSchema = new mongoose.Schema({
    user: String,
    message: String
})

export const chatsModel = mongoose.model(chatsCollection, chatsSchema)