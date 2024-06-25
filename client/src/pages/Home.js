import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';


const Home = ({list,user}) => {
     
  const dateMonth = new Date()
 /* const handlePost =(async()=>{
    try {
      let date = dateMonth.getDate()
      let month = dateMonth.getMonth()+1
      let year = dateMonth.getFullYear()
      const email= user.email
      let count =user.count
      while(!(user.date===date) || !(user.month===month) || !(user.year===year)){
        if((user.date <= date||user.date >= date) && (user.month ===month || user.month<month) && user.date!==1 && user.year===year){
           ++count
           if(user.date !==30 && user.month!==2){
              ++user.date
           }
           else if(user.date!==29 && user.month===2){
               ++user.date
           }
           else if(date ===31){
            user.date++
           }
           else{
            user.date=1
          }
       }
       else if(user.month < month && user.date===1 && user.year===year){
         user.date++
         ++user.month
         ++count
       }
       else if(user.year<year){
          count=40
          break;
       }      
      }
      await axios.post('https://dualdealmart.onrender.com/count/update',{count,email})
    } catch (error) {
      alert(error)
    }
  })
  useEffect(()=>{
    if(user.date){
      handlePost()
    }
  },[user])*/

  
 
  return (
    <div>
      <div className='flex flex-col my-10 gap-6 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find Your Next<span className='text-slate-500'> Perfect</span></h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          <h2 className='font-semibold text-xl'><span className='text-black'>DualDealMart</span> is the place for rent and sell any products.</h2>
          <br/>
          <h2 className='font-semibold text-xl'>Pay <span className='text-black'>one </span> time for unlimited listings</h2><span className='text-black font-bold my-2 text-xl'>Rent it,Own it,Love it...</span>
        </div>
        <h1 className='flex justify-center font-bold text-slate-700 drop-shadow-lg text-2xl my-4'>Sale and Rent products !!</h1>
      </div>
         {
          list.length >0 ?
          <div className='flex flex-col gap-4 sm:flex-row flex-wrap'>
            {list.slice(0).reverse().map((single)=>(
              <Link to ={`/listing/${single._id}`}>
              <div className='shadow-lg border h-50 border-slate-200 bg-white rounded-lg mx-7 flex flex-col gap-1'>
                <img className='w-80 h-80 sm:w-40 h-40 self-center rounded-lg shadow-lg z-5' src={single.imageURLs[0]}/>
                <h1 className='text-slate-600 text-center '><span className='text-black text-1xl font-bold'>Category : </span>{single.name.slice(0,7)}{single.name.length >9 && '...'}</h1>
                <h1 className='text-slate-600 text-center '><span className='text-black text-1xl relative font-bold'>Price : </span>Rs.{single.price}</h1>
                <div className='flex flex-row gap-2  justify-center relative bottom-2'>
                  <p className='bg-red-900 my-2 text-white text-center  w-20 h-5 rounded-lg'>{single.type==='rent'?'For Rent':'For Sale'}</p>
                  {single.offer && <p className='bg-green-900 w-20 text-white h-5 text-center rounded-lg my-2'>offer</p>}
                </div>
               <div className='flex flex-col'>
                  <h1 className='text-center font-bold'>Review</h1>
                  <span className='text-2xl font-bold text-center'>{single.totalReview >0 && single.totalReview <=5 ?(single.totalReview).toFixed(1):single.totalReview>5 ? 5 :0}</span>
                  <div className='flex gap-4 justify-center'>
                    {[...Array(5)].map((_,index)=>
                        <FaStar size={20} color={index+1 <=(single.totalReview) ? 'gold':'grey'} />
                    )}
                </div>
            </div> 
              </div>
              </Link>
            ))}
          </div>
          :<div className='flex justify-center font-bold items-center relative top-20'><h1 className='text-3xl text-center'>Loading.....</h1></div>}
    </div>
  )
}

export default Home