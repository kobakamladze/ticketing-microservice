import {
    Listener,
    OrderCreatedEvent,
    OrderStatus,
    Subjects,
} from '@ticketing-kk/common'
import { Message } from 'node-nats-streaming'
import { QueueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = QueueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        await expirationQueue.add({
            orderId: data.id,
        })

        msg.ack()
    }
}
