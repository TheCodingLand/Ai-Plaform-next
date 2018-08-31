
import React from "react"
import { EventsContext } from 'components/Context/EventsProvider'

export default class Monitoring extends React.Component {

    constructor() {
        super()
    }
    render() {
        return (<div>
            <EventsContext.Consumer>{context => {
                <div>
                    {context.events.map((event) => <p>{event.id}</p>)}
                </div>
            }}
            </EventsContext.Consumer>
        </div>
        )
    }

}