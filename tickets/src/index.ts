import mongoose from 'mongoose'
import crypto from 'crypto'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'

import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined')
    }

    try {
        await natsWrapper.connect(
            'ticketing',
            `tickets-${crypto.randomUUID()}`,
            'http://nats-srv:4222'
        )

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!')
            process.exit()
        })

        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()

        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDb')
    } catch (err) {
        console.error(err)
    }

    app.listen(3001, () => {
        console.log('Listening on port 3001!!!!!!!!')
    })
}

start()
