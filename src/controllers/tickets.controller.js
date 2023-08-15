import TicketsManager from "../daos/clases/mongo/ticketsManager.js"

export default class TicketsController {
    constructor() {
        this.ticketsManager = new TicketsManager()
    }
    async addTicketController (ticket) {
        
        const result = await this.ticketsManager.addTicket(ticket)
        return result
    }
}