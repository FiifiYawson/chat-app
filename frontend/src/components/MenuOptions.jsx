import { useNavigate } from 'react-router-dom'
import "../styles/menu-options.css"

function MenuOptions() {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("auth token")
        navigate("/login")
    }

    return (
        <div id='options'>
            <div className="option" onClick={logout}>LOG OUT</div>   
        </div>
    )
}

export default MenuOptions 