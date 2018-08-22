import React from "react";

import Sockette  from 'sockette'

import Context from "./Context";

export default class AppProvider extends React.Component {

constructor() {
  super();
  let socketUrl=""

  this.gethost = () => {
  let host = window.location.host
  console.log(host)
  if (host === "localhost:3000") {
    return "tina.ctg.lu" //dev env
  }
  else {
    let hostpath = host.split('.')
    hostpath.shift()
    return hostpath.join('.')
 
  }
}

  socketUrl = `ws://ws.${this.gethost()}`

  
  
  const socket = new Sockette(socketUrl, {
  timeout: 5e3,
  maxAttempts: 10,
  onopen: e => this.initData(),
  //onmessage: e => console.log('Received :' , e),
  onmessage: e => this.handleData(e),
  onreconnect: e => this.setState({wsState : "Reconnecting"}),
  onmaximum: e => console.log('Stop Attempting!', e),
  onclose: e => this.setState({wsState : "Closed"}),
  onerror: e => this.setState({wsState : "Error"}),
});
this.setInput = (text) => {
  console.log(text)
  this.setState({input: text})
}
this.setLastTask= () =>{
  console.log(this.state.tasks)
  
  this.state.lastTask = this.state.tasks.slice(-1)[0]

}
  this.sendObject = (o) => {
    this.state.ws.send(JSON.stringify(o))
    console.log(o)
  }

  this.sendData = () => this.state.ws.send(this.state.input)
  this.isAuthenticated = () => { 

    console.log("testing for authenticated", this.authenticated)
    
    return this.authenticated
  }

  
  this.getUserToken = (username,password) => {
    return new Promise((resolve, reject) => { 
      setTimeout(() => {
        console.log("getting user token")
        let o = {action : "login",username:username,password:password }
        this.sendObject(o)
        this.setState({user:username, password:password, authenticated:true})
        let token="uyuierytt5454er4t"
        
        resolve(token)
  }, 2000);})}


  this.login = (username, password) => {
    
    return this.getUserToken(username,password)
    
  }



    this.state = {
      host : this.getHost,
      wsState : "Disconnected",
      ws : socket,
      user: "",
      password:"",
      authenticated: false,
      isAuthenticated : this.isAuthenticated,
      hostStats : {},
      message: "",
      input : "",
      tasks : [],
      logins:[],
      errors : [],
      lastTask: {},
      getLastTask: this.getLastTask,
      setInput : this.setInput,
      sendData : this.sendData,
      sendObject : this.sendObject,
      login : this.login,
    }
  }
  
  initData() {
    this.setState({wsState : "Connected"})
    this.getRedisLoad()
    
  }
  
  getRedisLoad() {
    let action = { name: 'getRedisLoad', model:'test', dataset:'test1'}
    this.state.ws.send(JSON.stringify(action))   
  }
  
  
  
  handleData(e) {
    console.log(e)
    console.log(e.data)
    let result = JSON.parse(e.data);
    this.setState( result );
    let prop ="" 
    for (prop in result) {
      console.log(prop)
      if (prop === "tasks") {
        this.setLastTask()
      }
  }
    
    
}
  
  
  render() {
      return (<Context.Provider value={this.state}>
      {this.props.children}
      </Context.Provider>)
    }
  }