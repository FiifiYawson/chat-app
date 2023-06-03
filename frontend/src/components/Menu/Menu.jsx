import MenuOptions from "./MenuOptions.jsx"
import MenuIcons from "./MenuIcons.jsx"
import {useState} from "react"

function Menu() {
    const [menus, setMenus] = useState({
        options: false
    })

    const openOptions = (e) => {
        setMenus({
            ...menus,
            options: true,
        })

        const closeMenu = (e) => {      
            if(e.target.id === "options" || e.target.classList.contains("option") ) return
            setMenus({
                ...menus,
                options: false,
            })

            window.removeEventListener("mousedown", closeMenu)
        }

        window.addEventListener("mousedown", closeMenu)
    }

    return (
        <>
            <MenuIcons openOptions={openOptions} />
            <MenuOptions active={menus.options} menu={setMenus} />
        </>
    )
}

export default Menu