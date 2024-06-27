import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateListing = ({ fetch, setFetch, list, user }) => {
  const navigate = useNavigate()
  const { listingId } = useParams();
  const [filteredList, setFilteredList] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    type: '',
    price: '',
    discountprice: '',
  });

  useEffect(() => {
    const filteredList = list.filter((single) => single._id === listingId);
    setFilteredList(filteredList);
    if (filteredList.length > 0) {
      const initialData = filteredList[0];
      setFormData({
        ...formData,
        id:initialData._id,
        name: initialData.name,
        description: initialData.description,
        address: initialData.address,
        phone: initialData.phone,
        type: initialData.type,
        price: initialData.price,
        discountprice: initialData.discountprice,
        offer:initialData.offer
      });
    }
  }, [listingId, list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://dualdealmart.onrender.com/updating/existlist",formData)
    .then((res)=>{
       if(res.data==='updated'){
        toast.success("list updated successfully")
        setFetch(!fetch)
        navigate('/')
       }
    })
  };

  const handleChange = (e) => {
    if(e.target.id==='sell'||e.target.id==='rent'){
        setFormData({...formData,type:e.target.id})
    }
    else if(e.target.id==='offer'){
        setFormData({...formData,[e.target.id]:e.target.checked})
    }
    else{
    setFormData({...formData,[e.target.id]:e.target.value})
    }
  };

  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>
      <form className='flex flex-col sm:flex-row gap-10' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            id='name'
            required
            className='border p-3 rounded-lg'
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description of your item'
            id='description'
            required
            className='border p-3 rounded-lg'
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            id='address'
            required
            className='border p-3 rounded-lg'
            onChange={handleChange}
            value={formData.address}
          />
          <input
            type='text'
            placeholder='Phone Number'
            id='phone'
            required
            className='border p-3 rounded-lg'
            onChange={handleChange}
            value={formData.phone}
          />
          <div className='flex flex-row gap-7'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                className='w-5'
                id='sell'
                onChange={handleChange}
                checked={formData.type === 'sell'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                className='w-5'
                id='rent'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' className='w-5' id='offer' onChange={handleChange} checked={formData.offer===true} />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex gap-2'>
              <input
                type='tel'
                id='price'
                placeholder='price'
                className='border p-3 rounded-lg'
                onChange={handleChange}
                value={formData.price}
              />
              <div className='flex flex-col'>
                <p>Price</p>
                {formData.type === 'rent' && <span>(/month)or(/day)or/(/KM)</span>}
              </div>
            </div>
            <div className='flex gap-2'>
              <input
                type='tel'
                id='discountprice'
                placeholder='discountprice'
                className='border p-3 h-12 rounded-lg'
                onChange={handleChange}
                value={formData.discountprice}
              />
              <p className=''>Discounted Price</p>
            </div>
          </div>
          <button type='submit' className='p-3 bg-slate-600 text-white rounded-lg uppercase'>
          Update Listing
        </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateListing;
