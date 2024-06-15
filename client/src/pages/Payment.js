import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';

const Payment = () => {
  const [order_id, setOrder_id] = useState('');
  let cashfree;

  const initializeStk = async () => {
    try {
      cashfree = await load({
        mode: 'production',
      });
    } catch (error) {
      console.error('Error initializing Cashfree SDK', error);
    }
  };

  useEffect(() => {
    initializeStk();
  }, []);

  const getSessionId = async () => {
    try {
      const res = await axios.get('https://dualdealmart.onrender.com/payment');
      if (res.data && res.data.payment_session_id) {
        console.log(res.data);
        setOrder_id(res.data.order_id);
        return res.data.payment_session_id;
      }
      throw new Error('payment_session_id not found');
    } catch (error) {
      console.error('Error fetching session ID', error);
      throw error; // Propagate error for debugging
    }
  };

  const handleCheck = async () => {
    try {
      const sessionId = await getSessionId();
      if (!sessionId) {
        throw new Error('payment_session_id not retrieved');
      }

      const checkoutOptions = {
        paymentSessionId: sessionId, // Ensure correct key 'paymentSessionId'
        redirectTarget: '_self',
      };

      cashfree.checkout(checkoutOptions).then((res) => {
        console.log('Checkout opened successfully', res);
      });
    } catch (error) {
      console.error('Error opening checkout', error);
    }
  };

  return (
    <div>
      <button onClick={handleCheck}>Pay</button>
    </div>
  );
};

export default Payment;
