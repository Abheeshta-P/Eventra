"use client"
import React from 'react'
import { logout } from '@/store/features/authSlice';
import { useDispatch } from 'react-redux'
import { authService } from '../../utils';
import { useRouter } from 'next/navigation';
import { resetEventDetails } from '@/store/features/eventDetailsSlice';
import { resetTodo } from '@/store/features/todoSlice';
import Swal from 'sweetalert2';

function LogoutBtn({className}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const inputHandler = async()=>{
    try {
      const response = await authService.logoutUser();
      console.log(response.status)
       if(response.ok){
        dispatch(logout());
        dispatch(resetEventDetails());
        dispatch(resetTodo());
        Swal.fire({
          title: 'Logged out Successfully!',
          text: 'You have successfully logged out.',
          icon: 'success',
          confirmButtonText: 'Great!',
          timer: 3000,
          customClass: {
            popup: 'bg-green-100 text-green-900',
            title: 'text-green-700',
            confirmButton: 'bg-green-600',
          },
          backdrop: `
            rgba(0,0,0,0.3)
            url("https://sweetalert2.github.io/images/success.gif")
            left top
            no-repeat
          `,
        }).then(()=> {router.replace('/');router.refresh()})
       }
       else {
        alert("Failed to login. Try again!");
       }
     
    }catch(error){
      console.log("logout component :: logoutUser :: error", error);
      alert('An error occurred while logging out. Please try again later.');
    }
  }
  return (
    <>
    <button className={`block px-7 py-[7px] md:py-2 rounded-lg text-base text-white bg-[#03089a] hover:bg-[#020564] transition duration-200 ease-in-out ${className}`} onClick={inputHandler}>Logout</button>
    </>
  )
}

export default LogoutBtn