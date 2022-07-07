import { useSelector } from "react-redux"
import TextInput from "./TextInput.jsx"
 
function Chat() {
    const chat = useSelector((store) => store.chat)

    return (
        <>
            <div id='chat' >
                { 
                    chat.activeChat ?
                        chat.activeChat.texts.map(text => {
                            return (
                                <div key={text.time} className="text-container">
                                    <div className={text.sender === localStorage.getItem("id")? "sender-text text" : "receiver-text text" }>{text.text}</div>
                                </div>
                            )
                        })
                        : 
                        <div>
                            Choose a contact
                        </div>
                }
            </div>
                {
                    
                    chat.activeChat && <TextInput chatId={chat.activeChat._id} receiver={chat.activeChat.users.find(user => user.email_or_number!== localStorage.getItem("email_or_number"))} />
                }
        </>
    )
}

export default Chat