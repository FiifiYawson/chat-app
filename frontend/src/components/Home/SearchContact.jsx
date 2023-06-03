import {useState} from 'react'
import ProfilePicture from '../ProfilePicture'
import { createChat} from "../../features/chatSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import "../../styles/search-contact.css"
import getSocket from "../../socket"

function SearchContact({ contact }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const chat = useSelector((store) => store.chat.chats.find(chat => chat.chatRef === contact._id))
  const [socket] = useState(() => getSocket())

  const createChatFn = () => {
    if (chat) {
      navigate("/chat", {
        state: {
          chat,
          name: contact.name,
          username: contact.username
        }
      })
    } else {
      dispatch(createChat({receiverId: contact._id, socket}))
    }
  }
    
  return (
    <div id='search-contact' className='contact-container'>
        <ProfilePicture id={contact._id} />
        <div className='contact-details'>
          <span title={contact.name} className='contact-name'>{contact.name}</span>
          <span title={`@${contact.username}`} className='contact-username'>@{contact.username}</span>
        </div>
      <button onClick={createChatFn} className={`${chat ? "chat-button" : "add-button"}`}>{chat ? "CHAT" : "ADD"}</button>
    </div>
  )
}

export default SearchContact