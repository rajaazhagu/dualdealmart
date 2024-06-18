// Signin.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OAuth from '../Components/OAuth'
const Signin = ({setFetch,fetch}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://dualdealmart.onrender.com/user/signin', formData);
      const { user, token } = response.data; 

     
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful');
      navigate('/')
      setFetch(!fetch)
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className='w-100'>
      <h1 className='text-3xl text-center font-semibold my-7 text-blue-800'>Signin</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-100 items-center justify-center'>
        <input
          type='email'
          onChange={handleChange}
          placeholder='Email'
          className='border rounded-lg p-3 focus:outline-none w-80'
          id='email'
          required
        />
        <input
          type='password'
          onChange={handleChange}
          placeholder='Password'
          className='border rounded-lg p-3 focus:outline-none w-80'
          id='password'
          required
        />
        <button className='bg-slate-700 text-white w-60 p-3 rounded-lg uppercase hover:opacity-95'>
          Sign In
        </button>
        <OAuth fetch={fetch} setFetch={setFetch}/>
      </form>
      <div className='flex gap-2 mt-5 items-center justify-center'>
        <p>Don't have an Account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Signup</span>
        </Link>
      </div>
    </div>
  );
};

export default Signin;
