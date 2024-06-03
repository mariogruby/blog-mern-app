import { Schema, model } from 'mongoose'

const tagSchema = new Schema({
    tagName: {
        type: String,
    },
    posts : [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

const Tag = model("Tag",tagSchema);

export default Tag;