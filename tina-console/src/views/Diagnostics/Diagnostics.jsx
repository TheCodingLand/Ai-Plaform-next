import React from "react";

import CustomInput from 'components/CustomInput/CustomInput'
import Button from 'components/CustomButtons/Button'
import EventsContext from 'components/Context/EventsProvider'
import Typography from "@material-ui/core/Typography";



export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text:"",
            


        }
    }
        


    render() {
  
    return (
        <EventsContext.Consumer>{ events =>
    <div>
        
        
    
        </div>
        }</EventsContext.Consumer>
)


    }}