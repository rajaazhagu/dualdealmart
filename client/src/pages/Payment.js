import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Payment = ({user,setUser}) => {
const Navigate = useNavigate()
  const handleFetch = async () => {
    try {
      const response = await axios.post("http://localhost:3001/detail/get", { email: user.email });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const email =user.email
  const handleSubmit = () => {
    var options = {
      key: "rzp_test_x1H9K6rRM1TwVT",
      key_secret: "iOYDfzDLqCKhmXztUIjOupI4",
      amount: 50*100,
      currency: "INR",
      name: "Sale and Rent",
      description: "for testing purpose",
      handler: function (response) {
        try {
            
            const paymentId = response.razorpay_payment_id;
            const dateMonth = new Date()
            const date = dateMonth.getDate()
            const month =dateMonth.getMonth() + 1
            const year =dateMonth.getFullYear()
            const count = 0
            axios.post('http://localhost:3001/pay/month',{paymentId,email,date,month,count,year})
            .then((res)=>{
                if(res.data==='paid'){
                    handleFetch()
                    Navigate('/')
                }
            })

        } catch (error) {
            alert(error)
        }
       
      },
      theme: {
        color: "#07a291db",
      },
    };
    var pay = new window.Razorpay(options);
            pay.open();
  };

  return (
    <div className="flex justify-center flex-col items-center relative top-60">
      <button className="text-white bg-red-700 rounded-lg p-3 text-center uppercase hover:opacity-85" onClick={(()=>handleSubmit())}>Pay just 50 to create unlimited lists</button>
      <p className="font-semibold"> Press pay button and please wait until razor pay redirects to home page.Dont press any keys</p>
    </div>
  );
};

export default Payment;