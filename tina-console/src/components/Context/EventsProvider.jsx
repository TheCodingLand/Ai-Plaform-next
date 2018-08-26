import React from 'react'


export const EventsContext = React.createContext()


class EventsProvider extends React.Component {
    constructor() {
        super()
    
    this.state = {
        events : [],
        action : this.action,
        subscribe : this.subscribe
    }
    
    
    }
    subscribe = (event, cb) => {
        this.props.websocket.on(event, (obj) => { console.log(obj)
             cb(obj)})
       
    }

    //Actions:
    action = (action, obj) => {
        //this.setState({loading:true})
        console.log('getting all events')
        this.props.websocket.emit(action,obj)
        
    }
    

    gotEvent = (event) => {
    console.log(event)
    let o = JSON.parse(event)
    let events = this.state.events.push(o)
    this.setState({events:events})
    }

    gotEvents = (events) => {
        console.log(events)
        let o = JSON.parse(events)
        this.setState({events:o})
        }

    trigger_update = () => {
            //this.setState({loading:true})
            console.log('getting all events')
            this.state.socket.emit('allevents')
      }

    render () {
        this.props.websocket.on('event', this.gotEvent)
        this.props.websocket.on('allevents', this.gotEvents)
        console.log(this.props)
        return (
            <EventsContext.Provider value={this.state}>
            {this.props.children}

            </EventsContext.Provider>
           
        )
    }
}

export default EventsProvider