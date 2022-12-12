import React, { useSelector } from "react-redux"
import ChatArea from "./ChatArea.jsx"
import TextInput from "./TextInput.jsx"
import "../../styles/chat-display.css"

function Chat() {
    const chat = useSelector(store => store.chat)
        
    return (
        <div id="chat-display">
            <div className="space"></div>
            <ChatArea/>
            <TextInput chatId={chat.activeChat._id}/>
        </div>
    )
}

export default Chat