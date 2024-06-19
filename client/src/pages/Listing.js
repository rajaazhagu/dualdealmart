import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaMapMarkedAlt } from 'react-icons/fa';
import Contact from '../Components/Contact';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Description from './Description';


const Listing = ({ user, userRating, setUserRating, setFetch, fetch,setBuy }) => {
  const [list, setList] = useState([]);
  const [contact, setContact] = useState(false);
  const [rating, setRating] = useState([]);
  const [hover, setHover] = useState(false);
  const [review, setReview] = useState(true);
  const param = useParams();
  const refer = useRef();

  console.log(user.email)
  useEffect(() => {
    axios.get('https://dualdealmart.onrender.com/get/lists')
      .then((res) => {
        if (res.data) {
          const data = res.data.data.filter((single) => single._id === param.listingId);
          console.log(data);
          setList(data);
          setBuy(data);
          const dataLength = data[0].userEmail.length;
          for (let i = 0; i < dataLength; i++) {
            if (data[0].userEmail[i] === user.email) {
              setReview(false);
              break;
            }
          }
          let totalRating = data[0].rating.reduce((acc, curr) => acc + curr, 0);
          const total = totalRating / data[0].rating.length;
          setUserRating(total);
          const id = data[0]._id;
          axios.post('https://dualdealmart.onrender.com/total/review', { total, id });
          setFetch(!fetch);
        }
      })
      .catch((error) => {
        console.error('Error fetching the list:', error);
      });
  }, [user]);

  const handleReview = async () => {
    try {
      const userEmail = [user.email, ...list[0].userEmail];
      const id = list[0]._id;
      const review = [...list[0].rating, rating];
      await axios.post("https://dualdealmart.onrender.com/review/change", { review, userEmail, id })
        .then((res) => {
          if (res.data === 'review') {
            toast.success(`Reviewed successfully for ${list[0].name}`);
            setHover(!hover);
          }
        });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      {list.length > 0 ? (
        <div>
          <Swiper
            modules={[Navigation]}
            navigation
            className="mySwiper"
          >
            {list[0].imageURLs.map((url) => (
              <SwiperSlide key={url}>
                <div className='swiper-slide-container' style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '450px' }}>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <h1 className='text-slate-600 text-2xl text-center my-2'><span className='text-black text-2xl font-bold'>Category: </span>{list[0].name}</h1>
          <h1 className='text-slate-600 text-2xl text-center my-2'><span className='text-2xl text-center text-black font-bold'>Price: </span>${list[0].price}{list[0].type === 'rent' && '/month'}</h1>
          <p className='flex items-center justify-center mt-6  text-slate-600 my-2 text-1xl'>
            <FaMapMarkedAlt className='text-green-600 text-center w-20 h-30' />
            {list[0].address}
          </p>
          <div className='flex flex-row gap-2 justify-center'>
            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg'>{list[0].type === 'rent' ? 'For Rent' : 'For Sale'}</p>
            {list[0].offer && <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-lg'>${list[0].price - list[0].discountprice} discount</p>}
          </div>
           <Description list={list}/>
          {list[0].type==='sell'&& user &&
              <div className='flex justify-center'>
                <Link to="/buy"><button className='bg-orange-600 text-white rounded-md mb-3 my-2 w-40 h-10'>Buy Now</button></Link>
              </div>
          }
          <div className='flex justify-center gap-4 w-100'>
            {user && !contact ? <button onClick={() => setContact(true)} className='bg-slate-700 w-60 h-8 rounded-lg text-white my-2'>Mail</button> : !user ? <Link to='/sign-in' className='bg-slate-700 w-60 h-8 rounded-lg text-white text-center my-5'>Sign-in</Link> : ''}
            {contact && user ? <Contact list={list} /> : ''}
            {(user && !contact) && <p className='font-bold my-2'>or</p>}
            {(user && !contact) && <p className='bg-slate-700 w-60 h-8 rounded-lg text-white text-center my-2'>Call: {list[0].phone}</p>}
          </div>
          <div className='flex text-center font-semibold justify-center'>
            {user && review && <h1 className='text-2xl my-2'>Your Review</h1>}
          </div>
          {user && review ? (
            <div className='flex gap-5 justify-center'>
              {[...Array(5)].map((_, index) =>
                <label key={index}>
                  <input
                    type='radio'
                    value={index + 1}
                    name='rating'
                    onClick={() => setRating(index + 1)}
                    className='hidden'
                    ref={refer}
                  />
                  <FaStar size={35} color={index + 1 <= rating ? 'gold' : 'grey'} onClick={() => refer.current.click()} />
                </label>
              )}
            </div>
          ) : ''}
          <div className='flex justify-center'>
            {user && review && <button className='bg-slate-700 w-60 h-8 rounded-lg text-white text-center my-2' onClick={handleReview}>Submit</button>}
          </div>
          {user && (
            <div className='flex flex-col items-center justify-center my-3'>
              <h1 className='font-bold text-2xl'>Review of the product</h1>
              <div className='flex gap-3'>
                {[...Array(5)].map((_, index) =>
                  <FaStar key={index} size={35} color={index + 1 <= userRating ? 'gold' : 'grey'} />
                )}
              </div>
            </div>
          )}
        </div>
      ) : <div className='flex justify-center font-bold items-center relative top-20'><h1 className='text-3xl text-center'>Loading.....</h1></div>}
    </div>
  );
};

export default Listing;
