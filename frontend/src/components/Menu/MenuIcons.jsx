import "../../styles/menu-icons.css"
import { GrHomeRounded } from "react-icons/gr"
import { useDispatch } from "react-redux"
import { setActiveChat} from "../../features/chatSlice"

function MenuIcons({ openOptions }) {
    const dispatch = useDispatch()

    const goHome = () => {
        dispatch(setActiveChat(null))
    }

    return (
            <div id="menu">
            <svg id="hamburger" className="menu-icon" onClick={openOptions} width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect id="Rectangle3" width="35" height="5.41237" fill="black"/>
                <rect id="Rectangle2" y="29.5876" width="35" height="5.41237" fill="black"/>
                <rect id="rectangle1" y="14.7938" width="35" height="5.41237" fill="black"/>
            </svg>
            <GrHomeRounded onClick={goHome} className="menu-icon"/>
            </div>
    )
}

export default MenuIcons