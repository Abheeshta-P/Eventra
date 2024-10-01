"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import { Footer,Header } from '.';

function LayoutRender({children}) {
  const pathName = usePathname();
  const loginOrSignup = pathName.includes('/login')|| pathName.includes('/signup')
  return loginOrSignup?(
    children
  ):(
    <>
    <Header/>
    <div className='mt-20'>
    {children}
    </div>
    <Footer/>
    </>
  )
}

export default LayoutRender