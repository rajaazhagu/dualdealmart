import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './Components/Header';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';
import Payment from './pages/Payment';
import Buy from './pages/Buy';
import Contactus from './pages/Contactus';
import PrivacyPolicy from './pages/privacy';
import TermsConditions from './pages/Terms';
import Refund from './pages/Refund';
import { Provider } from 'react-redux';
import store from './store';
import { setuser } from './slices/authSlice';
import Premium from './pages/Premium';


const App = () => {
  const [user, setUser] = useState('');
  const [buy, setBuy] = useState([]);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [fetch, setFetch] = useState(false);
  const [userRating, setUserRating] = useState(false);

  useEffect(() => {
    axios.get('https://dualdealmart.onrender.com/get/lists')
      .then((res) => {
        if (res.data) {
          setList(res.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching the list:', error);
      })
      const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user)
      store.dispatch(setuser(user));
    }
  }, [fetch]);

  return (
    <Provider store={store}>
      <div>
      {list.length >0 ? <Header user={user} setSearch={setSearch} search={search} /> : " "}
        <Routes>
          <Route path='/' element={<Home list={list.filter((single) => single.address.toLowerCase().includes(search.toLowerCase()) || single.name.toLowerCase().includes(search.toLowerCase()))} user={user} />} />
          <Route path='/sign-in' element={<Signin user={user} setUser={setUser} setFetch={setFetch} fetch={fetch} />} />
          <Route path='/sign-up' element={<Signup user={user} setUser={setUser} />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<Profile user={user} setUser={setUser} />} />
          <Route path='/create-listing' element={<CreateListing user={user} fetch={fetch} setFetch={setFetch} />} />
          <Route path='/listing/:listingId' element={<Listing user={user} userRating={userRating} setUserRating={setUserRating} setFetch={setFetch} fetch={fetch} setBuy={setBuy} />} />
          <Route path='/payment' element={<Payment user={user} setUser={setUser} />} />
          <Route path='/buy' element={<Buy list={list} user={user} buy={buy} />} />
          <Route path='/contactus' element={<Contactus />} />
          <Route path='/privacypolicy' element={<PrivacyPolicy />} />
          <Route path='/termsandcondition' element={<TermsConditions />} />
          <Route path='/refund' element={<Refund />} />
          <Route path='/premium-listing' element={<Premium user={user} fetch={fetch} setFetch={setFetch} />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
