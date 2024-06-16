import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    likes: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

const Comment = model("Comment", commentSchema)

export default Comment;