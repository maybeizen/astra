import OpenTicket from "./open-ticket";
import CloseTicket from "./close-ticket";
import DeleteTicket from "./delete-ticket";
import TicketTranscripts from "./transcript";
import TicketStaff from "./staff";

class Ticket {
  constructor() {}

  public open() {
    return new OpenTicket();
  }

  public reopen() {
    return new OpenTicket();
  }

  public close() {
    return new CloseTicket();
  }

  public delete() {
    return new DeleteTicket();
  }

  public transcript() {
    return new TicketTranscripts();
  }

  public staff() {
    return new TicketStaff();
  }
}

export default Ticket;
