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
            options: !menus.options,
        })
    }

    return (

        <>
            <MenuIcons openOptions={openOptions} />
            <MenuOptions active={menus.options} openOptions={openOptions} />
        </>
    )
}

export default Menu