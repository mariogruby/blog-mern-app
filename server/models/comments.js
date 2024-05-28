import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
},
    { timestamps: true }
);

const Comment = model("Comment", commentSchema)

export default Comment;