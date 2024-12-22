import React from 'react'
import { Hero,Features,Contact} from '.'

// grouping
function HomePage() {
  return (
    <main>
      <Hero />
      <section id="features">
        <Features />
      </section>
      <section id="contact" className = 'mt-20 sm:-mt-1 md:mt-12 lg:mt-14 '>
        <Contact />
      </section>
    </main>
  );
}

export default HomePage