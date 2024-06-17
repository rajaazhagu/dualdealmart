import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';

const Payment = () => {
  const [orderId, setOrderId] = useState('');
  let cashfree;

  useEffect(() => {
    const initializeCashfree = async () => {
      try {
        cashfree = await load({
          mode: 'production'
        });
        console.log('Cashfree initialized');
      } catch (error) {
        console.error('Error initializing Cashfree:', error);
      }
    };

    initializeCashfree();
  }, []); // Empty dependency array ensures this effect runs only once

  const getSessionId = async () => {
    try {
      const res = await axios.get("https://dualdealmart.onrender.com/payment");
      
      if (res.data && res.data.payment_session_id) {
        console.log(res.data);
        setOrderId(res.data.order_id); // Update orderId state
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.error('Error fetching sessionId:', error);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const sessionId = await getSessionId();

      if (sessionId) {
        const checkOutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: '_self'
        };

        cashfree.checkout(checkOutOptions).then((response) => {
          console.log('Payment success:', response);
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Pay</button>
    </div>
  );
};

export default Payment;
