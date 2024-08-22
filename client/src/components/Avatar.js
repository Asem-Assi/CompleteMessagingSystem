import React from 'react'
import logo from './logo192.png'
const Avatar = ({logoo,name}) => {
  return (
    <div className='flex items-center justify-between '>
        <div className='flex items-center gap-2 p-1'>  <img className='w-10 h-10 rounded-full object-cover' src={logoo?logoo:logo}></img>
      { name &&( <p className='text-white  font-bold text-center max-w-56 truncate p-2'> {name}</p>)}</div>
      

            </div>
  )
}

export default Avatar