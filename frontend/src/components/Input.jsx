import React ,{forwardRef,useId} from 'react';

function Input({type='text',className='',label,...props},ref) {
  const id = useId();
  return (
    <div className='w-full'>
    {label && (<label htmlFor={id} className='text-sm md:text-base inline-block mb-2 pl-1 text-zinc-900' >
      {label}
    </label>)}
    <input type={type} id={id}  className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full text-sm md:text-base focus:outline-[#03089a] ${className}`} ref={ref} {...props}/>
    </div>
  )
}

export default forwardRef(Input);