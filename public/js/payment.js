async function payNow(price) {

    // CREATE ORDER
    const res = await fetch("/createOrder", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            amount: price
        })

    });

    const order = await res.json();

    console.log(order);

    const options = {

        key: "rzp_test_SoYmm54yT731mE",

        amount: order.amount,

        currency: order.currency,

        order_id: order.id,

        name: "My Store",

        description: "Listing Payment",

        handler: function(response) {

            window.location.href ="/verifyPayment";

        }

    };

    const rzp = new Razorpay(options);

    rzp.open();
}