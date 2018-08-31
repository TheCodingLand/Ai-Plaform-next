import React from 'react'
import io from 'socket.io-client'

export const SocketContext = React.createContext()


export class SocketProvider extends React.Component {
    constructor() {
        super()
        this.state = {
            socket: this.websocket()
        }
    }

    websocket = () => {

        const gethost = () => {
            //let host = window.location.host
            return 'tina.ctg.lu'

        }
        let SOCKET_URL = `http://ws.${gethost()}`
        //SOCKET_URL = 'http://localhost:3000' //TEMPORARY, DEBUG
        let socket = io.connect(SOCKET_URL)

        return socket
    }



    render() {
        return (
            <SocketContext.Provider value={{
                socket: this.state.socket
            }}
            >
                {this.props.children}
            </SocketContext.Provider>
        )
    }
}
