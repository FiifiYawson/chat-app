import {useState, useContext, useRef, useEffect} from 'react'
import { sendMessage, addText } from "../../features/chatSlice.js"
import { useDispatch} from "react-redux"
import { socketContext } from "../../pages/Main.jsx"
import { GrSend } from "react-icons/gr"
import "../../styles/input-area.css"


function TextInput({chatId}) {
    const chatElem = document.getElementById("chat")

    const dispatch = useDispatch()
    
    const socket = useContext(socketContext)
    
    const textarea = useRef()

    useEffect(() => {
        if (chatElem) {
            chatElem.scrollTop = chatElem.scrollHeight
        }
    },[chatElem])

    const [input, setInput] = useState("")
    
    const [isTyping, setIsTyping] = useState(false)

    const emitMessage = () => {
        const payload = {
            room: chatId,
            text: {
                sender: localStorage.getItem("id"),
                text: input,
                time: Date.now()
            }
        }

        socket.emit("message", payload)

        dispatch(addText(payload))
    }

    const sendMessageFn = () => {
        if (input !== "") {
            dispatch(sendMessage({
                receiverId: chatId,
                text: {
                    sender: localStorage.getItem("id"),
                    text: input,
                    time: Date.now()
                }
            }))
    
            emitMessage()
    
            setInput("")
    
            textarea.current.focus()
    
            socket.emit("isTyping", {
                room: chatId, user: localStorage.getItem("id"),
                value: false
            })    
        }
    }
    
    const onChange = (e) => {
        setInput(e.target.value)

        if (e.target.value.length > 0 && !isTyping) {
            setIsTyping(true)

            socket.emit("isTyping", {room: chatId,  user: localStorage.getItem("id"), value: true})
        }

        if (e.target.value.length === 0 && isTyping) {
            setIsTyping(false)

            socket.emit("isTyping", {room: chatId, user: localStorage.getItem("id"), value: false})
        }
    }

    return (
        <div id='text-input'>
            <textarea ref={textarea} wrap='soft' cols="5" value={input} autoFocus onChange={onChange} placeholder='write something...' />
            <button onClick={sendMessageFn}><GrSend id='send'/></button>
        </div>
    )
}

export default TextInput