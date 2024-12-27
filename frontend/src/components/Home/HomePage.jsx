import React from 'react'
import { Hero,Features,Contact} from '.'

// grouping
function HomePage() {
  return (
    <main className='flex flex-col gap-12 sm:gap-20'>
      <Hero />
      <section id="features">
        <Features />
      </section>
      <section id="contact" >
        <Contact />
      </section>
    </main>
  );
}

export default HomePage