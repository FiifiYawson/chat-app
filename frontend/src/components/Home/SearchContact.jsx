import React from 'react'
import ProfilePicture from '../ProfilePicture'
import { createChat, setActiveChat } from "../../features/chatSlice"
import { useDispatch, useSelector } from "react-redux"
import { useContext } from "react"
import { socketContext } from "../../pages/Main"
import "../../styles/search-contact.css"

function SearchContact({ contact }) {
  const dispatch = useDispatch()

  const socket = useContext(socketContext)

  const chat = useSelector((store) => store.chat.chats)

  const isFriend = chat.find(chat => contact.chats.includes(chat._id))

  const createChatFn = () => {
    if (isFriend) {
      dispatch(setActiveChat(isFriend._id))
    } else {
      dispatch(createChat({receiverId: contact._id, socket}))
    }
  }
    

  return (
    <div className='contact-container'>
        <ProfilePicture id={contact._id} />
        <div id='contact-details'>
            <span className='contact-name'>{contact.name}</span>
        </div>
      <button onClick={createChatFn} className={`${isFriend ? "chat-button" : "add-button"}`}>{isFriend ? "CHAT" : "ADD"}</button>
    </div>
  )
}

export default SearchContact