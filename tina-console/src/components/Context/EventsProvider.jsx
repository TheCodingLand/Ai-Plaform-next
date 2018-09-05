import React, { Fragment } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { saveState, loadState } from "components/LocalStorage/LocalStorage";

export const EventsContext = React.createContext();

class EventsProvider extends React.Component {
  constructor() {
    super();
    let loadedstate = loadState("events");
    this.state = {
      id:false,
      notifications: [],
      results: [],
      events: [],
      activeTasks: [],
      predictions: [],
      trainings: [],
      testings: [],
      

      open: false,
      newevent: { text: "" },
      socket: false,

      removeNotificationByKey: this.removeNotificationByKey.bind(this),
      getTask: this.getTask.bind(this),
      createEvent: this.createEvent.bind(this),
      getTaskResult: this.getTaskResult.bind(this)
    };

    this.state = Object.assign({}, this.state, loadedstate);
    //this.state = {...this.state, loadedstate}
  }


  reconnect() {
     //we need a unique websocket ID, so scaling websockets server will work. basicaly, redis will hold a key list, which will contain a client ID, and a list of events the client is subbed to.
    //if ID doesnt exist, I ask a new ID to the websocket. 
    
    // But if it does exist, it will ask the websocket to get all past redis subscription keys. 
    // this will allow client to lose websocket connexions, reconnect to another server and still get redis keys updates/notifications he was subbed to !
    this.state.id ? this.props.websocket.on('identifier', identifier => { this.setState({id:identifier})}) : this.props.websocket.emit('redisResub', this.id)
}

  componentWillMount() {
 
    this.reconnect()
    
    this.props.websocket.on("message", obj => {
      this.eventRecieved(obj);
    });
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

  getTaskResult = id => {
    let task = this.state.results.filter(task => {
      console.log(id, task.id);
      return task.id === id;
    });

    return task;
  };

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

    let tasks = this.state.activeTasks;
    tasks.push({ id: id });
    this.setState({ tasks });

    this.props.websocket.emit("message", e);

    return id;
  };

  eventRecieved = obj => {
    let o = JSON.parse(obj.data);
    o.text = `${o.action} ${o.state}`;
    let trainings = this.state.trainings;
    let testings = this.state.testings;
    let predictions = this.state.predictions;
    let results = this.state.results;
    let events = this.state.events;
    let activeTasks = this.state.activeTasks;
    let notifications = this.state.notifications;
    if (o.action === "training") {
      trainings.push(o);
    }
    if (o.action === "testing") {
      testings.push(o);
    }
    if (o.action === "predict") {
      predictions.push(o);
    }
    if (o.state === "finished") {
      activeTasks = this.state.activeTasks.filter(task => task === o.id);
    }
    if (o.result) {
      results.push(o);
      events.push(o);
    }

    notifications.push(o);

    this.setState({
      results: results,
      events: events,
      newevent: o,
      notifications: notifications,
      activeTasks: activeTasks,
      trainings: trainings,
      predictions: predictions,
      testings: testings
    });
  };

  handleClose = () => {
    this.setState({ open: false, newevent: { text: "" } });
  };

  //DO WE DO THAT OD MONGOP QUERY ? I THINK I DO A MONGO QUERY, YEAH
  trigger_update = () => {
    this.state.socket.emit("allevents");
  };

  render() {
    if (this.state.events.length > 0) {
      saveState(this.state, "events");
    }

    this.props.websocket.on("event", this.gotEvent);
    this.props.websocket.on("allevents", this.gotEvents);

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
