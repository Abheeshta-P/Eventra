import React from 'react'

function Card({children,photo,title,description,className='',imgClass='',titleClass='',descriptionClass=''}) {
  return (
    <div className={`flex flex-col shadow-xl border border-black/10 rounded-lg w-[350px] lg:w-[400px] h-[300px] md:h-[400px] lg:h-[420px] justify-between p-5  ${className}`}>
      <div className={`border border-black/30 w-full h-[150px] md:h-[250px] ${imgClass}`}>
        <img src={photo} alt={title} className={'object-cover w-full h-full'}/>
      </div>
      <div className={'flex flex-col gap-4'}>
        <h1 className={`font-semibold text-zinc-900 text-lg md:text-xl lg:text-2xl ${titleClass}`}>{title}</h1>
        <h3 className={`text-zinc-800 text-base lg:text-lg ${descriptionClass}`}>{description}</h3>
      </div>
    </div>
  )
}

export default Card