import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import getSocket from "../socket"

const initialState = {
    chats: [],
    texts: {},
    activeChat: null,
    loading: false,
    loadingText: false,
}

export const createChat = createAsyncThunk("api/create", async (payload) => {
    const res = await fetch(`/messages/create-chat/${payload.receiverId}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("auth token")}`
        },
    })

    const data = await res.json()

    if (data.isSuccess) {
        payload.socket.emit("createChat", data.chats[0])
    }

    return data
})

export const sendMessage = createAsyncThunk("api/send", async (payload, thunk) => {
    const res = await fetch(`/messages/send`, {
        method: "POST",
        body: JSON.stringify({
            chat: payload.chat,
            content: payload.content,
            sender: payload.sender,
        }),
        headers: {
            authorization: `Bearer ${localStorage.getItem("auth token")}`,
            "Content-type": "application/json"
        },
    })

    if (res.status !== 200) return thunk.rejectWithValue(false)

    const data = await res.json()

    payload.socket.emit("message", {
        ...data.text,
    })

    return data
})

export const deleteText = createAsyncThunk("api/delete-text", async ({ text }) => {
    const res = await fetch(`/messages/delete-text/${text._id}`, {
        method: "DELETE",
        headers: {
            authorization: `Bearer ${localStorage.getItem("auth token")}`
        }
    })

    if (res.status !== 200) return

    const data = await res.json()

    const socket = getSocket()

    socket.emit("delete-text", data.text)
    return data
})

export const getAllChats = createAsyncThunk("api/getAll", async (socket) => {
    const res = await fetch(`/messages`, {
        headers: {
            authorization: `Bearer ${localStorage.getItem("auth token")}`
        }
    })

    const data = await res.json()

    if (data.isSuccess) {
        const userChats = data.chats.map(chat => chat.chat)

        socket.emit("userConnect", {
            rooms: [...userChats],
            user: localStorage.getItem("id"),
        })
    }

    return data
})

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveChat: (state, action) => {
            state.activeChat = state.chats.find(chat => chat._id === action.payload._id)
        },
        setTexts: (state, action) => {
            state.texts[action.payload.chatId] = action.payload.texts
        },
        addText: (state, action) => {
            const text = action.payload
            state.texts[text.chat].push(text)
        },
        addChat: (state, action) => {
            console.log(action.payload)
            state.chats.push(action.payload)
        },
        removeText: (state, action) => {
            const text = action.payload
            state.texts[text.chat] = state.texts[text.chat].filter(chatText => chatText._id !== text._id)
        },
        reset: (state) => {
            return state = { ...initialState }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase((getAllChats.pending), (state) => {
                state.loading = true
            })
            .addCase(getAllChats.fulfilled, (state, action) => {
                if (action.payload.isSuccess) state.chats = action.payload.chats
                state.loading = false
            })
            .addCase(getAllChats.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(createChat.fulfilled, (state, action) => {
                action.payload.isSuccess &&
                    state.chats.push(action.payload.chats[1])
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const text = action.payload.text
                state.texts[text.chat].push(text)
            })
            .addCase(deleteText.fulfilled, (state, action) => {
                const text = action.payload.text
                state.texts[text.chat] = state.texts[text.chat].filter(stateText => stateText._id !== text._id)
            })
    }
})

export default chatSlice.reducer
export const {
    setActiveChat,
    addText,
    addChat,
    removeText,
    reset,
    setTexts,
} = chatSlice.actions