import { Listener, OrderCreatedEvent, Subjects } from '@ticketing-kk/common'
import { Message } from 'node-nats-streaming'
import { QueueGroupName } from './queue-group-name'
import Ticket from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = QueueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) throw new Error('Ticket not found')

        ticket.set({ orderId: data.id })
        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            version: ticket.version,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
        })

        msg.ack()
    }
}
