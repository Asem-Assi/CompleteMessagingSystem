import React, { useContext, useEffect, useRef, useState } from "react";

import { format } from "timeago.js";
import Context from "../Context";

import Avatar from "./Avatar";

import audio from "../audio.wav";
import Sender from "./Sender";

const MessageContent = () => {
  const {
    user,
    fetchAllMessages,
    currentConversation,
    messages,
    getAllConversations,
    socket,
    settingOnlineConversation,
    settingMessagesToNull,
    hasNext,
    settingMessageForSocket,
  } = useContext(Context);
  const scrollRef = useRef(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    settingMessagesToNull();
  }, [currentConversation]);

  const playNotificationSound = () => {
    const notificationSound = new Audio(audio);
    notificationSound.play().catch((error) => {
      console.error("Error playing notification sound:", error);
    });
  };

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (data) => {
        console.log("data from socket", data);
        if (data?.conversationId === currentConversation?._id) {
          settingMessageForSocket(data);
          settingOnlineConversation(data);
          getAllConversations();
          playNotificationSound();
        } else {
          settingOnlineConversation(data);
          getAllConversations();
          playNotificationSound();
        }
      };

      socket.on("getMessage", handleNewMessage);

      return () => {
        socket.off("getMessage", handleNewMessage);
      };
    }
  }, [socket, currentConversation]);

  useEffect(() => {
    fetchAllMessages(page);
  }, [currentConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-screen  relative flex flex-col">
      <div className="overflow-y-auto no-scrollbar flex-1">
        {messages?.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="mb-2 mx-2 mt-1 ">
              <div
                className={`${
                  user?._id === message?.sender
                    ? "flex justify-end gap-3"
                    : "flex gap-3"
                }`}
              >
                {/* here is the bagground red content */}
                <Avatar
                  logoo={
                    user?._id === message?.sender
                      ? user?.avatarUrl
                      : currentConversation?.members[0]?.avatarUrl
                  }
                />
                {/* this avatar i send just the img so it create the circle img */}
                <div className="flex flex-col ">
                  {/* this p is for message text! */}
                  {!message?.mediaType && (
                    <p
                      className={`${
                        user?._id === message?.sender
                          ? "bg-slate-400 text-black rounded-xl max-w-80 p-3 break-words"
                          : "bg-blue-400 text-white rounded-xl max-w-80 p-3 break-words"
                      }`}
                    >
                      {message?.text}
                    </p>
                  )}
                  {message?.mediaType === "img" && (
                    <div className="border-l-green-900 w-[350px] ml-auto   ">
                      <img
                        src={message?.mediaUrl}
                        className=" cursor-pointer"
                        alt="img not uploaded"
                        onClick={() => {
                          window.open(message?.mediaUrl, "_blank");
                        }}
                      />
                    </div>
                  )}
                  {message?.mediaType == "video" && (
                    <video controls src={message.video} />
                  )}
                  {message?.mediaType === "audio" && (
                    <audio controls src={message.mediaUrl} />
                  )}
                </div>
                {/* here is the end of div flex-col that display the message   */}
              </div>
              <p
                className={`${
                  user?._id === message?.sender ? "text-right" : "text-left"
                } text-xs font-thin`}
              >
                {format(message?.createdAt)}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center mt-4">No messages yet</div>
        )}
        <div ref={scrollRef} />
      </div>

      {hasNext && (
        <button
          className="absolute top-0 hover:cursor-pointer"
          onClick={() => {
            setPage((prev) => prev + 1);
            fetchAllMessages(page + 1);
          }}
        >
          {" "}
          seeMore...
        </button>
      )}
      
      <Sender/>
    </div>
  );
};

export default MessageContent;
