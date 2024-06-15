import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {toast } from 'react-toastify';
import axios from 'axios'
import OAuth from '../Components/OAuth';
const Signin = ({user,setUser}) => {

  const navigate=useNavigate()
   const [formData,setFormData]=useState({})
  const handleChange=((e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  })
  const handleFetch =(async()=>{
    try {
      await axios.post("https://dualdealmart.onrender.com/detail/get",{email:formData.email})
      .then((res)=>{
        setUser(res.data)
      })
    } catch (error) {
      console.log(error)
    }
  })

  const handleSubmit=((e)=>{
    
    e.preventDefault()
   try {
      axios.post("https://dualdealmart.onrender.com/user/signin",formData)
     
    .then((res)=>{
       if(res.data==="success"){
        toast.success("login successfull")
        navigate('/')
        handleFetch()
       }
       else if(res.data==="wrong password"){
        toast.error("wrong password")
       }
       else if(res.data==="no"){
        toast.error("No account found")
       }
    })
    
   } catch (error) {
    console.log(error)
   }
  })
 
  return (
    <div className='w-100'>
      <h1 className="text-3xl text-center font-semibold my-7 text-blue-800">Signin</h1>
      <form onSubmit={((e)=>{handleSubmit(e)})} className='flex flex-col gap-4 w-100 items-center justify-center'>
        <input type='email' onChange={((e)=>{handleChange(e)})} placeholder='email' className='border rounded-lg p-3 focus:outline-none w-80 ' id='email' required/>
        <input type='password' onChange={((e)=>{handleChange(e)})} placeholder='password' className='border rounded-lg p-3 focus:outline-none w-80 '  id='password'required/>
        <button className='bg-slate-700 text-white w-60 p-3 rounded-lg uppercase hover:opacity-95'>signi</button>
        <OAuth user={user} setUser={setUser} />
      </form>
      <div className='flex gap-2 mt-5 items-center justify-center'>
        <p>Don't have an Account?</p>
        <Link to='/sign-up'><span className='text-blue-700'>Signup</span></Link>
      </div>
      <div className='flex gap-2 mt-3 justify-center text-blue-700'>
        <Link to='/contactus'>contact |</Link>
        <Link to='/privacypolicy'>privacypolicy |</Link>
      </div>
      <div className='flex gap-2 mt-3 justify-center text-blue-700'>
      <Link to='/terms and condition'>Terms and conditions |</Link>
      <Link to='/refund'>Refund</Link>
      </div>
    </div>
  )
}

export default Signin