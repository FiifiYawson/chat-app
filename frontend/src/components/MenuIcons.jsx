import { useState } from 'react'
import "../styles/menu-icons.css"

function MenuIcons() {
    const [menuOptions, setMenuOptions] = useState(false)

    const openCreateContact = (e) => {
        const createContact = document.getElementById("create-contact")
        const plus = document.getElementById("plus")
        const options = document.getElementById("options")

        options.classList.remove("active")
        
        setMenuOptions(false)

        if (!menuOptions) {
            createContact.classList.toggle("active") 
            plus.classList.toggle("active")
        }
    }        

    const openOptions = (e) => {
        const options = document.getElementById("options")
        const plus = document.getElementById("plus")

        setMenuOptions(true)

        plus.classList.toggle("active")
        options.classList.toggle("active")

        const event = (e) => {
            plus.classList.remove("active")
            options.classList.remove("active")

            plus.removeEventListener("click", event)
        }

        plus.addEventListener("click", event)
    }

    return (
            <div id="menu">
                <svg id="plus" className="menu-icon" onClick={openCreateContact} width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path id="Line 7" d="M0 17H35" stroke="black" strokeWidth="6"/>
                    <path id="Line 8" d="M17.5 35V17.5L17.5 -9.53674e-07" stroke="black" strokeWidth="6"/>
                </svg>
                <svg id="hamburger" className="menu-icon" onClick={openOptions} width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect id="Rectangle3" width="35" height="5.41237" fill="black"/>
                    <rect id="Rectangle2" y="29.5876" width="35" height="5.41237" fill="black"/>
                    <rect id="rectangle1" y="14.7938" width="35" height="5.41237" fill="black"/>
                </svg>
            </div>
    )
}

export default MenuIcons