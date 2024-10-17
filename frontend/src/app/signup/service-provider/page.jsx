"use client";

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button, Select, Container, Logo } from '@/components';
import { useDispatch } from 'react-redux';
import { authService } from '@/components/utils';
import { useRouter } from 'next/navigation';

const categories = ['Catering', 'Decorating', 'Photography', 'Venue', 'Music', 'Emcee', 'Makeup', 'Cakeshop','Purohit'];

const ServiceProviderSignup = () => {
  const { register, handleSubmit, formState: { errors },reset } = useForm();
  const [galleryImages, setGalleryImages] = useState([]);
  const fileInputRef = useRef(null);

  const onSubmit = async (data) => {
    try {
      const userData = await authService.signUpUser(JSON.stringify(data),'service-provider');
      // if(userData) dispatch(storeLogin({userData}));
      // navigate('/');
      if(userData){
          reset({name : '', email : '', phone : '', location : '', category : '', details : '', cost : '', password : ''});
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; 
          }
          setGalleryImages([]);
          if(userData.status === 400)
              alert("The user with current email already exists, login instead");
          else {
              alert("Signup done!")
              Router.push('/login');
          }
      }
    } catch (error){
      console.log(" Signup form :: signUpUser serviceprovider :: error ", error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(files);
  };

  return (
    <Container className={'login-bg'}>
 <div className="flex items-center justify-center text-black ">
 <div className={`w-[85%] mx-auto md:w-full flex flex-col items-center justify-center md:max-w-lg bg-zinc-100 rounded-xl p-10 border border-black/10`}>
        <Logo/>
      <h2 className="text-2xl font-semibold text-gray-900 mt-3 mb-4 text-center">Service Provider Sign up</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType='multipart/form-data'>
        <div>
          <Input
            label="Name"
            type="text"
            placeholder = 'Enter your company name'
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
        <Input
          label="Email: "
          placeholder="Enter your email"
          type="email"
          {...register("email", {
              required: 'Email is required',
              validate: {
                  matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                  "Email address must be a valid address",
              }
          })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
        <Input
          label="Phone: "
          placeholder="Enter your phone number"
          type="number"
          {...register("phone", {
              required: 'Phone number is required',
              pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: 'Phone number must be a valid 10-digit Indian number',
              },
          })}
        />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        <div>
          <Input
            label="Location"
            type="text"
            placeholder = 'Enter your company location'
            {...register('location', { required: 'Location is required' })}
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div>
          <Select
            label="Category"
            options={categories}
            {...register('category', { required: 'Please select a category' })}
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div>
          <label className="text-sm md:text-base inline-block mb-2 pl-1 mt-2 text-zinc-900">Details about the Service</label>
          <textarea
          spellCheck = 'false'
            placeholder = 'Provide deatils about your service, facilities offered, constraints etc'
            className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full text-sm md:text-base focus:outline-[#03089a] h-[150px] resize-none"
            {...register('details', { required: 'Please provide details about your service' })}
          />
          {errors.details && <p className="text-red-500 text-sm">{errors.details.message}</p>}
        </div>

        <div>
          <Input
            label="Cost of Service (Rupees)"
            type="number"
            placeholder = 'Enter estimated cost '
            {...register('cost', { required: 'Cost is required', min: { value: 0, message: 'Cost must be positive' } })}
          />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
        </div>

        <div>
          <Input
            ref={fileInputRef}
            label="Gallery / Images"
            type="file"
            accept="image/*"
            multiple
            className = 'mt-2'
            onChange={handleImageChange}
          />
          {galleryImages.length > 0 && (
            <div className="mt-5">
              <h4 className="font-semibold text-zinc-800">Selected Images:</h4>
              <ul className="list-disc list-inside text-zinc-700">
                {galleryImages.map((image, index) => (
                  <li key={index}>{image.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <Input
            label="Password"
            type="password"
            placeholder = 'Enter password'
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <Button type="submit" className='w-full'>
          Sign up
        </Button>
      </form>
    </div>
    </div>
    </Container>
  );
};

export default ServiceProviderSignup;
