const express = require("express");

const router = express.Router();

const {
  createOrder,verifyPayment
} = require("../controllers/paymentController");

router.post("/createOrder", createOrder);
router.get("/verifyPayment",verifyPayment);

module.exports = router;