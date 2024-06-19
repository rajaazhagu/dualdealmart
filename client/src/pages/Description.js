import React from 'react'

const Description = ({list}) => {
  return (
    <div className='flex justify-center items-center'>
            <div className="w-72 h-45 border bg-white  break-words ml-4 my-3 overflow-scroll rounded-lg">
                <p className='text-black font-semibold ml-2'>Description : </p>
                <p className='ml-8'>{list[0].description}</p>
            </div>
  </div>
  
  )
}

export default Description