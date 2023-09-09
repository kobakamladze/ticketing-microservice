import { Publisher, TicketCreatedEvent, Subjects } from '@ticketing-kk/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}
