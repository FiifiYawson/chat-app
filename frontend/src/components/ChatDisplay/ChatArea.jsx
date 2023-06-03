import { useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import TextOptions from './TextOptions'
import "../../styles/chat-area.css"

function ChatArea({chat}) {    
    const chatRef = useRef()

    const texts = useSelector(store => store.chat.texts[chat.chat])

    useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight
    }, [texts])

    
    return (
        <div ref={chatRef} id='chat' >
            {texts && texts.map(text => 
                <div key={text._id} className="text-container">
                    <div tabIndex={-1} className={text.sender === localStorage.getItem("id") ? "sender-text text" : "receiver-text text"}>
                        {text.sender === localStorage.getItem("id") && <TextOptions text={text} />}
                        {text.content}
                        <p className='text-date'>{ new Date(text.createdAt).toLocaleString() }</p>
                    </div>
                </div>
            )}
            {texts && texts.length === 0 &&
                <div id="no-text-display">
                    <h1>No texts for this contact</h1>
                    <small>start a conversation</small>
                </div>
            }
        </div>
    )
}

export default ChatArea