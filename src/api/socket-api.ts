import {io, Socket} from "socket.io-client";

class SocketApi {
    static socket: null | Socket

    static createConnection() {
        this.socket = io("http://localhost:80/")

        this.socket.on('connect', () => {
            console.log("Connect")
        })

        this.socket.on('joinedRoom', (data) => {
            console.log(`joined to room with id: ${data}`)
        })

        this.socket.on('leftRoom', (data) => {
            console.log(`left room with id: ${data}`)
        })
    }
}

export default SocketApi;