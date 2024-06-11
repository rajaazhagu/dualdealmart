import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signout from './pages/Signup'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './Components/Header'
import CreateListing from './pages/CreateListing'
import Listing from './pages/Listing'
import Payment from './pages/Payment';

const App = () => {
        const [user,setUser] = useState('')
        const [list,setList] = useState([])
        const [search,setSearch] =useState('')
        const [fetch,setFetch] = useState(false)
        const [userRating,setUserRating]=useState(false)
  useEffect(() => {
    axios.get('http://localhost:3001/get/lists')
      .then((res) => {
        if (res.data) {
          setList(res.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching the list:', error);
      });

  }, [fetch]);
  return (
    <div>
          <Header user={user} setSearch={setSearch} search={search}/>
          <Routes>
                <Route path='/' element={<Home list={list.filter((single)=>single.address.toLowerCase().includes(search.toLowerCase())||single.name.toLowerCase().includes(search.toLowerCase()))} user={user} />} />
                <Route path='/sign-in' element={<Signin user={user} setUser={setUser}/>}/>
                <Route path='/sign-up' element={<Signout user={user} setUser={setUser} />}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/profile' element={<Profile user={user} setUser={setUser} />}/>
                <Route path='/create-Listing' element={<CreateListing user={user} fetch={fetch} setFetch={setFetch} />}/>
                <Route path='/listing/:listingId' element={<Listing user={user} userRating={userRating} setUserRating={setUserRating} setFetch={setFetch} fetch={fetch}/>}/>
                <Route path='/payment' element={<Payment user={user} setUser={setUser}/>}/>
          </Routes>
   </div>
  )
}

export default App