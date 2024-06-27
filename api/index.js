const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const route = require("./routes/routes");
const { Cashfree } = require('cashfree-pg');
const crypto = require('crypto');
const helmet = require('helmet');

app.use(helmet());
app.use(cors());
app.use(express.json());
dotenv.config();
app.use(express.urlencoded({ extended: true }));
Cashfree.XClientId=process.env.CLIENT_ID
Cashfree.XClientSecret=process.env.CLIENT_SECRET
Cashfree.XEnvironment=Cashfree.Environment.PRODUCTION
function getOrderId() {
  const unique = crypto.randomBytes(8).toString('hex');
  return unique.substr(0, 12); // 12 characters long
}


// Endpoint to initiate payment
app.get("/payment", async (req, res) => {
  try {
    const orderId = getOrderId();
    
    // Payment request payload
    const request = {
      order_amount: "1.00",
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: '1234erd',
        customer_phone: "9999999999",
        customer_name: "dual",
        customer_email: "Dual@gmail.com"
      }
    };

    // Call Cashfree PGCreateOrder method
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    res.json(response.data); // Return response to client
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});
app.get("/list-pay", async (req, res) => {
  try {
    const orderId = getOrderId();
    
    // Payment request payload
    const request = {
      order_amount: "1.00",
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: '1234erd',
        customer_phone: "9999999999",
        customer_name: "dual",
        customer_email: "Dual@gmail.com"
      }
    };

    // Call Cashfree PGCreateOrder method
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    res.json(response.data); // Return response to client
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Ensure routes are correctly mounted
app.use("/api", route);
app.use("/user", route);
app.use("/auth", route);
app.use("/google", route);
app.use("/detail", route);
app.use('/update',route)
app.use('/delete',route)
app.use('/Create',route)
app.use('/Creating',route)
app.use('/get',route)
app.use('/lists',route)
app.use('/pay',route)
//app.use('/count',route)
app.use('/review',route)
app.use('/total',route)
app.use('/all',route)
app.use('/updating',route)

app.get("/ping", (req, res) => {
  res.send("Ping received");
});

mongoose.connect(
  "mongodb+srv://azhaguazhagu30:j2oW5hkGVUwR2tG7@cluster0.ipwnl5f.mongodb.net/dualdealmart?retryWrites=true&w=majority&appName=Cluster0"
);

app.listen(process.env.PORT || 3002, () => {
  console.log("Server connected");
});
