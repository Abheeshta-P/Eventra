import React from 'react'

function Card({children,photo,title,description,className=''}) {
  return (
    <div className={`flex flex-col shadow-xl border border-black/10 rounded-lg w-[350px] md:w-[400px] h-[300px] md:h-[400px] justify-between p-5 ${className}`}>
      <div className={'border border-black w-full h-[150px] md:h-[250px]'}>
        <img src={photo} alt={title} className={'object-fit w-full h-full'}/>
      </div>
      <div className={'flex flex-col gap-4'}>
        <h1 className={'font-semibold text-zinc-900'}>{title}</h1>
        <h3 className={'text-zinc-800'}>{description}</h3>
      </div>
    </div>
  )
}

export default Card