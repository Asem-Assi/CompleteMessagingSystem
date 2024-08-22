import React, { useEffect, useState } from 'react';
    
import { Outlet } from 'react-router-dom'; // Removed useNavigate
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Api from './API_ENDS_POINT';
import Context from './Context';
import io from 'socket.io-client';

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [socket, setSocket] = useState();
  const [onlineConversation, setOnlineConversation] = useState(null);
  const [messages, setMessages] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  const settingCurrentConversation = (con) => setCurrentConversation(con);
  const settingOnlineConversation = (con) => setOnlineConversation(con);
  const settingConversations = (con) => setConversations(con);
  const settingMessagesToNull = () => setMessages(null);

  // these states for calling 
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(Api.userInfo.url, { withCredentials: true });
      setUser(res.data.data);
    } catch (error) {
      handleLogout();
      error?.response?.data?.message && console.log(error.response.data.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(Api.logout_user.url);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getAllConversations = async () => {
    try {
      if (user && user._id) {
        const res = await axios.get(`${Api.getConversation.url}/${user._id}`);
        setConversations(res.data);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
    }
  };

  const fetchAllMessages = async (page = 1, limit = 10) => {
    try {
      if (user && user._id && currentConversation) {
        const response = await axios.get(Api.getMessage.url, {
          params: {
            conversationId: currentConversation,
            page,
            limit
          }
        });

        const newMessages = response.data.reverse();
      
        if (newMessages.length < limit) {
          setHasNext(false);
        }

        setMessages(prevMessages => {
          if (!prevMessages) {
            return newMessages;
          }

          const updatedMessages = [...newMessages, ...prevMessages];
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error?.response?.data?.message);
    }
  };

  const updateSeen = async (conId, userId) => {
    try {
      await axios.post(Api.updateSeen.url, { conversationId: conId, userId });
      getAllConversations();
    } catch (error) {
      console.error('Error updating seen status:', error);
    }
  };

  const settingMessageForSocket = (data) => {
    setMessages(prev => [...prev, data]);
  };

  useEffect(() => {
    if (user) {
      const newSocket = io('ws://localhost:8900');
      setSocket(newSocket);

      return () => {
        console.log('socket is closed in app.js')
        newSocket.close();
      };
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      setHasNext(true);
    }
  }, [currentConversation]);

  const settingOnlineUsers = (data) => {
    setOnlineUsers(data);
  };

  return (
    <Context.Provider value={{
      fetchUserDetails,
      getAllConversations,
      settingCurrentConversation,
      handleLogout,
      currentConversation,
      user,
      conversations,
      fetchAllMessages,
      messages,
      socket,
      onlineConversation,
      settingOnlineConversation,
      settingConversations,
      updateSeen,
      settingMessagesToNull,
      hasNext,
      settingMessageForSocket,
      settingOnlineUsers,
      onlineUsers,
      // these for calling
      receivingCall,
      setReceivingCall,
      caller,
      setCaller,
      callerSignal,
      setCallerSignal,
      callAccepted,
      setCallAccepted
    }}>
      <Toaster />
      <main>
        <Outlet /> {/* Context will be available to components rendered by the Outlet */}
      </main>
    </Context.Provider>
  );
}

export default App;
