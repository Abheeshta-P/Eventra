import React from 'react'
import '../loading.module.css'

function loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div class="container-spinner">
        <div class="half"></div>
        <div class="half"></div>
      </div>
    </div>


  )
}

export default loading