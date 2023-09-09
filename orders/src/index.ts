import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'

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
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdatedListener(natsWrapper.client).listen()

        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDb')
    } catch (err) {
        console.error(err)
    }

    app.listen(3002, () => {
        console.log('Listening on port 3002!!!!!!!!')
    })
}

start()
