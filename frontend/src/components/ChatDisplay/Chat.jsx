import { useLocation, Navigate} from "react-router-dom"
import ChatArea from "./ChatArea.jsx"
import TextInput from "./TextInput.jsx"
import { useDispatch } from "react-redux"
import {useEffect} from "react"
import { setActiveChat } from "../../features/chatSlice"
import Menu from "../Menu/Menu"
import "../../styles/chat-display.css"

function Chat() {
    const { pathname, state } = useLocation()

    const dispatch = useDispatch()
    
    useEffect(() => {
        setTimeout(() => {
            dispatch(setActiveChat({ _id: state.chat._id}))
        }, 400)
    },[dispatch, state])

    if (!state) return <Navigate to="/" replace={true} />
    
    return (
        <div id="chat-display" className={pathname === "/chat" ? "active" : ""}>
            <Menu />
            <div id="chat-head"><h1>{state.name}</h1><small>{` @${state.username}`}</small></div>
            <div className="space"></div>
            <ChatArea chat={state.chat} />
            <TextInput chatId={state.chat.chat}/>
        </div>
    )
}

export default Chat