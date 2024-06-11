import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import { app } from '../firebase'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";


const OAuth = ({user,setUser}) => {
     const Fetchdata=(async(result)=>{
        try {
            await axios.post("https://dualdealmart.onrender.com/detail/get",{email:result.user.email})
            .then((res)=>{
               setUser(res.data)
            })
          } catch (error) {
            console.log(error)
          }
     })
    const navigate = useNavigate()
  const handleGoogle=(async(e)=>{
    try {
        e.preventDefault()
        const provider = new GoogleAuthProvider();
        const auth =  getAuth(app)
        const result = await signInWithPopup(auth,provider)
        await axios.post("https://dualdealmart.onrender.com/auth/google",{name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
        .then((res)=>{
             if(res.data==="ok"){
                toast.success("login successful")
                navigate('/')
                Fetchdata(result)
             }
             else{
                toast.error("user not exist")
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

export default OAuth