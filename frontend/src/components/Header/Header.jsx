"use client"
import React from 'react'
import { Logo } from '..';
import { useSelector } from 'react-redux';
import Link from 'next/link';

function navItems (){
  const {isLoggedIn,userType}= useSelector(state => state.auth)
  const linksNotLoggedIn = [{
    name : 'Home',
    href : '/',
  },{
    name : 'Features',
    href : '/#features',
  },{
    name : 'Contact',
    href : '/#contact',
  }];
  const loginSignup = [{
    name : 'Login',
    href : '/login',
  },{
    name : 'Signup',
    href : '/signup'
  }]
  const linksLoggedInCreator = [{
    name : 'Home',
    href : '/home',
  },{
    name : 'Create event',
    href : '/create-event',
  },{
    name : 'Dashboard',
    href : '/dashboard',
  }];
  const linksLoggedInProvider = [{
    name : 'Home',
    href : '/home',
  },{
    name : 'Dashboard',
    href : '/dashboard',
  }];

  if (!isLoggedIn) {
    return (
      <>
        <div>
          {linksNotLoggedIn.map((link) => (
            <Link key={link.name} href={link.href}>
              {link.name}
            </Link>
          ))}
        </div>
        <div>
          {loginSignup.map((link) => (
            <Link key={link.name} href={link.href}>
              {link.name}
            </Link>
          ))}
        </div>
      </>
    );
  } else if (isLoggedIn && userType === 'eventCreator') {
    return (
      <div>
        {linksLoggedInCreator.map((link) => (
          <Link key={link.name} href={link.href}>
            {link.name}
          </Link>
        ))}
      </div>
    );
  }
  // eventProvider
  else {
    return (
        <div>
         {linksLoggedInProvider.map((link) => (
          <Link key={link.name} href={link.href}>
            {link.name}
          </Link>
        ))}
        </div>
    )
  }
}
function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-[#2827271b] backdrop-blur-sm border-b border-gray-200 shadow-md">
  <div className="container mx-auto flex items-center justify-between h-full px-4 ">
        <Logo/>
       <navItems/>
       </div>
      </nav>
  )
}

export default Header