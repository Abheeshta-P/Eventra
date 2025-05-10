import React from 'react'
import { Logo } from '..'

function Footer() {
  return (
    <footer className=" p-12 py-14 bg-zinc-200 w-full h-[100px] flex justify-center items-center">
      <div className='flex gap-3 items-center'>
        <div className="inline-flex items-center">
          <Logo />
        </div>
        <div>
          <p className="text-xs md:text-sm text-center">
            &copy; Copyright {new Date().getFullYear()} - All Rights Reserved Eventra.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer