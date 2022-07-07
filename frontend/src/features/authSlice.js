import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {}

export const login = createAsyncThunk("login", async(payload) => {
    const res = await fetch(`http://localhost:5000/user/${payload.status}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(payload.inputs)
    })

    let data = await res.json()

    data = {
        ...data,
        email_or_number: payload.email_or_number,
        name: payload.name,
    }

    if (data.isSuccess) {
        localStorage.setItem("auth token", data.token)
        localStorage.setItem("email_or_number", payload.inputs.email_or_number)
        localStorage.setItem("id", data.userId)
        payload.navigate("/")
    }

    return data
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            if (action.payload.isSuccess) {
                state.isLoggedIn = action.payload.isSuccess
                state.chats = action.payload.chatIds
                state.userId = action.payload.userId
                state.email_or_number = action.payload.email_or_number
                state.name = action.payload.name
            }
        })
    }
})

export default authSlice.reducer
export const authActions = authSlice.actions