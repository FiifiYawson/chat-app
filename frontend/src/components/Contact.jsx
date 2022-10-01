import { useDispatch } from 'react-redux'
import { setActiveChat } from "../features/chatSlice.js"
import ProfilePicture from './ProfilePicture.jsx'
import "../styles/contact.css"

function Contact({chat, _id, user, activeChat }) {
  const dispatch = useDispatch()

  let status = null

  let contactClass = null
    
  if (activeChat) {
    contactClass = activeChat._id === _id ? "contact active" : "contact"
  }

  if (chat.isTyping) {
    status = "Typing..."
  } else if (chat.isOnline) {
    status = "Online"
  } else {
    status = "Offline"
  }

  return (
    <div className={contactClass ? contactClass : "contact"} onClick={() => dispatch(setActiveChat(_id))}>
      <ProfilePicture contact={user} isUser={false} />
      <div id="contact-info">
        <div className='contact-title'>{user.name}</div>
        <div className='contact-status'>{status}</div>
      </div>
    </div>
  )
}

export default Contact