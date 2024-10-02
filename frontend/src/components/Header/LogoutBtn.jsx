import React from 'react'
// need to have logout from backend
import { logout } from '@/store/features/authSlice';
import { useDispatch } from 'react-redux'
import { authService } from '../utils';

function LogoutBtn({className}) {
  const dispacth = useDispatch();
  const inputHandler = ()=>{
    authService.logoutUser().then((e)=>{
      console.log(e)
      dispacth(logout());
    }).catch(error =>{
      console.log("Logout button :: logout api :: error",error);
    })
  }
  return (
    <>
    <button className={`block px-7 py-[7px] md:py-2 rounded-lg text-base text-white bg-[#03089a] hover:bg-[#020564] transition duration-200 ease-in-out ${className}`} onClick={inputHandler}>Logout</button>
    </>
  )
}

export default LogoutBtn