import { useDispatch } from "react-redux"
import { reset } from "../../features/chatSlice" 
import "../../styles/menu-options.css"

function MenuOptions({active, openOptions}) {
    const dispatch = useDispatch()

    const logout = () => {
        localStorage.removeItem("auth token")
        dispatch(reset())
    }

    return (
        <div id='options' className={`${active ? "active" : ""}`}>
            <div className="option" onClick={logout}>LOG OUT</div>
            <div className="option" onClick={openOptions}>CLOSE MENU</div>
        </div>
    )
}

export default MenuOptions 