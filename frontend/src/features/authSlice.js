import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    error: {
        value: false,
        text: "",
    },
    loading: false,
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
        localStorage.setItem("chats", JSON.stringify(data.chatIds))
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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
            })
            .addCase(login.fulfilled, (state, action) => {
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
                state.loading = false
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = {
                    value: true,
                    text: "couldn't connect to server"
                }
            })
    }
})

export default authSlice.reducer
export const authActions = authSlice.actions