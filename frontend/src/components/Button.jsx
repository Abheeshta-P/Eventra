import React from 'react'

function Button({
  children,
  bgColor = 'bg-[#03089a]',
  textColor = 'text-white',
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button className={` p-2 md:px-4 md:py-2 text-sm md:text-base rounded-lg active:opacity-90 transition-opacity ${bgColor} ${textColor} ${className}`} type={type} {...props}>{children}</button>
  )
}

export default Button