import {useSelector} from "react-redux"
import Contact from "./Contact.jsx"
import Loader from "./Loader"
import "../styles/contacts.css"

function Contacts() {
    const chat = useSelector((store) => store.chat)

    return (
        <div id="contacts">
            {
                chat.loading && <Loader/>
            }
            {
                chat.chats.map(chatObject => {
                    return (
                        <Contact chat={chatObject} activeChat={chat.activeChat} key={chatObject._id} _id={chatObject._id} user={chatObject.users.find(user => user.email_or_number !== localStorage.getItem("email_or_number"))} />
                    )
                })
            }
        </div>
    )
}

export default Contacts