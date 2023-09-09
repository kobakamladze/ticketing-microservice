import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketing-kk/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
