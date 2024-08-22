import { useContext, useEffect, useState } from "react";
import Conversation from "../components/Conversation";
import MessageContent from "../components/MessageContent";
import Calling from "./Calling";
import Context from "../Context";
import Modal from "../components/Modal";
import PublishingComponent from "../components/PublishingComponent";
import PlayingComponent from "../components/PlayingComponent";

const Message = () => {
  const [haveACall, setHaveACall] = useState(false);
  const [userToCall, setUserToCall] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [isCaller, setIsCaller] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { socket } = useContext(Context);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAccept = () => {
    setHaveACall(true);
    closeModal();
  };

  const handleReject = () => {
    alert("Rejected");
    closeModal();
  };

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data) => {
      console.log("Incoming call data:", data);
      setCaller(data.from);
      setIsCaller(false); // Assuming this user is receiving the call
      setReceivingCall(true);
      setIsModalOpen(true)
      //setHaveACall(true)
    };

    console.log("Setting up 'hey' listener in Message component");
    socket.on("hey", handleIncomingCall);

    return () => {
      console.log("Cleaning up 'hey' listener in Message component");
      socket.off("hey", handleIncomingCall);
    };
  }, [socket]);

  return (
    <>
      {haveACall ? (
        isCaller ? (
          <PublishingComponent calle={userToCall} />
        ) : (
          <PlayingComponent />
        )
      ) : (
        <div className="absolute inset-4 flex rounded-lg" style={{ backgroundColor: "rgba(17, 25, 40, 0.75)" }}>
          <div className="border-r-2 border-red-200 flex-[1.3]">
            <Conversation
              settingACall={setHaveACall}
              settingAUserToCall={setUserToCall}
              settingCaller={setIsCaller}
            />
          </div>
          <div className="flex-[3] border-r-2 border-red-200">
            <MessageContent />
            {receivingCall && (
              <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onAccept={handleAccept}
                onReject={handleReject}
                caller={caller}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
