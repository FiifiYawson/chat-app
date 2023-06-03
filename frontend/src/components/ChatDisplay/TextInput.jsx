import {useState, useRef} from 'react'
import { sendMessage } from "../../features/chatSlice.js"
import { useDispatch} from "react-redux"
import { FaRegPaperPlane } from "react-icons/fa"
import "../../styles/input-area.css"
import getSocket from "../../socket"


function TextInput({chatId}) {
    const dispatch = useDispatch()
    const textarea = useRef()

    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [socket] = useState(() => getSocket())

    const sendMessageFn = () => {
        if (input.trim() !== "") {
            dispatch(sendMessage({
                chat: chatId,
                sender: localStorage.getItem("id"),
                content: input,
                socket,
            }))
        
            setInput("")
    
            textarea.current.focus()
            textarea.current.style.height = "50px"
    
            socket.emit("isTyping", {
                room: chatId,
                user: localStorage.getItem("id"),
                value: false
            })
        }
    }
    
    const onChange = (e) => {
        e.target.style.height = "auto"
        e.target.style.height = `${textarea.current.scrollHeight}px`
        if(e.target.value === "") textarea.current.style.height = "50px"

        if (e.target.value.length > 0 && !isTyping) {
            setIsTyping(true)

            socket.emit("isTyping", {
                room: chatId,
                user: localStorage.getItem("id"),
                value: true
            })
        }

        if (e.target.value.length === 0 && isTyping) {
            setIsTyping(false)

            socket.emit("isTyping", {
                room: chatId,
                user: localStorage.getItem("id"),
                value: false
            })
        }

        setInput(e.target.value)
    }

    return (
        <div id='text-input'>
            <textarea id='text-area' ref={textarea} wrap='soft' autoFocus onChange={onChange} value={input} placeholder='write something...' />
            <button id="send-btn" onClick={sendMessageFn}><FaRegPaperPlane id='send'/></button>
        </div>
    )
}

export default TextInput