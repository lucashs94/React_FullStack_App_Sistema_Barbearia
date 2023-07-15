import { Request, Response } from "express"
import Stripe from "stripe"
import { stripe } from "../../utils/stripe"
import { saveSubscription } from "../../services/subscriptions/manageSubscription"


export class WebhooksController{
  async handle(req: Request, res: Response){

    let event:Stripe.Event = req.body

    const signature = req.headers['stripe-signature']

    let endpointSecret = 'whsec_c0ec3955b741f9dc998606733120d5fb32bab8f346bd34d69b6c907f7a3c85c7'

    try {
      event = stripe.webhooks.constructEvent( req.body, signature, endpointSecret )
    } catch (error) {
      return res.sendStatus(400).send(`Webhook Error: ${error.message}`)
    }

    switch(event.type){
      case 'customer.subscription.deleted':
        const payment = event.data.object as Stripe.Subscription

        await saveSubscription(
          payment.id,
          payment.customer.toString(),
          false,
          true,
        )
        break
      
      case 'customer.subscription.updated':
        const paymentIntent = event.data.object as Stripe.Subscription

        await saveSubscription(
          paymentIntent.id,
          paymentIntent.customer.toString(),
          false,
        )
        break

      case 'checkout.session.completed':
        const checkoutSession = event.data.object as Stripe.Checkout.Session

        await saveSubscription(
          checkoutSession.subscription.toString(),
          checkoutSession.customer.toString(),
          true,
        )
        break
      
      default:
        console.log(`Evento desconhecido ${event.type}`);
    }


    res.send()
  }
}