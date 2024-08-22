import axios from 'axios';
import React,{useContext} from 'react'
import { useState } from 'react';
import Api from '../API_ENDS_POINT';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Context from '../Context';

axios.defaults.withCredentials=true

const Signin = () => {
  const {fetchUserDetails}=useContext(Context)

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: null
      });
 const navigate=useNavigate();
      const handleInputChange=(e)=>{

        const {name,value}=e.target;

        setData((p)=>{return {...p,[name]:value}})
      }

      const handleSubmit=async(e)=>
        {
          console.log('www')
            e.preventDefault();
            try {
              const res=  await axios.post(Api.signin.url,data)
                fetchUserDetails();
                toast.success(res?.data?.message)
                console.log('www')

           navigate('/home')
                
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
  return (
        <div className='max-w-sm mx-auto outline-1 outline-green-400 outline-dashed'>
          <p className='font-bold text-center'>Welcome to NoorChat!</p>
          <form className='flex flex-col mt-3 gap-2' onSubmit={handleSubmit}>
           
    
            <label>Email:</label>
            <input
              name='email'
              value={data.email}
              onChange={handleInputChange}
              required
              placeholder='Enter your email...'
              className='focus:outline-green-400 bg-slate-100 p-3 mx-1'
            />
    
            <label>Password:</label>
            <input
              name='password'
              value={data.password}
              onChange={handleInputChange}
              required
              placeholder='Your password...'
              type='password'
              className='focus:outline-green-400 bg-slate-100 p-3 mx-1'
            />
    
            
            <button type='submit' className='bg-green-400 text-white p-3'>Sign in</button>
       
          </form>
        </div>
      );  
}

export default Signin