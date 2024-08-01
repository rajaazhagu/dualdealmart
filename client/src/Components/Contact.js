import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BsSendFill } from "react-icons/bs";

const Contact = ({list}) => {
    const [message,setMessage] = useState('')
  return (
    <div className='h-30'>
        <p className='font-semibold ml-1'>Contact Detail:{list[0].email}</p>
        <textarea name='message' id='message' rows='2' value={message} onChange={((e)=>setMessage(e.target.value))} placeholder='Enter your meesage here' required className='w-full border p-3 rounded-lg'/>
        <Link to={`mailto:${list[0].email}?subject=Regarding ${list[0].name}&body=${message}`} className='h-10'>
            <div className='flex gap-1 ml-20'>
            <BsSendFill className='ml-5 mt-1.5' />
            <p className='font-semibold'>send message</p>
            </div>
        </Link>
    </div>
  )
}

export default Contact