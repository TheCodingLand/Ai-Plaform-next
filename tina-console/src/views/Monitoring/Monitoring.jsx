
import React from "react"
import withStyles from "@material-ui/core/styles/withStyles";
import { EventsContext } from 'components/Context/EventsProvider'
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

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })

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
                onChange={this.handleChange('command')}
                formControlProps={{
                    fullWidth: true
                }}
            />

            <EventsContext.Consumer>{event =>
                <Button onClick={event.socket.emit(this.state.command)}>TEST</Button>
            }
            </EventsContext.Consumer>

        </div>
        )
    }

}

export default withStyles(styles)(Monitoring)