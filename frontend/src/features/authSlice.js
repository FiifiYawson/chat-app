import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    error: {
        value: false,
        text: "",
    }
}

export const login = createAsyncThunk("login", async(payload) => {
    const res = await fetch(`/user/${payload.status}`, {
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
    reducers: {
        resetError: (state) => {
            state.error = {
                value: false,
                text: ""
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            if (action.payload.isSuccess) {
                state.isLoggedIn = action.payload.isSuccess
                state.chats = action.payload.chatIds
                state.userId = action.payload.userId
                state.email_or_number = action.payload.email_or_number
                state.name = action.payload.name
            } else {
                state.error = {
                    value: true,
                    text: action.payload.message
                }
            }
        })
    }
})

export default authSlice.reducer
export const authActions = authSlice.actions