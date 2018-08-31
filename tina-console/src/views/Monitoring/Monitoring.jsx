
import React from "react"
import withStyles from "@material-ui/core/styles/withStyles";
import { SocketContext } from 'components/Context/SocketProvider'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
const styles = theme => ({
    textFields: {
        paddingBottom: "10px",
        margin: theme.spacing.unit,
        width: '100%',
        position: "relative"
    }
})
class Monitoring extends React.Component {

    constructor() {
        super()
        this.state = {
            command: ""
        }
    }

    handleChange = name => target => {
        this.setState({ [name]: target })
    }

    render() {
        let { classes } = this.props
        return (<div>
            {/*  <EventsContext.Consumer>{context => {
                <div>
                    {context.events.map((event) => <p>{event.id}</p>)}
                </div>
            }}
            </EventsContext.Consumer> */}
            <TextField
                className={classes.textFields}
                label="Command"
                id="command"
                value={this.state.command}
                onChange={() => this.handleChange('command')}
                formControlProps={{
                    fullWidth: true
                }}
            />
            <SocketContext.Consumer>{socket => {
                <Button onClick={() => socket.emit(this.state.command)}>TEST</Button>
            }}
            </SocketContext.Consumer>
        </div>
        )
    }

}

export default withStyles(styles)(Monitoring)