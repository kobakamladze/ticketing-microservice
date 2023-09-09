import { Publisher, Subjects, TicketCreatedEvent } from '@ticketing-kk/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}
