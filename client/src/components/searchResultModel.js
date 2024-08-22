import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import Api from '../API_ENDS_POINT';
import Context from '../Context';

const SearchResultsModal = ({ results = [], onClose }) => {
  const { user, conversations=[], settingCurrentConversation ,getAllConversations} = useContext(Context);

  const handleSelectUser = async (userId) => {
    console.log('inside serachresult ,')
    // Check if the conversation with the selected user already exists
    const existingConversation = conversations.find(conv =>
      conv.members.some(member => member._id === userId)
    );
    console.log('is exist',existingConversation)
    if (existingConversation) {
      // If the conversation exists, set it as the current conversation
      settingCurrentConversation(existingConversation._id);
    } else {
      // Otherwise, create a new conversation
      try {
        const res = await axios.post(Api.createConversation.url, { senderId: user._id, receiverId: userId });
        settingCurrentConversation(res.data._id); // Pass the new conversation to the context
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }

    // Close the modal after selection
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 bg-gray-800 bg-opacity-75 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-4 rounded shadow-lg w-1/2">
        <button onClick={onClose} className="float-right bg-red-500 text-white px-2 py-1 rounded">Close</button>
        <h2 className="text-xl font-bold mb-4">Search Results</h2>
        <ul>
          {results.map(user => (
            <li key={user._id} className="mb-2 bg-slate-800" onClick={() => handleSelectUser(user._id)}>
              <div className='flex items-center mt-2 gap-3 hover:bg-gray-200 hover:cursor-pointer overflow-hidden m-2 my-4'>
                <img  className='w-10 h-10 rounded-full' alt="user-avatar" />
                <p className='font-medium'>{user?.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchResultsModal;
