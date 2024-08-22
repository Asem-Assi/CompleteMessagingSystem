import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Api from '../API_ENDS_POINT';
import Context from '../Context';

const OnlineUser = ({ results = [] }) => {
  const { user, conversations = [], settingCurrentConversation } = useContext(Context);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      try {
        const res = await axios.get(`${Api.getUserDetails.url}/${userId}`);
        return res.data;
      } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
      }
    };
    const fetchAllUserDetails = async () => {
      const userDetailPromises = results.map(userId => fetchUserDetails(userId.userId));
      const users = await Promise.all(userDetailPromises);
      setOnlineUsers(users.filter(user => user !== null));
    };

    if (results.length > 0) {
      fetchAllUserDetails();
    }
  }, [results]);

  const handleSelectUser = async (userId) => {
    const existingConversation = conversations.find(conv =>
      conv.members.some(member => member._id === userId)
    );

    if (existingConversation) {
      settingCurrentConversation(existingConversation._id);
    } else {
      try {
        const res = await axios.post(Api.createConversation.url, { senderId: user._id, receiverId: userId });
        settingCurrentConversation(res.data._id);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }
  };

  return (
    <>
      {onlineUsers.map(user => (
        <div key={user._id} onClick={() => handleSelectUser(user._id)} className='flex items-center mt-2 gap-3 hover:bg-gray-200 hover:cursor-pointer overflow-hidden m-2 my-4'>
          <div className='relative'>
            <img  className='w-10 h-10 rounded-full' alt={`${user.name}-avatar`} />
            <div className='bg-green-600 rounded-full w-[10px] h-[10px] absolute top-1 right-1'></div>
          </div>
          <p className='font-medium'>{user.name}</p>
        </div>
      ))}
    </>
  );
};

export default OnlineUser;
