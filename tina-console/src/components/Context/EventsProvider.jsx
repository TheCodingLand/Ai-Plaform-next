import React, { Fragment } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { saveState, loadState } from "components/LocalStorage/LocalStorage";

export const EventsContext = React.createContext();

class EventsProvider extends React.Component {
  constructor() {
    super();
    let loadedstate = loadState("events");
    this.state = {
      notifications: [],
      results: [],
      events: [],
      activeTasks: [],

      open: false,
      newevent: { text: "" },
      socket: false,

      removeNotificationByKey: this.removeNotificationByKey.bind(this),
      getTask: this.getTask.bind(this),
      createEvent: this.createEvent.bind(this)
    };

    this.state = Object.assign({}, this.state, loadedstate);
    //this.state = {...this.state, loadedstate}
  }
  componentWillMount() {
    this.setState({ socket: this.props.websocket });
  }
  removeNotificationByKey = key => {
    console.log("removing notification with key:" + key);

    console.log("from : ", notifications);
    let notifications = this.state.notifications.filter(
      notif => notif.key !== key
    );

    this.setState({ notifications: notifications });
  };

  makeid = () => {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

  //returns state of a task id (true or false)
  getTask = id => {
    let active = false;
    this.state.activeTasks.forEach(task => {
      if (task.id === id) {
        active = true;
      }
    });
    return active;
  };

  createEvent = (service, action, data) => {
    let id = this.makeid();
    let e = {
      id: id,
      key: `${service}.${action}.${id}`,
      service: service,
      action: action,
      data: JSON.stringify(data)
    };

    this.props.websocket.on(e, obj => {
      this.eventRecieved(obj);
    });
    let tasks = this.state.activeTasks;
    tasks.push({ id: id });
    this.setState({ tasks });

    this.props.websocket.emit("message", e);

    return id;
  };
  eventRecieved = obj => {
    console.log(obj);
  };
  subscribe = (event, cb) => {
    this.props.websocket.on(event, obj => {
      console.log(obj);

      let o = JSON.parse(obj.data);

      console.log(o);
      o.text = o.action + " " + o.state;
      let notifications = this.state.notifications;
      let results = this.state.results;
      if (o.result) {
        let notifications = this.state.notifications;
        let results = this.state.results;

        //o.result = JSON.parse(o.result)
        results.push(o);
        notifications.push(o);
      }

      //console.log(o.text)
      let events = this.state.events;

      events.push(o);
      this.setState({
        results: results,
        events: events,
        newevent: o,
        notifications: notifications
      });
      cb(o);
    });
  };

  //Actions:
  action = (action, obj) => {
    //this.setState({loading:true})
    //console.log('getting all events')
    this.props.websocket.emit(action, obj);
  };

  gotEvent = event => {
    //console.log(event)
    let o = JSON.parse(event);
    let events = this.state.events.push(o);
    //this.setState({events:events})
  };

  gotEvents = events => {
    //console.log(events)
    let o = JSON.parse(events);
    //this.setState({events:o})
  };
  handleClose = () => {
    this.setState({ open: false, newevent: { text: "" } });
  };

  trigger_update = () => {
    //this.setState({loading:true})
    //console.log('getting all events')
    this.state.socket.emit("allevents");
  };

  render() {
    //let newstate = loadState('events')
    //if (newstate !== this.state) {
    //this.setState(newstate)}
    if (this.state.events.length > 0) {
      saveState(this.state, "events");
    }

    this.props.websocket.on("event", this.gotEvent);
    this.props.websocket.on("allevents", this.gotEvents);
    //console.log(this.props)
    return (
      <EventsContext.Provider value={this.state}>
        <Fragment>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={this.state.newevent.text !== ""}
            onClose={this.handleClose}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">{this.state.newevent.text}</span>}
          />
          {this.props.children}
        </Fragment>
      </EventsContext.Provider>
    );
  }
}

export default EventsProvider;
