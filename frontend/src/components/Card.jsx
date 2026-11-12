import React from 'react'

function Card({children,photo,title,description,className='',imgClass='',titleClass='',descriptionClass='',...props}) {
  return (
    <div className={`flex flex-col shadow-xl border border-black/10 rounded-lg w-full max-w-[350px] lg:max-w-[400px] min-h-[300px] md:min-h-[400px] lg:min-h-[420px] justify-between p-5 min-w-0 overflow-hidden ${className}`} {...props}>
      <div className={`border border-black/30 w-full h-[150px] md:h-[250px] rounded-md overflow-hidden shrink-0 ${imgClass}`}>
        <img src={photo} alt={title} className={'object-cover w-full h-full'}/>
      </div>
      <div className={'flex flex-col gap-3 min-w-0 mt-3 flex-1 justify-end'}>
        <h1 className={`font-semibold text-zinc-900 text-lg md:text-xl lg:text-2xl break-words [overflow-wrap:anywhere] min-w-0 ${titleClass}`}>{title}</h1>
        <h3 className={`text-zinc-800 text-base lg:text-lg break-words [overflow-wrap:anywhere] min-w-0 ${descriptionClass}`}>{description}</h3>
      </div>
    </div>
  )
}

export default Card