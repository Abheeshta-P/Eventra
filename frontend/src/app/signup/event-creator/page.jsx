"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
// backend signup
import { useDispatch } from 'react-redux';
// import {login as storeLogin} from '../features/authSlice'
import { Button,Container,Input,Logo } from '@/components';
import Link from 'next/link';
import { authService } from '@/components/utils';
import { useRouter } from 'next/navigation';

function Signup() {
  const [error,setError] = useState('');
  const dispatch = useDispatch();
  const {register,handleSubmit, reset, formState: { errors } } = useForm();

  const signup = async (data) =>{
    try {
        const userData = await authService.signUpUser(JSON.stringify(data),'event-creator');
        // if(userData) dispatch(storeLogin({userData}));
        // navigate('/');
        if(userData){
            reset({name : '', email : '', password : ''})
            if(userData.status === 400)
                alert("The user with current email already exists, login instead");
            else {
                alert("Signup done!")
                Router.push('/login');
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
          <Input
          label="Password: "
          type="password"
          required
          placeholder="Enter your password"
          {...register("password", {
              required: true,})}
          />
          <Button type = 'submit' className={'w-full'}>Sign up</Button>
          </div>
        </form>
        </div>
        </div>
   </Container>
  )
}

export default Signup