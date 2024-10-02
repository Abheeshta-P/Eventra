"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import { Provider } from 'react-redux';
import { Footer,Header } from '.';
import store from '@/store/store';

function LayoutRender({children}) {
  const pathName = usePathname();
  const loginOrSignup = pathName.includes('/login')|| pathName.includes('/signup')
  return loginOrSignup?(
    <Provider store={store}>
      {children}
      </Provider>
  ):(
    <Provider store={store}>
    <Header/>
    <div className='mt-20'>
    {children}
    </div>
    <Footer/>
    </Provider>
  )
}

export default LayoutRender