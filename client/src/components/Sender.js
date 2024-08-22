import React, { useContext, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { FaImage, FaVideo } from "react-icons/fa";
import { AiFillAudio } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";
import Context from "../Context";
import axios from "axios";
import Api from "../API_ENDS_POINT";

const Sender = ({ page }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [mediaType, setMediaType] = useState("");
  const {
    user,
    fetchAllMessages,
    currentConversation,
    socket,
    settingMessageForSocket,
  } = useContext(Context);
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setMedia(file);
        // createNewMessage()

        setMediaType("img");
      } else if (file.type.startsWith("video/")) {
        setMedia(file);
        setMediaType("video");
      } else if (file.type.startsWith("audio/")) {
        setMedia(file);
        setMediaType("audio");
      }
      setMenuVisible(false);
    }
  };

  const createNewMessage = async () => {
    // console.log("audio", audioUrl, "audiofile", audioFile);
    if (text.trim() === "" && !media && !audioFile) return;

    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("sender", user?._id);
      formData.append("conversationId", currentConversation?._id);
      formData.append("mediaType", mediaType);

      if (media) formData.append("media", media);
      if (audioUrl) {
        // Convert audio URL to Blob and append to formData
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        formData.append("media", blob, "recording.wav");
      }

      //console.log("here is form data : ", formData);

      const res = await axios.post(Api.createMessage.url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("here is rs : ", res);

      const data = {
        text: text,
        mediaType: mediaType,
        sender: user?._id,
        conversationId: currentConversation?._id,
        receiverId: currentConversation?.members[0]?._id,
        mediaUrl:media?res?.data?.mediaUrl:''
      };
     

      if (socket) {
        socket.emit("sendMessage", data);
      }

      setText("");
      setMedia(null);
      setMediaType('');
      setAudioUrl(null); // Clear audio URL after sending
      settingMessageForSocket(data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setAudioFile(audioBlob); // Set the audio file
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording((p) => !p);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording((p) => !p);
    }
  };
  return (
    <div className="w-full h-14 sticky bottom-0 left-0 right-0 mb-8 flex items-center px-3">
      <textarea
        rows={1}
        className="bg-transparent rounded-2xl w-[90%] h-full px-3 pr-12 focus:outline-0 border p-3 resize-none ml-5"
        placeholder="Write something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <IoMdSend
        className="absolute right-2 cursor-pointer text-xl"
        onClick={createNewMessage}
      />
      <div className="absolute left-1">
        <CiCirclePlus
          className=" cursor-pointer text-2xl"
          onClick={() => setMenuVisible(!menuVisible)}
        />
        {menuVisible && (
          <div className="absolute left-2 bottom-full bg-transparent border border-[#59606c] rounded shadow-md w-32">
            <label
              htmlFor="image-upload"
              className="block cursor-pointer p-2 hover:bg-[#59606c]"
            >
              <FaImage /> Image
              <input
                id="image-upload"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleMediaChange}
              />
            </label>
            <label
              htmlFor="video-upload"
              className="block cursor-pointer p-2 hover:bg-[#59606c]"
            >
              <FaVideo /> Video
              <input
                id="video-upload"
                type="file"
                style={{ display: "none" }}
                accept="video/*"
                onChange={handleMediaChange}
              />
            </label>
            <label
              htmlFor="audio-upload"
              className="block cursor-pointer p-2 hover:bg-[#59606c]"
            >
              <button
                onClick={
                  isRecording
                    ? stopRecording
                    : () => {
                        startRecording();
                        setMediaType("audio");
                      }
                }
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
                <AiFillAudio />
              </button>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sender;
