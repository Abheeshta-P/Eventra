"use client"
import React, { forwardRef, useId, useState } from 'react';

function Input({ type = 'text', className = '', label, ...props }, ref) {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Determine the actual input type
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm md:text-base inline-block mb-2 pl-1 text-zinc-900"
        >
          {label}
        </label>
      )}
      <input
        type={inputType}
        id={id}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full text-sm md:text-base focus:outline-[#03089a] ${className}`}
        ref={ref}
        {...props}
      />
      {/* Show password toggle button only if it's a password field */}
      {type === 'password' && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute bottom-2 right-3 flex items-center text-sm text-zinc-600 hover:text-gray-800"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      )}
    </div>
  );
}

export default forwardRef(Input);
