import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { load } from '@cashfreepayments/cashfree-js';
import { toast } from 'react-toastify';
import { app } from '../firebase';

const Premium = ({ user, setFetch, fetch }) => {
  const [toemail, setToemail] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [files, setFiles] = useState([]);
  const [filePer, setFilePer] = useState(0);
  const [formData, setFormData] = useState({
    email: user.email,
    type: 'rent',
    offer: false,
    imageURLs: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3002/all/active")
      .then((res) => {
        let data = res.data.map(item => item.email);
        setToemail(data);
      })
      .catch((error) => {
        console.error('Error fetching emails:', error);
      });
  }, []);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
      const promises = files.map(storeImage);

      Promise.all(promises).then((urls) => {
        setFormData({ ...formData, imageURLs: formData.imageURLs.concat(urls) });
      }).catch(error => {
        console.error('Error uploading images:', error);
      });
    } else {
      toast.error('Upload at least 6 images.');
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePer(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  };

  const handleRemove = (index) => {
    setFormData({ ...formData, imageURLs: formData.imageURLs.filter((_, i) => i !== index) });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sell' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    } else if (e.target.id === 'offer') {
      setFormData({ ...formData, offer: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const getSessionId = async () => {
    try {
      const res = await axios.get("https://dualdealmart.onrender.com/list-pay");
      if (res.data && res.data.payment_session_id) {
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.error('Error fetching sessionId:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cashfree = await load({ mode: 'production' });
      const sessionId = await getSessionId();

      if (sessionId) {
        const checkOutOptions = {
          paymentSessionId: sessionId,
          redirectTarget: '_modal'
        };

        cashfree.checkout(checkOutOptions).then(async (response) => {
          if (response.paymentDetails.paymentMessage === 'Payment finished. Check status.') {
            const dateMonth = new Date();
            const date = dateMonth.getDate();
            const month = dateMonth.getMonth() + 1;
            const year = dateMonth.getFullYear();

            await axios.post("https://dualdealmart.onrender.com/creating/premium", { ...formData, date, month, year });
            setFetch(!fetch);
            navigate('/');
            toast.success('Listing successful');

            // Send emails to all recipients
            toemail.forEach((toEmail) => {
              const templateParams = {
                from_name: user.email,
                to_name: toEmail,
                message: `${user.name} listed a product ${formData.name} for ${formData.type} and image is ${formData.imageURLs[0]} and for query call ${formData.phone}`,
              };

              emailjs.send('service_y7xj0zf', 'template_idu1t8y', templateParams, 'kAmXiNVYiUnGKFlVQ')
                .then((response) => {
                  console.log("Email sent successfully:", response.text);
                })
                .catch((error) => {
                  console.error("Failed to send email:", error);
                });
            });
          }
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form className='flex flex-col sm:flex-row gap-10' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Name' id='name' required className='border p-3 rounded-lg' onChange={handleChange} />
          <textarea type='text' placeholder='Description of your item' id='description' required className='border p-3 rounded-lg' onChange={handleChange} />
          <input type='text' placeholder='Address' id='address' required className='border p-3 rounded-lg' onChange={handleChange} />
          <input type='text' placeholder='Phone Number' id='phone' required className='border p-3 rounded-lg' onChange={handleChange} />
          <div className='flex flex-row gap-7'>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='sell' onChange={handleChange} checked={formData.type === 'sell'} />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='rent' onChange={handleChange} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='offer' onChange={handleChange} />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex gap-2'>
              <input type='tel' id='price' placeholder='price' className='border p-3 rounded-lg' onChange={handleChange} />
              <div className='flex flex-col'>
                <p>Price</p>
                {formData.type === 'rent' && <span>(/month)or(/day)or/(/KM)</span>}
              </div>
            </div>
            <div className='flex gap-2'>
              <input type='tel' id='discountprice' placeholder='discountprice' className='border p-3 h-12 rounded-lg' onChange={handleChange} />
              <p className=''>Discounted Price</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-3'>
          <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover(max-6)</span>
          </p>
          <div className='flex gap-4'>
            <input type='file' onChange={(e) => setFiles(e.target.files)} id='images' accept='image/*' multiple className='p-3 border border-slate-500' />
            <button type='button' onClick={handleImageSubmit} className='border h-10 my-4 border-green-500 text-green-400 rounded'>Upload</button>
          </div>
          {
            formData.imageURLs.length > 0 && filePer === 100 ? formData.imageURLs.map((urls, index) => (
              <div key={index} className='flex justify-between border p-3 items-center'>
                <img alt='uploaded images' src={urls} className='w-20 h-20 rounded-lg object-content' />
                <button type='button' onClick={() => handleRemove(index)} className='p-3 text-red-600 rounded-lg uppercase hover:opacity-95'>Delete</button>
              </div>
            )) : <p className='text-center'>Uploading {filePer}%... Please wait until image displays below.</p>
          }
          <button type='submit' className='p-3 bg-red-700 text-white rounded-lg uppercase'>Pay and Continue</button>
        </div>
      </form>
    </div>
  );
};

export default Premium;
