import { useSelector } from 'react-redux'
import "../styles/chat-area.css"

function ChatArea() {
    const chat = useSelector(store => store.chat)
    
    return (
        <div id='chat' >
            {
                chat.activeChat.texts.map(text => {
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