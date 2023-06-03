import { useDispatch, useSelector } from 'react-redux'
import { addText, removeText } from '../../features/chatSlice.js'
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { setTexts } from '../../features/chatSlice.js'
import getSocket from "../../socket"
import ProfilePicture from '../ProfilePicture.jsx'
import "../../styles/contact.css"

function Contact({chat, _id }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const texts = useSelector(store => store.chat.texts[chat.chat])
  const activeChat = useSelector(store => store.chat.activeChat)
  const [socket] = useState(() => getSocket())
  
  let status = null
  let contactClass = null

  const [contactDetails, setContactDetails] = useState(() => {
    return {
      username: "",
      name: "",
      isOnline: false,
      isTyping: false,
      isSet: false,
    }
  })

  const { isOnline, isTyping } = contactDetails

  // Get all contact's details details from the server //
  useEffect(() => {
    let details = {}

    if(contactDetails.isSet) return

    // get contact's username and name//
    let response = fetch(`/user/user-details/${chat.chatRef}/username/name`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth token")}`
      }
    })

    let data = response.then((res) => {
      if (!res.status === 200) {
        return false
      }

      return res.json()
    })

    if (data) {
      data.then((info) => {
        details = {...info.userDetails}
      })
    }

    // get texts from chat //
    response = fetch(`/messages/read-chat/${chat.chat}`, {
        headers: {
            authorization: `Bearer ${localStorage.getItem("auth token")}`
        }
    })

    data = response.then((res) => {
      if (res.status !== 200) {
        return false
      }

      return res.json()
    })

    if (data) {
      data.then(info => {
        // set contact details after grabbing all the info //
        dispatch(setTexts({
          chatId: chat.chat,
          texts: info.texts
        }))

        setContactDetails(state => {
          return {
            ...state,
            ...details,
            isSet: true,
          }
        })
      })
    }
  }, [_id, chat, contactDetails, dispatch])

  // set up socket events for contact //
  useEffect(() => {    
    socket.on("online", (payload) => {
      if (payload.room === chat.chat) {
        setContactDetails((state) => {
          return {
            ...state,
            isOnline: payload.value,
          }
        })
      }
    })

    socket.on("message", (incomingMessage) => {
      if (incomingMessage.chat === chat.chat) {
        dispatch(addText(incomingMessage))
      }
    })
    
    socket.on("isTyping", (payload) => {
      if (payload.room === chat.chat) {
        setContactDetails((state) => {
          return {
            ...state,
            isTyping: payload.value,
          }
        })
      }
    })

    socket.on("delete-text", (payload) => {
      if (payload.chat === chat.chat) {
        dispatch(removeText(payload))
      }
    })
  }, [_id, chat, dispatch, socket])

  // update chat whenever there's a change in text //
  useEffect(() => {
    dispatch(setTexts({
      chatId: chat.chat,
      texts,
    }))
  },[texts, dispatch, chat])
      
  if (activeChat) {
    contactClass = activeChat._id === _id ? "contact active" : "contact"
  }

  if (isTyping) {
    status = "Typing..."
  }

  const openChat = () => {
    navigate("/chat", {
      state: {
        chat,
        name: contactDetails.name,
        username: contactDetails.username,
      }
    })
  }

  return (
    <div className={contactClass ? contactClass : "contact"} onClick={openChat}>
      <ProfilePicture id={chat.chatRef} isUser={false} isOnline={isOnline} />
      <div id="contact-info">
        <span className='contact-title' title={`${contactDetails.name} @${contactDetails.username}`}>{contactDetails.name}  </span>
        <span className='contact-username'>{contactDetails.username && `@${contactDetails.username}`}</span>
        <div className='contact-status'>{status ? status : texts && texts.length > 0 && texts[texts.length - 1].content}</div>
      </div>
    </div>
  )
}

export default Contact