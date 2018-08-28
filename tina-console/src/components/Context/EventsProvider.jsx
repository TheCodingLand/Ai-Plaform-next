import React, {Fragment } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import {saveState, loadState} from 'components/LocalStorage/LocalStorage'

export const EventsContext = React.createContext()


class EventsProvider extends React.Component {
    constructor() {
        super()
    let loadedstate = loadState('events')
    this.state = {
        events : [],
        action : this.action,
        subscribe : this.subscribe,
        open: false,
        newevent: { text:""}
    }
    this.state = Object.assign({}, this.state, loadedstate)
    //this.state = {...this.state, loadedstate}
    
    }

    
    subscribe = (event, cb) => {
        console.log(event)
        this.props.websocket.on(event, (obj) => { 
            let o = JSON.parse(obj)
            console.log (o)
            o.text=o.action + " " + o.state
            /* if (o.result) {
            o.result = JSON.parse(o.result)
            }
            if (o.model) {
                o.model = o.model
                }
            if (o.dataset) {
                o.dataset = JSON.parse(o.dataset)
                } */
            console.log(o.text)
            let events = this.state.events
            
            events.push(o)
            
            
            this.setState({events:events, newevent:o})
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
    //this.setState({events:events})
    }
    

    gotEvents = (events) => {
        console.log(events)
        let o = JSON.parse(events)
        //this.setState({events:o})
        }
    handleClose = () => {
            this.setState({ open: false,newevent : {text:""} });
            
          };
  
    trigger_update = () => {
            //this.setState({loading:true})
            console.log('getting all events')
            this.state.socket.emit('allevents')
      }

    render () {
        //let newstate = loadState('events')
        //if (newstate !== this.state) { 
        //this.setState(newstate)}
        if (this.state.events.length >0) {
        saveState(this.state, 'events')
        }
        this.props.websocket.on('event', this.gotEvent)
        this.props.websocket.on('allevents', this.gotEvents)
        console.log(this.props)
        return (
            
            <EventsContext.Provider value={this.state}>
            <Fragment>
            <Snackbar
          anchorOrigin={{ vertical:'top', horizontal:'right' }}
          open={this.state.newevent.text !==""}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.newevent.text}</span>}
        />
            {this.props.children}
            </Fragment>
            </EventsContext.Provider>
            
        )
    }
}

export default EventsProvider