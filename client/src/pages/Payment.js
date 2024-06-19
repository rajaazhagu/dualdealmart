import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Payment = ({ user, setUser }) => {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleFetch = async () => {
    try {
      const response = await axios.post("https://dualdealmart.onrender.com/detail/get", { email: user.email });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const getSessionId = async () => {
    try {
      const res = await axios.get("https://dualdealmart.onrender.com/payment");
      if (res.data && res.data.payment_session_id) {
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
      // Load cashfree each time handleClick is called
      const cashfree = await load({ mode: 'production' });

      const sessionId = await getSessionId();

      if (sessionId) {
        const checkOutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: '_modal'
        };

        cashfree.checkout(checkOutOptions).then(async (response) => {
          if (response.paymentDetails.paymentMessage === 'Payment finished. Check status.') {
            const dateMonth = new Date();
            const date = dateMonth.getDate();
            const month = dateMonth.getMonth() + 1;
            const year = dateMonth.getFullYear();
            const email = user.email;
            await axios.post("https://dualdealmart.onrender.com/pay/month", { email, date, month, year });
            handleFetch();
            navigate('/');
            toast.success('Payment successful');
          }
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center my-20 gap-3 w-150'>
      <button onClick={handleClick} className='bg-red-700 font-bold w-40 text-center hover:opacity-85 text-white'>Pay</button>
      <p className='text-black font-2xl ml-3 font-semibold'>Pay only 100 rupees for your Listings</p>
    </div>
  );
};

export default Payment;
