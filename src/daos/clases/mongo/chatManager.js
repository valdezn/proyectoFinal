import mongoose from 'mongoose';
import { messagesModel } from '../../models/messages.model.js';

export default class ChatManager {
    connection = mongoose.connect(process.env.MONGO_URL)

    messagesSave = async (message) => {
        const messages = await messagesModel.create(message)
        return messages
    }
} 