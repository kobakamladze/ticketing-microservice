import { Subjects, Publisher, OrderCancelledEvent } from '@ticketing-kk/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
