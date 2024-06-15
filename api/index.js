const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const route = require("./routes/routes");
const crypto = require('crypto');
const { Cashfree } = require('cashfree-pg');

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(express.urlencoded({ extended: true }));
const clientId = '70289744cdf2b19771f93acdf4798207';
const clientSecret = 'cfsk_ma_prod_b6534c0b38999ccb90b003ea95d8ea74_a6cedfa9';



Cashfree.XClientId = clientId;
Cashfree.XClientSecret = clientSecret;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

const generateOrderId = () => {
  const unique = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(unique);
  const orderId = hash.digest('hex');
  return orderId.substr(0, 12);
};

const generatePaymentSessionId = () => {
  const unique = crypto.randomBytes(16).toString('hex');
  return unique;
};

app.get('/payment', async (req, res) => {
  try {
    const orderId = generateOrderId();
    const orderAmount = 1.00;
    const orderCurrency = 'INR';
    const customerDetails = {
      customer_id: 'we3299',
      customer_phone: '9791818045',
      customer_email: 'azhaguazhagu30@gmail.com',
    };

    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      customer_details: customerDetails,
      version: '2023-08-01', // Update with a supported version
    };

    // Generate and store payment_session_id
    const paymentSessionId = generatePaymentSessionId();
    // Assuming you store or generate payment_session_id in your order creation process
    request.payment_session_id = paymentSessionId;

    Cashfree.PGCreateOrder('2023-08-01', request).then((response) => {
      console.log(response.data);
      res.json(response.data);
    });
  } catch (error) {
    console.error('Error creating order', error);
    res.status(500).json({ error: 'Failed to create order' });
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
app.use('/get',route)
app.use('/lists',route)
app.use('/pay',route)
app.use('/count',route)
app.use('/review',route)
app.use('/total',route)

mongoose.connect(
  "mongodb+srv://azhaguazhagu30:j2oW5hkGVUwR2tG7@cluster0.ipwnl5f.mongodb.net/dualdealmart?retryWrites=true&w=majority&appName=Cluster0"
);

app.listen(process.env.PORT || 3001, () => {
  console.log("Server connected");
});
