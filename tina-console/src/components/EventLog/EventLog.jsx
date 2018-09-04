import withStyles from "@material-ui/core/styles/withStyles";
import React from 'react'
import {AppContext} from 'components/Context/AppProvider'
import Paper from '@material-ui/core/Paper'
const styles = theme => ({
    event: {
      color: "rgba(0,100,100,.62)",
      margin: "0",
      fontSize: "1em",
      marginTop: "0",
      marginBottom: "0",
      listStyle: "none",
      padding: 0,
      border: ".3em solid #fff"
    },
    element: {
        display:"flex",
        flex:1
    },
    el:{
        flex:1
    }
})



class EventLog extends React.Component {
    constructor()
    {
        super()
        
    }
    getPercentage(value)
    {
        value = parseInt(value*100)
        
        value = value + "%"
        return value
    }   
    render(){
        const {classes} = this.props
        
        return (
        <AppContext.Consumer>{context =>
            <Paper>
        <ul>
        
        <div className={classes.element}>
            <div className={classes.el}>ACTION :</div>
            <div className={classes.el}>MODELID</div>
            <div className={classes.el}>CONFIDENCE</div>
            <div className={classes.el}>PREDICTION</div>
        </div>
        
        
        {context.actions.map(action => <li key={action.data.key} className={classes.event}>
        
        <div className={classes.element}>
            <div className={classes.el}>{action.data.action}</div>
            <div className={classes.el}> {action.data.modelid&&action.data.modelid}</div>
            <div className={classes.el}> {action.result[0].confidence&&this.getPercentage(action.result[0].confidence)}</div>
            <div className={classes.el}> {action.result[0].category&&action.result[0].category} </div>
        </div></li>)}</ul></Paper>
        }</AppContext.Consumer>

    )
    }
}

    
export default withStyles(styles)(EventLog)