import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import { app } from '../firebase'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";





const Google = () => {
    const navigate = useNavigate()
    const handleGoogle=(async(e)=>{
      try {
          e.preventDefault()
          const provider = new GoogleAuthProvider();
          const auth =  getAuth(app)
          const result = await signInWithPopup(auth,provider)
          await axios.post("https://dualdealmart.onrender.com/google/auth",{name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
          .then((res)=>{
               if(res.data==="ok"){
                  toast.success("user created successful")
                  navigate('/sign-in')
               }
               else{
                  toast.error("user already exist")
               }
          })
      } catch (error) {
          
      }
    })
  
    return (
      <div>
          <button type='button' onClick={((e)=>{handleGoogle(e)})} className='text-white p-3 bg-red-400 uppercase rounded-lg hover:text-red-400 hover:bg-white'>continue with google</button>
      </div>
    )
}

export default Google