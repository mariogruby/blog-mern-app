import { Schema, model } from "mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    userImage: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
    },
    userPost: [{
        type: Schema.Types.ObjectId,
        ref: "Post",
    }],
    likedPost: [{
        Post: { type: Schema.Types.ObjectId, ref: 'Post' },
        liked: { type: Boolean, default: false },
    }],
},
    { timestamps: true }
);

const User = model("User", userSchema)

export default User;