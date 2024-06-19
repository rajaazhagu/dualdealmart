import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth"
import { app } from '../firebase'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { setuser } from '../slices/authSlice'; // Adjust the path as per your project structure


const OAuth = ({user,setUser,fetch,setFetch}) => {
     const dispatch = useDispatch();
    const navigate = useNavigate()
  const handleGoogle=(async(e)=>{
    try {
        e.preventDefault()
        const provider = new GoogleAuthProvider();
        const auth =  getAuth(app)
        const result = await signInWithPopup(auth,provider)
        const response = await axios.post("https://dualdealmart.onrender.com/auth/google",{name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
           
              const { user, token } = response.data; 
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              dispatch(setuser(user));
              toast.success('Login successful');
              navigate('/')
              setFetch(!fetch)
              if(response.data==='no'){
                toast.error("No user found")
              }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please check your credentials.');
    }
  })

  return (
    <div>
        <button type='button' onClick={((e)=>{handleGoogle(e)})} className='text-white p-3 bg-red-400 uppercase rounded-lg hover:text-red-400 hover:bg-white'>continue with google</button>
    </div>
  )
}

export default OAuth