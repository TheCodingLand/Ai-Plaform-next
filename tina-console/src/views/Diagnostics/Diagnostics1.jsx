import React from "react";

import CustomInput from 'components/CustomInput/CustomInput'
import Button from 'components/CustomButtons/Button'
import Context from 'components/Context/Context'
import Typography from "@material-ui/core/Typography";



export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text:"",
            


        }
    }
        


    handleChange = (context,name) => event => {
        console.log(event)
        this.setState({
          [name]: event.target.value,
        });
        if (name === "text")  { context.setInput(event.target.value) 
            console.log(event.target.value)}
      };
    
    render() {
  
    return (
        <Context.Consumer>{ websocket =>
    <div>
        <CustomInput
                    labelText="Test Websocket"
                    id="text"
                    formControlProps={{
                      fullWidth: true
                    }}
                    value={this.state.text}
                    onChange={this.handleChange(websocket,'text')}
                  />
       
       <Typography> lastTask : {websocket.lastTask.name ? websocket.lastTask.name + ' ' + websocket.lastTask.taskProperties.jobtype : ""} </Typography>
        
        <Button onClick={websocket.sendData}>Test Websocket</Button>        
                    <Typography>Current Websocket Status : {websocket.wsState}</Typography>
        Last Message : <strong>{websocket.message}</strong>
        <p>{websocket.hostStats.diskSpace ? websocket.hostStats.diskSpace : "" }</p>

        <p>{websocket.hostStats.hostName ? websocket.hostStats.hostName : "" }</p>

    
        
    
        </div>
        }</Context.Consumer>
)


    }}