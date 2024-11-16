"use client"
import React from 'react'
import Link from 'next/link';
import { useForm } from 'react-hook-form'
import { Button,Container,Input,Logo } from '@/components';
import { authService } from '@/utils';
import { useDispatch } from 'react-redux';
import { login } from '@/store/features/authSlice';
import { setEvents } from '@/store/features/eventsSlice';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { resetEventDetails } from '@/store/features/eventDetailsSlice';
import { resetTodo } from '@/store/features/todoSlice';

function Login() {
  const {register,handleSubmit,formState:{error},reset} = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const Login = async (data) => {
    try {
      dispatch(resetEventDetails());
      dispatch(resetTodo());
      const response = await authService.loginUser(JSON.stringify(data));
  
      if (response) {
        const responseData = await response;
        if (responseData && responseData.isLoggedIn) {
          reset({ email: '', password: '' });
  
          const { userType, userData, events } = responseData;

          dispatch(login({ userType, userData }));
  
          if (userType === 'eventCreator') {
            dispatch(setEvents(events));
          }
  
          Swal.fire({
            title: 'Logged in Successfully!',
            text: 'You have successfully logged in.',
            icon: 'success',
            confirmButtonText: 'Awesome!',
            timer: 3000,
            customClass: {
              popup: 'bg-green-100 text-green-900',
              title: 'text-green-700',
              confirmButton: 'bg-green-600',
            },
            backdrop: `
              rgba(0,255,0,0.3)
              url("https://sweetalert2.github.io/images/success.gif")
              left top
              no-repeat
            `,
          }).then(()=> {router.replace('/');router.refresh()})
        } else {
          alert('Login failed. Please check your credentials and try again.');
        }
      } else {
        console.error('No response from the server');
        alert('No response from the server');
      }
    } catch (error) {
      console.log("login form :: loginUser :: error", error);
      alert('An error occurred while logging in. Please try again later.');
    }
  };  
  
  return (
    <Container className={'flex justify-center items-center login-bg'}>
      <div className='flex items-center justify-center w-full text-black '>
    <div className={`w-[85%] mx-auto md:w-full md:max-w-lg bg-zinc-100 rounded-xl p-10 border border-black/10 flex flex-col items-center justify-center`}>
    <Logo/>
    <h2 className="text-center text-2xl font-bold leading-tight mt-3">Login to your account</h2>
    <p className="mt-2 text-center text-base text-black/60">
                Don&apos;t have any account?&nbsp;
                <Link
                    href="/signup"
                    className="font-medium text-primary transition-all duration-200 hover:underline"
                >
                    Sign Up
                </Link>
    </p>
    {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
    <form onSubmit={handleSubmit(Login)} className='mt-8 '>
    <div className='space-y-5'>
      <Input
      label = 'Email : '
      type = 'email'
      placeholder = 'Enter your Email'
      required
      {
        ...register ('email',{
          required : true,
          validate: {
            matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
            "Email address must be a valid address",
        }
        })
      }
      />
      <Input
      label = 'Password : '
      type = 'password'
      placeholder = 'Enter your Password'
      required
      {
        ...register ('password',{
          required : true
        }
        )
      }
      />
      <Button type = 'submit' className={'w-full'}>Log in</Button>
      </div>
    </form>
    </div>
    </div>
    </Container>
  )
}

export default Login