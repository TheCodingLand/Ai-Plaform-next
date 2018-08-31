import React, { Fragment } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import { saveState, loadState } from 'components/LocalStorage/LocalStorage'

export const EventsContext = React.createContext()


class EventsProvider extends React.Component {
    constructor() {
        super()
        let loadedstate = loadState('events')
        this.state = {
            removeNotificationByKey: this.removeNotificationByKey.bind(this),
            notifications: [],
            results: [],
            events: [],
            action: this.action,
            subscribe: this.subscribe,
            open: false,
            newevent: { text: "" },
            socket: false
        }
        this.state = Object.assign({}, this.state, loadedstate)
        //this.state = {...this.state, loadedstate}

    }
    componentWillMount() {
        this.setState({ socket: this.props.websocket })
    }
    removeNotificationByKey = (key) => {
        let notifications = []
        this.state.notifications.forEach(notif => {
            if (notif.key !== key) {
                notifications.push(key)
            }
        }

        )
        this.setState({ notifications: notifications })

    }
    subscribe = (event, cb) => {
        //console.log(event)
        this.props.websocket.on(event, (obj) => {
            console.log(obj)

            //console.log(o)
            let o = JSON.parse(obj.data)

            console.log(o)
            o.text = o.action + " " + o.state
            let notifications = this.state.notifications
            let results = this.state.results

            /* if (o.model) {
                o.model = JSON.parse(o.model)
            }
            if (o.dataset) {
                o.dataset = JSON.parse(o.dataset)
            } */

            if (o.result) {
                let notifications = this.state.notifications
                let results = this.state.results

                //o.result = JSON.parse(o.result)
                results.push(o)
                notifications.push(o)
            }

            //console.log(o.text)
            let events = this.state.events

            events.push(o)
            this.setState({ results: results, events: events, newevent: o, notifications: notifications })
            cb(o)
        })

    }

    //Actions:
    action = (action, obj) => {
        //this.setState({loading:true})
        //console.log('getting all events')
        this.props.websocket.emit(action, obj)

    }


    gotEvent = (event) => {
        //console.log(event)
        let o = JSON.parse(event)
        let events = this.state.events.push(o)
        //this.setState({events:events})
    }


    gotEvents = (events) => {
        //console.log(events)
        let o = JSON.parse(events)
        //this.setState({events:o})
    }
    handleClose = () => {
        this.setState({ open: false, newevent: { text: "" } });

    };

    trigger_update = () => {
        //this.setState({loading:true})
        //console.log('getting all events')
        this.state.socket.emit('allevents')
    }

    render() {
        //let newstate = loadState('events')
        //if (newstate !== this.state) { 
        //this.setState(newstate)}
        if (this.state.events.length > 0) {
            saveState(this.state, 'events')
        }

        this.props.websocket.on('event', this.gotEvent)
        this.props.websocket.on('allevents', this.gotEvents)
        //console.log(this.props)
        return (

            <EventsContext.Provider value={this.state}>
                <Fragment>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={this.state.newevent.text !== ""}
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