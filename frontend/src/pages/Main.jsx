import React, { useEffect, useState } from "react"
import { useNavigate} from "react-router-dom"
import Aside from "../components/Aside"
import Chat from "../components/Chat"
import { useDispatch, useSelector } from "react-redux"
import { addChat, addText, getAllChats, isTyping, online } from "../features/chatSlice"
import { io } from "socket.io-client"
import Login from "./Login"
import "../styles/main.css"

const Main = () => {    
  const dispatch = useDispatch()

  const navigate = useNavigate()
  
  const auth = localStorage.getItem("auth token")

  // Connect to socket if user is logged in. //
  const [socket] = useState(() => {
    if (auth) {
      return io.connect()
    }
    return null
  })

  const chat = useSelector((store) => store.chat )
  
  //Socket setup for live chatting functionality and other setups. // 
  useEffect(() => {

    //Stop animations and transitions while page resizes. //
    let resizeTimer;
    window.addEventListener("resize", () => {
      document.body.classList.add("resize-animation-stopper");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
      }, 400);
    });

    if (auth) {

      dispatch(getAllChats(socket))
      
      //Socket setup for live chatting functionality. //  
      socket.on("online", (payload) => {
        dispatch(online(payload))
      })
      
      socket.on("createChat", (chat) => {
        dispatch(addChat(chat))
      })
      socket.on("message", (message) => {
        dispatch(addText(message))
      })
  
      socket.on("isTyping", (typing) => {
        dispatch(isTyping(typing))
      })
    } else {
      navigate("/login")
    }

    return (
      //User disconnects. //
      () => {
        if (socket) {
          socket.emit("userDisconnect")
        }
      }
      )
    }, [socket, dispatch, navigate, auth])
  return (
    <>
      {
        auth?
        <socketContext.Provider value={socket}>
            <div id="main">
                <Aside/>
                {chat.activeChat &&<Chat />}
            </div>
          </socketContext.Provider> 
          :
          <Login />
      }
    </>
  )
}

export const socketContext = React.createContext()
export default Main