import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Buy = ({ buy, user }) => {
  const form = useRef();
  const navigate =useNavigate()
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_y7xj0zf', 'template_idu1t8y', form.current, 'kAmXiNVYiUnGKFlVQ')
      .then(
        () => {
          toast.success('submitted');
          navigate('/');
        },
        (error) => {
          console.log('FAILED...', error.text);
        }
      );
  };

  return (
    <div className='max-w-[400px] mx-auto'>
      {user ? (
        <form
          ref={form}
          onSubmit={sendEmail}
          className='flex flex-col gap-1 h-90 max-w-[500px] mx-auto ml-1'
        >
          <input
            type='email'
            name='from_name'
            placeholder='Email'
            required
            className='border rounded-md my-3 h-20'
          />
          <input type='hidden' name='to_name' value={buy[0]?.email || ''} />
          <input
            type='tel'
            placeholder='Phone number for contact'
            required
            name='message'
            className='border rounded-md my-3 h-20'
          />
          <textarea
            type='text'
            placeholder='Message or quanity in words. example:I need 2'
            name='message'
            className='border rounded-md my-3 h-20'
          />
          <input
            type='text'
            placeholder='Address'
            name='message'
            className='border rounded-md my-3 h-20'
          />
          <input
            type='submit'
            value='Submit'
            className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80'
          />
        </form>
      ) : (
        <p className='flex font-semibold justify-center items-center my-20 text-2xl'>
          Sign in please
        </p>
      )}
    </div>
  );
};

export default Buy;
