import TicketsModel from "../model/tickets.model.js";
export default class TicketsDao {
  static async createNewTicket(ticket) {
    return await TicketsModel.create(ticket);
  }

  static async getTicketByID(_id) {
    return MessageModel.findOne(_id).lean();
  }
}
