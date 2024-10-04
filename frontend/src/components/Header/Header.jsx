"use client"
import React from 'react'
import { Button, Logo } from '..';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import LogoutBtn from './LogoutBtn';
import { usePathname } from 'next/navigation';


function NavItems (){
  const {isLoggedIn,userType,userData}= useSelector(state => state.auth);
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const userNameFirstLetter = userData?.name?.charAt(0).toUpperCase() || 'U'; 
  const pathname = usePathname();

  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };


  const ProfileSection = ()=>{
   return (
    <div className="relative flex items-center flex-col">
    <div
      className={`text-base md:text-lg rounded-full w-10 h-10 flex items-center justify-center text-white  cursor-pointer transition-all duration-200 hover:bg-[#03089a] ${dropdownVisible ? 'bg-[#03089a]' : 'bg-[#0e13aa]'}`}
      onClick={toggleDropdown}
    >
      {userNameFirstLetter}
    </div>
  
    <div className={`absolute text-sm md:text-base -right-8 top-12 mt-2 bg-zinc-50 rounded-md shadow-lg ${dropdownVisible ? 'flex flex-col justify-center items-center gap-2 p-2' : 'hidden'} transition-all duration-200`}>
      <Link href="/dashboard" className="block px-4 py-2 text-zinc-800 hover:bg-gray-100 rounded-md transition-all duration-200">Dashboard</Link>
      <LogoutBtn className="transition-all duration-200" />
    </div>
  </div>
  
   )
  }
  const linksNotLoggedIn = [{
    name : 'Home',
    href : '/',
  },{
    name : 'Features',
    href : '#features',
  },{
    name : 'Contact',
    href : '#contact',
  }];

 if (isLoggedIn && userType === 'eventCreator') {
    return (
      <div className='flex justify-around w-[250px] md:w-[300px] items-center '>
        <Link href={'/'} className={`${ pathname.startsWith('/') ? 'text-[#03089a] font-semibold' : 'text-zinc-900'} hover:text-[#03089a] transition-all duration-200 text-sm md:text-base`}>Home</Link>
        <Button className='font-semibold '>Create Event</Button>
        {/* Dashboard and logout drop down in profile section */}
       <ProfileSection/>
    </div>
    );
  }
  // eventProvider
  else if (isLoggedIn && userType === 'serviceProvider'){
    return (
      <div className='flex justify-around w-[150px] items-center '>
      <Link href={'/'}  className={`${ pathname.startsWith('/') ? 'text-[#03089a] font-semibold' : 'text-zinc-900'} hover:text-[#03089a] transition-all duration-200 text-sm md:text-base`}>Home</Link>
      {/* Dashboard and logout drop down in profile section */}
     <ProfileSection/>
      </div>
       
    )
  }
  // not authorized
  else{
    return (
      <>
        <div className='flex gap-2 md:gap-3 text-sm md:text-base'>
      {linksNotLoggedIn.map((link) => {   
     return (
          <Link key={link.name} href={link.href}>
            <div
              className={`${
                link.href ==='/' ? 'text-[#03089a] font-semibold' : 'text-zinc-900'
              } hover:text-[#03089a] transition-all duration-200`}
            >
              {link.name}
            </div>
          </Link>
        )
      })}
    </div>
        <div className='flex gap-2 md:gap-3'>
         
           <Button bgColor='bg-zinc-300' textColor='text-zinc-900' className='px-3'> <Link key={'login'} href={'/login'}>
           Login
         </Link></Button>
           <Button> <Link key={'signup'} href={'/signup'}>
           Signup
         </Link></Button>
          
        </div>
      </>
    );
  }
}
function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-[#fcfcfc55] backdrop-blur-sm border-b border-gray-200 shadow-md ">
  <div className="container mx-auto flex items-center justify-between h-full px-4 ">
        <Link href={'/'}><Logo/></Link>
      {
        <NavItems/>
      }
       </div>
      </nav>
  )
}

export default Header