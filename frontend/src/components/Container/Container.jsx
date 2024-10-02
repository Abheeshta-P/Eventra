import React from 'react'

function Container({children,className}) {
  return (
    <div className={`p-6 w-full h-screen ${className}`}>
      {children}
    </div>
  )
}

export default Container