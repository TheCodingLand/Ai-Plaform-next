import withStyles from "@material-ui/core/styles/withStyles";


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

        return (
        <AppContext.Consumer>{context =>
        <li>{context.results.map(result => <ul className={classes.event}>{result.action}</ul>)}</li>
        }</AppContext.Consumer>

    )
    }
}

    
export default withStyles(styles)(EventLog)