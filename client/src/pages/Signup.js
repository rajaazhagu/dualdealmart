import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from "react-toastify";
import Google from '../Components/Google';


const Signup = ({user,setUser}) => {

  const navigate=useNavigate()
   const [formData,setFormData]=useState()
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

  const handleSubmit=(async(e)=>{
    e.preventDefault()
   try {
     await axios.post("https://dualdealmart.onrender.com/api/signup",{...formData,photo:'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'})
     
    .then((res)=>{
       if(res.data==="user"){
        navigate('/sign-in')
        toast.success("user created")
        handleFetch()
       }
       else{
        toast.error(" username or email already exist")
       }
    })
    
   } catch (error) {
    console.log(error)
   }
  })
 
  return (
    <div className='w-100'>
      <h1 className="text-3xl text-center font-semibold my-7 text-blue-800">Signup</h1>
      <form onSubmit={((e)=>{handleSubmit(e)})} className='flex flex-col gap-4 w-100 items-center justify-center'>
        <input type='text' onChange={((e)=>{handleChange(e)})} placeholder='username' className='border rounded-lg p-3 focus:outline-none w-80 ' id='name' required/>
        <input type='email'  onChange={((e)=>{handleChange(e)})} placeholder='email' className='border rounded-lg p-3 focus:outline-none w-80' id='email' required/>
        <input type='password' onChange={((e)=>{handleChange(e)})} placeholder='password' className='border rounded-lg p-3 focus:outline-none w-80 '  id='password'required/>
        <button className='bg-slate-700 text-white w-60 p-3 rounded-lg uppercase hover:opacity-95'>signup</button>
        <Google user={user} setUser={setUser}/>
      </form>
      <div className='flex gap-2 mt-5 items-center justify-center'>
        <p>Have an Account?</p>
        <Link to='/sign-in'><span className='text-blue-700'>Signin</span></Link>
      </div>
      <div className='flex gap-2 mt-3 justify-center text-blue-700'>
        <Link to='/contactus'>contact |</Link>
        <Link to='/privacypolicy'>privacypolicy |</Link>
      </div>
      <div className='flex gap-2 mt-3 justify-center text-blue-700'>
      <Link to='/termsandcondition'>Terms and conditions |</Link>
      <Link to='/refund'>Refund</Link>
      </div>
    </div>
  )
}

export default Signup