
import react from 'react'
import {EventsContext} from 'components/Context/EventsContext'
import EventsTable from 'components/Diagnostics/EventsTable'

export default function() {
return (
<EventsContext.Consumer> {  context => 
<EventsTable events={context} /> }</EventsContext.Consumer>


)
            


}
