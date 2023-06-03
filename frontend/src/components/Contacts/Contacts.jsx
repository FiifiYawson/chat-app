import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Contact from "./Contact.jsx"
import Loader from "../Loader"
import "../../styles/contacts.css"

function Contacts() {
    const chat = useSelector((store) => store.chat)

    return (
        <div id="contacts">
            <div id="contacts-background"></div>
            {chat.loading && <Loader />}
            {
                chat.chats.map(chatObject => {
                    return (
                        <Contact chat={chatObject} key={chatObject._id} _id={chatObject._id} user={chatObject.user} />
                    )
                })
            }
            {
                chat.chats.length === 0 && 
                    <div id="no-contacts-display">
                        <h1>No Contacts to display</h1>
                        <Link to="/profile">
                            <small>search for contacts</small>
                        </Link>
                    </div>
            }
        </div>
    )
}

export default Contacts