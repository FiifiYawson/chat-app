import React,{ useEffect, useState} from "react"
import Contacts from "../components/Contacts"
import Chat from "../components/Chat"
import { useDispatch} from "react-redux"
import { addChat, addText, getAllChats, isTyping, online } from "../features/chatSlice"
import { io } from "socket.io-client"
import "../main.css"

const Main = () => {    
  const dispatch = useDispatch()
  
  const [socket] = useState(() => io.connect())
  
  useEffect(() => {   
    dispatch(getAllChats(socket))

    socket.emit("userConnect", {
      rooms: JSON.parse(localStorage.getItem("chats")),
      user: localStorage.getItem("id"),
      socketId: socket.id
    })

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

    return (
      () => {
        socket.emit("userDisconnect", {
          rooms: JSON.parse(localStorage.getItem("chats")),
        })
      }
    )
  }, [socket,dispatch]) 

  return (
    <>
      <socketContext.Provider value={socket}>
        <div id="main">
            <Contacts/>
          <div id="messageDisplay">
            <Chat />
          </div>
        </div>
      </socketContext.Provider>
    </>
  )
}

export const socketContext = React.createContext()
export default Main