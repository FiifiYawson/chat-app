import { useDispatch } from 'react-redux'
import {setActiveChat} from "../features/chatSlice.js"

function Contact({chat, _id, user, activeChat }) {
  const dispatch = useDispatch()

  let contactClass = null
  let status = null

  if (activeChat) {
    contactClass = activeChat._id === _id ? "contact active" : "contact"
  }

  if (chat.isTyping) {
    status = "typing"
  } else if (chat.isOnline) {
    status = "Online"
  } else {
    status = "Offline"
  }

  return (
    <div className={activeChat ? contactClass:  "contact"} onClick={() => dispatch(setActiveChat(_id))}>
      <div className='contact-title'>{user.name}</div>
      <div className='contact-status'>{status}</div>
    </div>
  )
}

export default Contact