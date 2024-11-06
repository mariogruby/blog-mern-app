import { Schema, model } from "mongoose";
import { removePostFromUsers } from "../middlewares/remove.js";

const postSchema = new Schema({
    content: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String,
        required: true,
    },
    tags: {
        type: [String]
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: {
        type: Number,
        default: 0,
    },
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    createAt: {
        type: Date,
        default: Date.now,
    },
},
{ timestamps: true }
);

postSchema.pre('deleteOne', { document: true, query: false }, removePostFromUsers);

const Post = model("Post", postSchema);

export default Post;
