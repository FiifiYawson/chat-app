import { useState } from 'react'
import SearchContact from "./SearchContact.jsx"
import "../../styles/home.css"
import { ImSearch } from "react-icons/im"

function Home() {
    const [searchInput, setSearchInput] = useState("")

    const [searchResults, setSearchResults] = useState([])

    const searchUser = async (query) => {
        const res = await fetch(`user/search/${query || searchInput}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem("auth token")}`
            }
        })

        const data = await res.json()

        setSearchResults(data.searchUsers)
    }

    const onChange = (e) => {
        setSearchInput(e.target.value)

        if (e.target.value === "") {
            setSearchResults([])
            return
        }

        searchUser(e.target.value)
    }

    return (
        <div id='home' className='display'>
            <div id='contact-search'>
                <input id='search-input' onChange={onChange} value={searchInput} type="text" name="contact" placeholder="Search for contacts" />
                <button id='search-button' onClick={searchUser}><ImSearch/></button>
            </div>
            <div id='search-results'>
                {searchResults.map(user => <SearchContact key={user._id} contact={user} />)}
            </div>
        </div>  
    )
}

export default Home