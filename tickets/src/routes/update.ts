import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError,
    currentUser,
} from '@ticketing-kk/common'

import Ticket from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = Router()

router.put(
    '/api/tickets/:id',
    currentUser,
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be provided and must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        console.log(req.params.id)
        const ticket = await Ticket.findById(req.params.id)

        if (!ticket) throw new NotFoundError()
        if (ticket.userId !== req.currentUser!.id)
            throw new NotAuthorizedError()

        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            userId: ticket.userId,
            title: ticket.title,
            price: ticket.price,
            version: ticket.version,
        })

        res.send({})
    }
)

export { router as updateTicketRouter }
