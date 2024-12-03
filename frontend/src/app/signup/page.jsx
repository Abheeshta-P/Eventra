"use client"
import { Card, Container, Loading } from '@/components'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

function SignupUserTypeSelection() {
  const router = useRouter();
  const { isLoggedIn } = useSelector(state => state.auth);
  const [loading, setLoading] = React.useState(true); 

  useEffect(() => {
    if (isLoggedIn) {
      router.back(); 
    } else {
      setLoading(false); 
    }
  }, [isLoggedIn, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loading/></div>;
  }

  return (
    <Container className="flex justify-center items-center flex-col">
      <h1 className="mb-14 text-3xl md:text-4xl lg:text-5xl text-zinc-900 font-semibold">
        Select your role
      </h1>
      <div className="flex w-full flex-col md:flex-row gap-8 lg:gap-16 justify-center items-center">
        <Link href="/signup/event-creator">
          <Card
            title="Event creator"
            description="The one who wants to manage events by using services of platform"
            photo="../../../cardImages/event-creator.png"
          />
        </Link>
        <Link href="/signup/service-provider">
          <Card
            title="Service provider"
            description="The one who provides services to event creators through our platform"
            photo="../../../cardImages/service-provider.webp"
          />
        </Link>
      </div>
    </Container>
  );
}


export default SignupUserTypeSelection