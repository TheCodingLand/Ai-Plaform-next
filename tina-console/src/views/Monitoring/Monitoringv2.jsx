
import React from "react"
import EventsProvider from 'components/Context/EventsProvider'

export default class Monitoring extends React.Component {

    constructor(){
        super()
    }
    render() {
        return (<EventsProvider.Consumer>{ ({events}) => {
            <div>
                {events.map((event) => <p>event</p>)}
            </div>
        }}
            </EventsProvider.Consumer>
        )
    }

}