import {io, Socket} from "socket.io-client";

class SocketApi {
    static socket: null | Socket

    static createConnection() {
        this.socket = io("http://localhost:5000/")

        this.socket.on('connect', () => {
            console.log("Connect")
        })

        this.socket.on('joinedRoom', (data) => {
            console.log(data)
        })
    }
}

export default SocketApi;