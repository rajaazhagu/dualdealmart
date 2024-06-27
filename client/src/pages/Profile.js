import React, { useEffect, useState, useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../slices/authSlice';

const Profile = ({user,setUser}) => {
  const fileRef = useRef(null);
  const Navigate =useNavigate()
  const [file, setFile] = useState(null);
  const [list,setList] = useState([])
  const [pay,setpay]=useState(false)
  const [filePer, setFilePer] = useState(0);
 
 
  const [fileError, setFileError] = useState(false);
  

  
  useEffect(() => {
    if (file) {
      handleFile(file);
    }
    handleFetch()
  }, [file]);
  const handleFetch = async () => {
    try {
      const response = await axios.post("https://dualdealmart.onrender.com/detail/get", { email: formData.email });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    photo: user.photo
  });

  const handleFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '_' + file.name; // Using file.name

    try {
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePer(Math.round(progress));
        },
        (error) => {
          console.error('Upload failed:', error);
          setFileError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData(prevFormData => ({ ...prevFormData, photo: downloadURL }));
          });
        }
      );
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const oldmail = user.email;
      const response = await axios.post("https://dualdealmart.onrender.com/update/user", { ...formData, oldmail });
      if (response.data === 'updated') {
        toast.success('Profile updated successfully');
        handleFetch();
        handleSignout()
      } else {
        toast.error('Profile not updated');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred during profile update');
    }
  };
  

  const handleDelete=(async()=>{
     try {
       await axios.post('https://dualdealmart.onrender.com/delete/profile',{email:user.email})
       .then((res)=>{
           if(res.data==='deleted'){
            toast.success("Profile deleted")
            handleSignout()
            handleFetch()
           }
           else{
            toast.error("not deleted")
           }
       })
     } catch (error) {
          alert(error)
     }
  })
  const dispatch = useDispatch();

   const handleSignout=(()=>{
      Navigate('/sign-in')
      dispatch(clearUser());

      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success("signed out successfully")
      setUser("")
   })

  const handleShow =(async()=>{
    try {
      await axios.get('https://dualdealmart.onrender.com/get/lists')
      .then((res)=>{
        if(res.data){
          const data =res.data.data.filter((single)=>(user.email===single.email))
          setList(data)
        }
      })
    } catch (error) {
      alert(error)
    }
  })

 const handleDeleteList =(async(id)=>{
  try {
    await axios.post("https://dualdealmart.onrender.com/lists/delete",{id})
    .then((res)=>{
        if(res.data==='deleted'){
          toast.success('deleted')
          handleShow()
        }
    })
  } catch (error) {
     alert(error)
  }
 })

 useEffect(()=>{
     if( user.count<=30){
       setpay(true)
     }
 },[user])
   



  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 text-slate-700'>My Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          className='hidden'
          type='file'
          ref={fileRef}
          accept='image/*'
        />
        <img
          className='rounded-full h-24 w-24 self-center mt-2 object-cover cursor-pointer'
          alt='profile'
          onClick={() => fileRef.current.click()}
          src={formData.photo || user.photo}
        />
        <div className='self-center'>
          {fileError ? (
            <span className='text-red-700'>Upload failed (image should be less than 2MB)</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePer}%`}</span>
          ) : filePer === 100 ? (
            <span className='text-green-500'>Uploaded successfully</span>
          ) : (
            ""
          )}
        </div>

        <input
          type='text'
          placeholder='Username'
          className='border p-3 rounded-lg'
          id='name'
          defaultValue={user.name}
          onChange={handleInput}
        />
        <input
          type='email'
          placeholder='Email'
          defaultValue={user.email}
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleInput}
        />
        <input
          type='password'
          required
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleInput}
        />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80'>
          Update
        </button>
        {user.date
        ?
        <Link to='/create-Listing' className='text-white bg-red-700 rounded-lg p-3 text-center uppercase hover:opacity-85'>create Listing</Link>
        :
        <Link to='/payment' className='text-white bg-red-700 rounded-lg p-3 text-center uppercase hover:opacity-85'>pay</Link>
        }
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={((e)=>{handleDelete(e)})}>Delete account</span>
        <span className='text-red-700 cursor-pointer' onClick={(()=>{handleSignout()})}>Sign out</span>
      </div>
      {!user.date ? <p className='font-bold text-center my-4'>Please Pay and Continue your Listings</p>
       : <button onClick={(()=>{handleShow()})} className='text-green-700 w-full'>Show Listings</button>
       }
       {list.length >0 && list.map((single)=>(
        <div key={single._id} className='border p-3 flex  items-center justify-between rounded-lg gap-4 sm:gap-20'>
            <Link to ={`/listing/${single._id}`}>
              <img className='h-20 w-20 object-contain' src={single.imageURLs[0]} alt='listsimage' />
            </Link>
            <Link to ={`/listing/${single._id}`}>
              <p className='font-semibold text-slate-700 hover:underline'>{single.name}</p>
            </Link>
              <button className='text-red-700' type='buttton' onClick={(()=>{handleDeleteList(single._id)})}>Delete</button>
             <Link to={`/updatelisting/${single._id}`}> <button className='text-blue-700' type='buttton'>Edit</button> </Link>
        </div>
      ))}
    </div>
  );
};

export default Profile;
