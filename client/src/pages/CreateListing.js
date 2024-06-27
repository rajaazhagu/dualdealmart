import { getStorage, uploadBytesResumable,ref, getDownloadURL} from 'firebase/storage'
import React, { useState } from 'react'
import { app } from '../firebase'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CreateListing = ({user,setFetch,fetch}) => {
    const [files,setFiles]=useState([])
    const [filePer, setFilePer] = useState(0);
    const [formData,setFormData] = useState({ email:user.email,type:'rent',offer:false,imageURLs:[]})
    const handleImageSubmit=(()=>{
         if(files.length >0 && files.length + formData.imageURLs.length < 7){
            const promise =[]
            for(let i=0 ;i<files.length;i++){
                promise.push(storeImage(files[i]))
            }
         Promise.all(promise).then((urls)=>{
            setFormData({...formData,imageURLs:formData.imageURLs.concat(urls)})
         })
         }
         else{
            toast.error('minimum 6 images only upload')
         }
    })
    const navigate = useNavigate()

    const storeImage =(async(file)=>{
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage,fileName)
            const uploadTask = uploadBytesResumable(storageRef,file)

            uploadTask.on('state_changed',((snapshot)=>{
                const progress= (snapshot.bytesTransferred/snapshot.totalBytes)*100
                setFilePer(Math.round(progress));
            }),
            (error)=>{
                reject(error)
            }, 
           ()=>{ getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            resolve(downloadURL)
           })}
            )
          
        })
    })
    const handleRemove=((index)=>{
       setFormData({...formData,imageURLs:formData.imageURLs.filter((_,i)=>(i!==index))})
    })
    const handleChange=((e)=>{
        if(e.target.id==='sell'||e.target.id==='rent'){
            setFormData({...formData,type:e.target.id})
        }
        else if(e.target.id==='offer'){
            setFormData({...formData,[e.target.id]:e.target.checked})
        }
        else{
        setFormData({...formData,[e.target.id]:e.target.value})
        }
    })
    const handleSubmit=(async(e)=>{
        e.preventDefault()
       try {
        if(formData.imageURLs.length===0){
            toast.error('upload atleast one image')
            return
        }
        else if(formData.price<formData.discountprice){
              toast.error("price should be greater than discount price")
              return
        }
        await axios.post("https://dualdealmart.onrender.com/create/List",formData)
      
        .then((res)=>{
            if(res.data==='created'){
                toast.success('List created successfully')
                setFetch(!fetch)
                navigate('/')
            }
            else{
                toast.error('not created')
            }
        })
       } catch (error) {
         toast.error(error)
       }
    })
   
  return (
    <div className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
        <form className='flex flex-col sm:flex-row gap-10' onSubmit={((e)=>handleSubmit(e))}>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' id='name' required className='border p-3 rounded-lg' onChange={((e)=>handleChange(e))}/>
                <textarea type='text' placeholder='Description of your item' id='description' required className='border p-3 rounded-lg' onChange={((e)=>handleChange(e))}/>
                <input type='text' placeholder='Address' id='address' required className='border p-3 rounded-lg' onChange={((e)=>handleChange(e))}/>
                <input type='text' placeholder='Phone Number' id='phone' required className='border p-3 rounded-lg' onChange={((e)=>handleChange(e))}/>
                <div className='flex flex-row gap-7'>
                    <div className='flex gap-2'>
                        <input type='checkbox' className='w-5' id='sell' onChange={((e)=>handleChange(e))} checked={formData.type==='sell'}/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' className='w-5' id='rent' onChange={((e)=>handleChange(e))} checked={formData.type==='rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' className='w-5' id='offer'  onChange={((e)=>handleChange(e))}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='flex gap-2'>
                           <input type='tel' id='price' placeholder='price' className='border p-3 rounded-lg'  onChange={((e)=>handleChange(e))}/>
                           <div className='flex flex-col'>
                            <p>Price</p>
                            {formData.type==='rent' && <span>(/month)or(/day)or/(/KM)</span>}
                           </div>
                    </div>
                    <div className='flex gap-2'>
                           <input type='tel' id='discountprice' placeholder='discountprice'  className='border p-3 h-12 rounded-lg'  onChange={((e)=>handleChange(e))}/>
                            <p className=''>Discounted Price</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-3'>
                <p className='font-semibold'>Images:
                   <span className='font-normal text-gray-600 ml-2'>The first image will be the cover(max-6)</span>
                </p>
                <div className='flex gap-4'>
                     <input type='file' onChange={((e)=>setFiles(e.target.files))} id='images' accept='image/*' multiple className='p-3 border border-slate-500'/>
                     <button type ='button' onClick={(()=>handleImageSubmit())} className='border h-10 my-4 border-green-500 text-green-400 rounded'>upload</button>
                </div>
                {
                    formData.imageURLs.length >0 && filePer===100 ?formData.imageURLs.map((urls,index)=>(
                    <div className='flex justify-between border p-3 items-center'>
                        <img alt ='uploaded images' src ={urls} className='w-20 h-20 rounded-lg object-content'/>
                        <button type='button' onClick={(()=>handleRemove(index))} className='p-3 text-red-600 rounded-lg uppercase hover:opacity-95'>Delete</button>
                    </div>)):<p className='text-center'>uploading {filePer}% wait until image dispaly below</p>
                }
                <button className='p-3 bg-slate-600 text-white rounded-lg uppercase'>Create Listing for free</button>
                <h1 className='text-center font-bold'>or</h1>
                <h1 className='font-semibold'><span className='text-xl font-semibold'>Note :</span>Premium listing can notify all users with your listings through mail and appear in top products!!</h1>
                <button onClick={(()=>navigate('/premium-listing'))} type='button' className='p-3 bg-red-700 text-white rounded-lg uppercase'>Premium pack</button>
            </div>
        </form>
         
    </div>
  )
}

export default CreateListing