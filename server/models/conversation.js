import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        messages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Message",
                default: [],
            }
        ],
        unreadMessages: {
            type: Map,
            of: Number, // Clave: userId, Valor: cantidad de mensajes no leídos
            default: {}
        }
    },
    { timestamps: true });

const Conversation = model('Conversation', conversationSchema);

export default Conversation;