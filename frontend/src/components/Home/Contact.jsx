"use client"
import React from 'react';
import { Button, Container, Input } from '..';
import { useForm } from 'react-hook-form';
import { url } from '@/conf';

function ContactForm(){
  const {register,handleSubmit,formState:{errors},setValue} = useForm();

  const onSubmit = async(data) => {
    try {
      const response = await fetch(`${url}/api/contact-us`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); 
        setValue('name','')
        setValue('email','')
        setValue('message','')
      } else {
        alert(result.message); 
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  }
  return(
   <Container className={'flex flex-col items-center min-h-fit -mb-10 sm:min-h-full sm:mb-24'}>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 text-[#03089a]">Contact Us</h2>      
    <section>
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center w-[300px] gap-4'>
    <Input label = {'Name : '} placeholder = {'Enter your name'} required {...register('name',{
        required : true
      })}/>
        {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
      <Input label = {'Email : '} placeholder = {'Enter your mail'} required {...register('email',{
        required : true,
        pattern: {
          value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
          message: 'Invalid email address',
        },
      })}/>
        {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
      <div className="message flex flex-col w-full">
      <label htmlFor="message" className='text-sm md:text-base inline-block mb-2 pl-1 text-zinc-900'>Message : </label>
      <textarea name="message" id="message" placeholder = {'Enter your message'} required className = 'px-3 py-2 rounded-lg h-40 border-none resize-none text-sm md:text-base' {...register('message',{
        required : true
      })}></textarea>
        {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
      </div>
      <Button type="submit" className="mt-2">Send Message</Button>
      </form>
    </section>
   </Container>
  )
}

export default ContactForm;
