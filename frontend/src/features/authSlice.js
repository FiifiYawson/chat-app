import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
    error: {
        value: false,
        text: "",
    },
    profilepic: "",
}

export const login = createAsyncThunk("login", async (payload) => {
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
        username: payload.email_or_number,
        name: payload.name,
    }

    if (data.isSuccess) {
        localStorage.setItem("auth token", data.token)
        localStorage.setItem("username", payload.inputs.username)
        localStorage.setItem("id", data.userDetails._id)
        localStorage.setItem("name", data.userDetails.name)
        payload.navigate("/")
    }

    return data
})

export const getProfilePic = createAsyncThunk("api/get-profilpic", async (payload, thunk) => {
    const res = await fetch(`/files/profilepic/${localStorage.getItem("id")}`, {
        headers: {
            authorization: `Bearer ${localStorage.getItem("auth token")}`
        }
    })

    if (res.status !== 200) return thunk.rejectWithValue(false)

    const data = await res.blob()

    return URL.createObjectURL(data)
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
        reset: (state) => {
            return state = { ...initialState }
        }
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
                    state.username = action.payload.username
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
            .addCase(getProfilePic.fulfilled, (state, action) => {
                state.profilepic = action.payload
            })
    }
})

export default authSlice.reducer
export const {
    resetError,
    reset,
} = authSlice.actions