"use client"
import React from 'react'
import Link from 'next/link';
import { useForm } from 'react-hook-form'
import { Button,Container,Input,Logo } from '@/components';

function Login() {
  const {register,handleSubmit,formState:{error}} = useForm();
  const login = () =>{

  }
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
    <form onSubmit={handleSubmit(login)} className='mt-8 '>
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