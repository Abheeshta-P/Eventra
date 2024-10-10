import React, { useId } from 'react'

function Select({
  options,
  label,
  className = '',
  ...props
},ref) {
  const id = useId();
  return (
    <div className='w-full'>
      {label && <label htmlFor={id} className='text-sm md:text-base inline-block mb-2 pl-1 text-zinc-900'>{label}</label>}
      <select  {...props}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-zinc-900 outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full text-sm md:text-base  ${className} `}>
      {
        options?.map(option =>(
          <option key={option} value={option}>{option}</option>
        ))
      }
      </select> 
    </div>
  )
}

export default React.forwardRef(Select);