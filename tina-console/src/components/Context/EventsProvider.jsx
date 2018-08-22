import React from 'react'


const EventsContext = React.createContext()


class EventsProvider extends React.Component {
    constructor() {
        super()
        //this.props.socket.on

    
    this.state = {
        events : []

    }
    
    
    }

    compo

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
        this.props.websocket.on('allevent', this.gotEvents)
        console.log(this.props)
        return (
            <EventsContext.Provider value = {{
                Events : this.state.Events,
                update: this.update,
                


            }}
            >
            {this.props.children}

            </EventsContext.Provider>
           
        )
    }
}

export default EventsProvider