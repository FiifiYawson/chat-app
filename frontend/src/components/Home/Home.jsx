import { useState, useRef } from 'react'
import SearchContact from "./SearchContact.jsx"
import Menu from '../Menu/Menu.jsx'
import "../../styles/home.css"
import { ImSearch } from "react-icons/im"
import {ThreeCircles, Grid} from "react-loader-spinner"

function Home() {
    const [searchInput, setSearchInput] = useState("")

    const [searchResults, setSearchResults] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const abort = useRef()

    const searchUser = async (query) => {
        if(query.trim() === "") return
        try {
            setIsLoading(true)
            const request = await fetch(`user/search/${query || searchInput}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("auth token")}`
                },
                signal: abort.current ? abort.current.signal : undefined
            })

            if (request.status !== 200) {
                return console.log(request)
            }

            const data = await request.json()

            setSearchResults(data.searchResults)
            setIsLoading(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    const onChange = (e) => {
        setSearchInput(e.target.value)

        if (abort.current) {
            abort.current.abort()
            setIsLoading(false)
        }
            
        abort.current = new AbortController()

        if (e.target.value === "") {
            setSearchResults([])
            return
        }

        searchUser(e.target.value)
    }

    return (
        <div id='home' className='display'>
            <Menu/>
            <div id='contact-search'>
                <input id='search-input' onChange={onChange} value={searchInput} type="text" name="contact" placeholder="Search for contacts" />
                <button id='search-button' onClick={searchUser}>{isLoading ? <ThreeCircles className="loader" color="white" width="20" height="20"/> : <ImSearch />}</button>
            </div>
            <div id='search-results'>
                {isLoading && <Grid color="#CCCCCC"/>}
                {searchResults && searchResults.map(user => <SearchContact key={user._id} contact={user} />)}
            </div>
        </div>  
    )
}

export default Home