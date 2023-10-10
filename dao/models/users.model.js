import mongoose from "mongoose";

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    is_admin: Boolean
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;