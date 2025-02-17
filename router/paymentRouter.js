const express = require("express")
const { paymentIntent } = require("../controller/paymentController")

const router = express()


router.post("/payment/intents", paymentIntent)


module.exports = router
