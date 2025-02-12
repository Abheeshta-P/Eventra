"use client"
import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button,Container,Input,Logo,Loading } from '@/components';
import Link from 'next/link';
import { authService } from '@/utils';
import { useDispatch } from 'react-redux';
import { login } from '@/store/features/authSlice';
import { setEvents } from '@/store/features/eventsSlice';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

function Signup() {
  const { isLoggedIn } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true); 
  const [error,setError] = useState('');
  const dispatch = useDispatch();
  const {register,handleSubmit, reset, formState: { errors } } = useForm();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.back(); 
    } else {
      setLoading(false); 
    }
  }, [isLoggedIn, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loading/></div>;
  }
  
  const signup = async (data) =>{
    try {
        const userData = await authService.signUpUser(JSON.stringify(data),'event-creator');

        if(userData){
            reset({name : '', email : '', password : ''})
            if(userData.status === 400)
                alert("The user with current email already exists, login instead");
            else {
               
                Swal.fire({
                    title: 'Signup Successful!',
                    text: 'You have successfully signed up.',
                    icon: 'success',
                    confirmButtonText: 'Awesome!',
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
                  }).then(async()=>{
                    try {
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
                            rgba(0,0,0,0.3)
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
                  })
            }
        }
      } catch (error){
        console.log(" Signup form :: signUpUser eventcreator :: error ", error);
      }
  }
  return (
   <Container className={'flex justify-center items-center login-bg'}>
     <div className="flex items-center justify-center text-black ">
    <div className={`w-[85%] mx-auto md:w-full flex flex-col items-center justify-center md:max-w-lg bg-zinc-100 rounded-xl p-10 border border-black/10`}>
        <Logo/>

        <h2 className="text-center text-2xl font-bold leading-tight mt-3">Sign up to create account</h2>

        <p className="mt-2 text-center text-base text-black/60">
            Already have an account?&nbsp;
            <Link
                href="/login"
                className="font-medium text-primary transition-all duration-200 hover:underline"
            >
                Log in
            </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(signup)}>
        <div className='space-y-5 mt-8'>
          <Input
          label="Name: "
          placeholder="Enter your full name"
          required
          {...register("name", {
              required: true,
          })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <Input
          label="Email: "
          placeholder="Enter your email"
          type="email"
          required
          {...register("email", {
              required: true,
              validate: {
                  matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Email address must be a valid address",
              }
          })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          <Input
            label="Password"
            type="password"
            placeholder = 'Enter password'
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          <Button type = 'submit' className={'w-full'}>Sign up</Button>
          </div>
        </form>
        </div>
        </div>
   </Container>
  )
}

export default Signup