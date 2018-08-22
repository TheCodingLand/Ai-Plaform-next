
import io from 'socket.io-client'





const websocket = () => {
    
    
    const gethost = () => {
      //let host = window.location.host
      return 'tina.ctg.lu'
    }
    
    let SOCKET_URL = `http://ws.${gethost()}`
    let socket = io.connect(SOCKET_URL)
    

    
    return socket

}






export default websocket    


      


