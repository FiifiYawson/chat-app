import { useState, useContext } from 'react'
import { createChat } from "../features/chatSlice.js"
import { useDispatch } from "react-redux"
import { socketContext} from "../pages/Main.jsx"

function CreateContact() {
    const [input, setInput] = useState("")

    const socket = useContext(socketContext)

    const dispatch = useDispatch()

    const onChane = (e) => {
        setInput(e.target.value)
    }

    const createContactFn = () => {
        dispatch(createChat({
            receiverId: input,
            socket,
        }))

        setInput("")
    }

    return (
        <div id='create-contact'>
            <input onChange={onChane} value={input} type="text" name="contact" placeholder="Input user's email / number" />
            <button onClick={createContactFn}>ADD</button>
        </div>
    )
}

export default CreateContact