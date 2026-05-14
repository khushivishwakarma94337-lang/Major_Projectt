const Razorpay=require("razorpay");
const crypto=require("crypto");
const razorpayInstance=new Razorpay({
  key_id:process.env.RAZORPAY_KEY,
  key_secret:process.env.RAZORPAY_SECRET,
})
module.exports.createOrder = async (req, res) => {

    try {

        const { amount } = req.body;

        const options = {

            amount: amount * 100,

            currency: "INR",

        };

        const order =
        await razorpayInstance.orders.create(options);

        return res.json(order);

    } catch (error) {

        console.log(error);

    }

}


module.exports.verifyPayment = async (req, res) => {



        req.flash("success", "Payment Successful");

        return res.redirect("/listings");

    } 