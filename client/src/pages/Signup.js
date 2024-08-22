import React, { useState,useRef } from 'react';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios'
import Api from '../API_ENDS_POINT';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: null
  });
  const fileInputRef = useRef(null);
const navigate=useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(p => ({
      ...p,
      [name]: value
    }));
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    console.log('here is the file',file)
    setData(p => ({
      ...p,
      avatar: file
    }));
  };

  const handleAvatarReset = () => {
    setData(p => ({
      ...p,
      avatar: null
    }));

    fileInputRef.current.value = null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('avatar', data.avatar);
    console.log('formdata is :  ',formData)

    try {
      const response = await axios.post(Api.register.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data.message);
      toast.success('welcom!')
      navigate('/signin')
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message )
    }
  };
  return (
    <div className='max-w-sm mx-auto outline-1 outline-green-400 outline-dashed'>
      <p className='font-bold text-center'>Welcome to NoorChat!</p>
      <form className='flex flex-col mt-3 gap-2' onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          name='name'
          value={data.name}
          onChange={handleInputChange}
          required
          placeholder='Your name...'
          className='focus:outline-green-400 bg-slate-100 p-3 mx-1'
        />

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

        <label>Photo:</label>
        <div className='relative bg-slate-100'>
          <input
            name='avatar'
            onChange={handleImg}
            required
            type='file'
            className='w-full focus:outline-green-400 bg-slate-100 p-3 m-1'
            ref={fileInputRef}
          />
          {data.avatar && (
            <button
              type='button'
              onClick={handleAvatarReset}
              className='absolute top-1 right-2 hover:bg-slate-300'
            >
              <RxCross2 />
            </button>
          )}
        </div>
        <button type='submit' className='bg-green-400 text-white p-3'>Register</button>
        <p className='font-light'>Already have account? <Link className='font-bold hover:bg-green-400 hover:text-white' onClick={()=>{navigate('/signin')}}>Login</Link> </p>
      </form>
    </div>
  );
};

export default Signup;
