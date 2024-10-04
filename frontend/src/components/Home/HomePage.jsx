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
      <section id="contact" className = 'sm:-mt-10 md:mt-0 lg:-mt-16'>
        <Contact />
      </section>
    </main>
  );
}

export default HomePage