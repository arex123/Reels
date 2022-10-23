import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../Context/AuthContext"
import { database } from "../firebase";
import Posts from "./Posts";
import Uploadfiles from "./Uploadfiles";
import Navbar from "./Navbar"

function Feed() {
  const {user,logout} = useContext(AuthContext)
  const navigate = useNavigate()
  const handleClick=async()=>{
      let res = logout()
      navigate('/login')
  }

  //getting user data from firebase database
  const [userData,setUserData] = useState('')
  useEffect(()=>{
    const unsub=database.users.doc(user.uid).onSnapshot((snapshot)=>{
        setUserData(snapshot.data())
    })
    return ()=>{unsub()}
  },[user])


  return (
    <>
    <Navbar userData={userData}/>
    <div style={{display:'flex',justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
    {/* <div className="comp" style={{width:'50%'}}>
      <h1>Welcome to feed</h1>
      <button onClick={handleClick}>logout</button>
    </div> */}
      <Uploadfiles user={userData}/>
      <Posts userData={userData}/>
    </div>
    </>
  );
}

export default Feed;
