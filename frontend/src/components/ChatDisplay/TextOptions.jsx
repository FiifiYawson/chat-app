import { useState } from "react"
import { FaEllipsisV } from "react-icons/fa"
import { useDispatch } from "react-redux"
import "../../styles/text-options.css"
import {deleteText} from "../../features/chatSlice"

function TextOptions({text}) {
    const [active, setActive] = useState(false)

    const dispatch = useDispatch()

    const openOptions = () => {

        const closeOption = (e) => {
            if (
                e.target.classList.contains("text-options") ||
                e.target.classList.contains("text-option-icon")
            ) return
            
            setActive(false)

            window.removeEventListener("mouseup", closeOption)
        }

        window.addEventListener("mouseup", closeOption)

        setActive(!active)
    }

    return (
        <>
            <FaEllipsisV onClick={openOptions} className='text-option-icon' />
            <div className={active ? "text-options active" : "text-options"}>
                <div onClick={() => dispatch(deleteText({text}))} className="text-option">Delete</div>
            </div>
        </>
    )
}

export default TextOptions