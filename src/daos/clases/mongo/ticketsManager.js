import mongoose from "mongoose";
import { ticketsModel } from "../../models/tickets.model.js";


export default class TicketsManager {
    connection = mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 30000 })
  
    addTicket = async (ticket) => {
        const result = await ticketsModel.create(ticket)
        return result
    }
}