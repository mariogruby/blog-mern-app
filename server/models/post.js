import { Schema, model } from "mongoose";

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
    tag: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: {
        type: Number,
        default: 0,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
},
    { timestamps: true }
);

const Post = model("Post", postSchema);

export default Post;