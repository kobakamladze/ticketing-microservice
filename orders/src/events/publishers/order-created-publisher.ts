import { Publisher, OrderCreatedEvent, Subjects } from '@ticketing-kk/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}
