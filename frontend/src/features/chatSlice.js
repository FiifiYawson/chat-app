import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    chats: [],
    activeChat: null,
}

export const createChat = createAsyncThunk("api/create", async(payload) => {
    const res = await fetch(`/messages/${payload.receiverId}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("auth token")}`
        },
    })

    const data = await res.json()

    if (data.isSuccess) {
        payload.socket.emit("createChat", {
            receiver: payload.receiverId,
            chat: data.chat,
            room: data.chat._id,
        })
    }

    return data
})

export const sendMessage = createAsyncThunk("api/send", async(payload) => {
    const res = await fetch(`/messages/send/${payload.receiverId}`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${localStorage.getItem("auth token")}`,
            "Content-type": "application/json"
        },
        body: JSON.stringify(payload.text)
    })

    const data = await res.json()

    return data
})

export const getAllChats = createAsyncThunk("api/getAll", async(socket) => {
    const res = await fetch(`/messages`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${localStorage.getItem("auth token")}`
        }
    })

    const data = await res.json()

    if (data.isSuccess) {
        const userChats = data.chats.map(chat => chat._id)

        localStorage.setItem("chats", JSON.stringify(userChats))
    }

    return data
})

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveChat: (state, action) => {
            state.activeChat = state.chats.find(chat => chat._id === action.payload)
        },
        addText: (state, action) => {
            state.chats.find((chat => chat._id === action.payload.room)).texts.push(action.payload.text)

            const active = state.activeChat && state.activeChat._id === action.payload.room

            if (active) {
                state.activeChat.texts.push(action.payload.text)
            }
        },
        addChat: (state, action) => {
            state.chats.push(action.payload)
        },
        isTyping: (state, action) => {
            state.chats.find(chat => chat._id === action.payload.room).isTyping = action.payload.value
        },
        online: (state, action) => {
            const valid = state.chats.find(chat => chat._id === action.payload.room)

            if (valid) valid.isOnline = action.payload.value
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllChats.fulfilled, (state, action) => {
                if (action.payload.isSuccess)
                    state.chats = action.payload.chats
            })
            .addCase(createChat.fulfilled, (state, action) => {
                action.payload.isSuccess &&
                    state.chats.push(action.payload.chat)
            })
    }
})

export default chatSlice.reducer
export const { setActiveChat, addText, addChat, isTyping, online } = chatSlice.actions