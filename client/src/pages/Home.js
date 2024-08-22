import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../Context";
import Message from "./Message";
import Signin from "./Signin";

const Home = () => {
  const { user ,fetchUserDetails ,socket} = useContext(Context);
  const navigate = useNavigate();
    

 useEffect(()=>{ fetchUserDetails()},[])

  return (
    <>
      {user?  (
        <div className="h-[100vh] p-0 m-0" style={{ backgroundImage: 'url(../../assest/bg-img.jfif)' }}>
          <Message />
        </div>
      ):(<Signin/>)}
    </>
  );
};

export default Home;
