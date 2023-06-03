import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { reset as chatReset} from "../../features/chatSlice" 
import { reset as authReset } from "../../features/authSlice"
import "../../styles/menu-options.css"

function MenuOptions({active, menu}) {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        dispatch(chatReset())
        dispatch(authReset())
        navigate("/login")
    }

    const closeMenu = () => {
        menu(state => {
            return {
                ...state,
                options: false,
            }
        })
    }

    return (
        <div id='options' className={`${active ? "active" : ""}`}>
            <div className="option" onClick={logout}>LOG OUT</div>
            <div className="option" onClick={closeMenu}>CLOSE MENU</div>
        </div>
    )
}

export default MenuOptions 