import { useSelector } from 'react-redux'
import {useRef, useEffect} from "react"
import "../../styles/chat-area.css"

function ChatArea() {
    const chat = useSelector(store => store.chat.activeChat)

    const chatRef = useRef()

    useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight
    },[chat])
    
    return (
        <div ref={chatRef} id='chat' >
            {
                chat.texts.map(text => {
                    return (
                        <div key={text.time} className="text-container">
                            <div className={text.sender === localStorage.getItem("id") ? "sender-text text" : "receiver-text text"}>{text.text}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ChatArea