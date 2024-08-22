import React, { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import { CiSearch } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";
import { CiVideoOn } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { TiDelete } from "react-icons/ti";
import { IoIosPersonAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Context from "../Context";
import axios from "axios";
import Api from "../API_ENDS_POINT";
import Modal from "./Modal";
import Calling from "../pages/Calling"; // Import the Calling component

const Conversation = ({settingACall,settingAUserToCall,settingCaller}) => {

  const {
    user,
    getAllConversations,
    conversations,
    settingCurrentConversation,
    currentConversation,
    socket,
    onlineConversation,
    settingConversations,
    updateSeen,
    settingOnlineUsers,
    onlineUsers,
    receivingCall,
  } = useContext(Context);
  
  const [searchKey, setSearchKey] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
    console.log('rc', receivingCall);
  }, [receivingCall]);

  useEffect(() => {
    if (onlineConversation && conversations) {
      const updatedConversations = conversations.map(con => 
        con._id === onlineConversation.conversationId
          ? {
              ...con,
              lastMessage: {
                ...con.lastMessage,
                text: onlineConversation.text
              }
            }
          : con
      );

      const updatedConvo = updatedConversations.find(con => con._id === onlineConversation.conversationId);
      const sortedConversations = [updatedConvo, ...updatedConversations.filter(con => con._id !== onlineConversation.conversationId)];

      settingConversations(sortedConversations);
    }
  }, [onlineConversation]);

  useEffect(() => {
    if (!isSearching) {
      getAllConversations();
    }
  }, [user]);

  useEffect(() => {
    user?._id && socket && socket?.emit('addUser', user._id);

    socket?.on('getUsers', (data) => { 
      settingOnlineUsers(data);
      console.log('here is all user online', data);
      console.log('here is state online', onlineUsers);
    });
  }, [user, socket]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchKey(value);
    setIsSearching(true);

    if (value.length > 0) {
      try {
        const res = await axios.post(Api.searchUser.url, { searchKey: value });
        setSearchResult(res?.data?.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setSearchResult([]);
      setIsSearching(false);
    }
  };

  const hasSeenLastMessage = (conversation, userId) => {
    if (conversation?.seenStatus && conversation?.seenStatus?.length > 0) {
      const seenStatus = conversation?.seenStatus?.find(status => status.member.toString() === userId.toString());
      return seenStatus ? seenStatus.seen : false;
    }
    return false;
  };

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

  const findUserById = (userId) => {
    return onlineUsers.find(user => user.userId === userId);
  };

  const handleCallClick = () => {
    const userId = currentConversation?.members[0]?._id;
    const user = findUserById(userId);
    if (user) {
      socket.emit('callerMakeACall',{calleSocketId:user?.socketId,streaId:'123'})

     // navigate('/call', { state: { user: user, socketId: user.socketId, isCaller: true } });
     settingAUserToCall(user)
     settingCaller(true)
     settingACall(true); // Set haveACall to true when initiating a call

    } else {
      console.error('User not found');
    }
  };



  // Conditional rendering based on the haveACall state

  return (
    <div className="no-scrollbar overflow-auto h-[100vh]">
      <div className="flex items-center justify-between mt-2">
        <Avatar logoo={currentConversation?.members[0]?.avatarUrl} name={currentConversation?.members[0]?.name} />
        <div className="flex items-center gap-2">
          <IoIosMore className="text-2xl hover:cursor-pointer" />
          <CiVideoOn className="text-2xl hover:cursor-pointer" onClick={handleCallClick} />
          <CiEdit
            onClick={() => navigate("/Edit")}
            className="text-2xl hover:cursor-pointer"
          />
        </div>
      </div>
      <div className="rounded-2xl border mt-11 relative">
        <div className="absolute top-2 left-1">
          <CiSearch size={25} />
        </div>
        <input
          className="p-2 mx-6 focus:outline-none bg-transparent"
          placeholder="Search users..."
          value={searchKey}
          onChange={handleInputChange}
        />
        {isSearching && (
          <div
            className="absolute top-2 right-1 cursor-pointer"
            onClick={() => {
              setIsSearching(false);
              setSearchKey("");
            }}
          >
            <TiDelete size={25} />
          </div>
        )}
      </div>
      <div className="flex flex-col snap-y">
        {isSearching
          ? searchResult?.map((user) => (
              <div
                key={user?._id}
                className="border-b bg-slate-900 hover:cursor-pointer mt-5"
                onClick={() => {
                  handleSelectUser(user._id)
                  setIsSearching(false);
                }}
              >
                <div
                  className="flex items-center gap-6 justify-start relative group"
                >
                  <Avatar logoo={user?.avatarUrl} name={user?.name} />
                  <div className="relative">
                    <IoIosPersonAdd className="text-xl" />
                  </div>
                </div>
                <div className="m-2">{user?.email}</div>
              </div>
            ))
          : conversations?.map((con) => {
              const lastMessageSeen = hasSeenLastMessage(con, user?._id);
              return (
                <div
                  key={con?._id}
                  className="flex flex-col justify-center mt-5 border-b hover:cursor-pointer relative"
                  onClick={() => {
                    settingCurrentConversation(con);
                    updateSeen(con?._id, user?._id);
                  }}
                >
                  <Avatar
                    logoo={con?.members[0]?.avatarUrl}
                    name={con?.members[0]?.name}
                  />

                  {onlineUsers.some((id) => con?.members[0]?._id === id.userId) && (
                    <div className="rounded-full w-3 h-3 bg-green-700 absolute top-0 right-0"></div>
                  )}
                  {!lastMessageSeen && (
                    <p className="absolute top-0 right-4 text-white animate-pulse">
                      new
                    </p>
                  )}
                  <p className="max-w-56 truncate p-2">
                    {con?.lastMessage ? con?.lastMessage?.text : "no message"}
                  </p>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Conversation;
