import withStyles from "@material-ui/core/styles/withStyles";
import React from 'react'
import {AppContext} from 'components/Context/AppProvider'

const styles = theme => ({
    event: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "1em",
      marginTop: "0",
      marginBottom: "0"
    },
})



class EventLog extends React.Component {
    constructor()
    {
        super()
        
    }

    render(){
        const {classes} = this.props

        return (
        <AppContext.Consumer>{context =>
        <li>{context.actions.map(action => <ul className={classes.event}>{action.action}</ul>)}</li>
        }</AppContext.Consumer>

    )
    }
}

    
export default withStyles(styles)(EventLog)