import {useSelector} from "react-redux"
import Contact from "./Contact.jsx"
import CreateContact from './CreateContact.jsx'

function Contacts() {
    const chat = useSelector(store => store.chat)

    const openCreateContact = (e) => {
        const createContact = document.getElementById("create-contact")
        const plus = document.getElementById("hamburger")

        createContact.classList.toggle("active")
        plus.classList.toggle("active")

    }        

    return (
        <div id="contacts-container">
            <div id="menu">
                <svg id="hamburger" className="menu-icon" onClick={openCreateContact} width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path id="Line 7" d="M0 17H35" stroke="black" strokeWidth="6"/>
                    <path id="Line 8" d="M17.5 35V17.5L17.5 -9.53674e-07" stroke="black" strokeWidth="6"/>
                </svg>
            </div>
            <CreateContact/>
            <div id="contacts">
                {
                    chat.chats.map(chatObject => {
                        return (
                            <Contact chat={chatObject} activeChat={chat.activeChat} key={chatObject._id} _id={chatObject._id} user={chatObject.users.find(user => user.email_or_number !== localStorage.getItem("email_or_number"))} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Contacts