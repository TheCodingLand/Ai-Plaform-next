import React from 'react'
import io from 'socket.io-client'
import {API_ROOT, HTTPS} from "appConfig"
export const SocketContext = React.createContext()


export class SocketProvider extends React.Component {
    constructor() {
        super()
        this.state = {
            socket: this.websocket(),
  
        }
    }

    websocket = () => {

        const gethost = () => {
            let host = API_ROOT
            return host

        }
        let SOCKET_URL = `${HTTPS}://ws.${API_ROOT}`
        //SOCKET_URL = 'http://localhost:3000' //TEMPORARY, DEBUG
        let socket = io.connect(SOCKET_URL)
        
        
        return socket
    
    }



    render() {
        return (
            <SocketContext.Provider value={{ socket: this.state.socket, id:this.state.id }}>
                {this.props.children}
            </SocketContext.Provider>
        )
    }
}
