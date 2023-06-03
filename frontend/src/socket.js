import { io } from "socket.io-client"

let socket

export function connectSocket() {
    return socket = io.connect()
}

function getSocket() {
    return socket
}

export default socket = getSocket