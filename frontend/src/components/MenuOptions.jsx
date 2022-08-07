import {useNavigate} from 'react-router-dom'

function MenuOptions() {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        navigate("/login")
    }

    return (
        <div id='options'>
            <div className="option" onClick={logout}>LOG OUT</div>   
        </div>
    )
}

export default MenuOptions  