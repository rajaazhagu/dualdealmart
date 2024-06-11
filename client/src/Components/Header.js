import React from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import logo from '../logo/logo.png'
const Header = ({user,search,setSearch}) => {
  return (
    <div className='bg-slate-300 shadow-md'>
      <div className='flex justify-between items-center p-3 max-w-6xl mx-auto'>
        <Link to='/'>
          <div className='flex gap-2 items-end relative right-2'>
           <img src={logo} alt='logo' className='rounded-3xl h-10 w-10'/>
           <h1 className='hidden lg:block font-bold text-2xl'>Dual<span className='text-slate-700'>Deal</span><span className='text-slate-500'>Mart</span></h1>
           </div>
          </Link>
          <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
              <input type='text' placeholder='search...' value={search} onChange={((e)=>setSearch(e.target.value))} className='bg-transparent focus:outline-none w-24 sm:w-64'/>
              <FaSearch className='text-slate-500'/>
          </form>
          <ul className='flex gap-4'>
            <Link to='/'>
                <li className='hidden sm:inline text-slate-700 hover:text-red-500 font-semibold'>Home</li>
            </Link>
            <Link to='/about'>
                <li className='sm:inline text-slate-700 hover:text-red-500 font-semibold'>about</li>
            </Link>
            {user
            ?
            <Link to ='/profile'>
              <img className="w-7 h-7 mt--2 rounded-full" src={user.photo}/>
            </Link>
            :  
            <Link to='/sign-in'>
               <li className='text-slate-700 ml--9 hover:text-red-500 font-semibold'>Signin</li>
            </Link>}
            
          
          </ul>
      </div>
    </div>
  )
}

export default Header