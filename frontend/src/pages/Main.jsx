import React, { useEffect, useRef, useState} from "react"
import Aside from "../components/Aside"
import Chat from "../components/ChatDisplay/Chat"
import { useDispatch } from "react-redux"
import { addChat, getAllChats } from "../features/chatSlice"
import {Navigate} from "react-router-dom"
import "../styles/main.css"
import {Routes, Route} from "react-router-dom"
import Profile from "../components/Home/Profile"
import {connectSocket} from "../socket"

const Main = () => {    
  const dispatch = useDispatch()
  
  const auth = localStorage.getItem("auth token")
  const [socket] = useState(() => connectSocket())

  const ev = useRef()
  const main = useRef()
  
  useEffect(() => {   
    if (ev.current) return

    window.addEventListener("resize" , () => {
      main.current.classList.add("resize-animation-stopper")

      setTimeout(() => {
        main.current.classList.remove("resize-animation-stopper")
      })
    })

    window.addEventListener("resize", ev.current)
  }, [dispatch])

  useEffect(() => {
    const fetchChats = () => {
      dispatch(getAllChats(socket))
    }
    
    const disconnectSocket = () => {
      socket.emit("userDisconnect")
    }

    if (auth) {
      fetchChats()

      // adding connection and disconnection events //
      window.addEventListener("online", fetchChats)
      window.addEventListener("offline", disconnectSocket)
      window.addEventListener("beforeunload", disconnectSocket)
      
      // Socket setup for live chatting functionality. //  
      socket.on("createChat", (chat) => {
        socket.emit("online", {room: chat.chat})
        dispatch(addChat(chat))
      })

      socket.on("disconnecting", () => {
        socket.emit("disconnect")
      })
    }

    return (
      () => {
        if (socket) disconnectSocket()

        // remove connection and disconnection events //
        window.removeEventListener("online", fetchChats)
        window.removeEventListener("offline", disconnectSocket)
        window.removeEventListener("beforeunload", disconnectSocket)
      }
    )
  }, [dispatch, auth, socket])
  
  return (
    <>
      {
        auth?
          <div ref={main} id="main">
            <Routes>
              <Route element={<Aside />}>
                <Route path="chat" element={<Chat />} />
                <Route path="profile" element={<Profile />} />
                <Route index element={<Profile />} />
              </Route>
            </Routes>
          </div>
          :
          <Navigate to="/login" />
      }
    </>
  )
}

export default Main