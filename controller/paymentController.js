require("dotenv").config()
const stripe = require("stripe")(process.env.Stripe_Key)

const paymentIntent = async (req, res) => {
    try {
        const intent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true
            }
        })        
        res.json({ paymentIntent: intent.client_secret })
    } catch (error) {
        res.json({message : error}).status(500)
    }
    
}


module.exports = {
    paymentIntent
}