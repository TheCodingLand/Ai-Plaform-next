
import React from 'react'
import {EventsContext} from 'components/Context/EventsProvider'
import EventsTable from 'components/Diagnostics/EventsTable'

const Diagnostics = () => {
return (
<EventsContext.Consumer> {  context => <EventsTable events={context} />
 }
</EventsContext.Consumer>


)
}

export default Diagnostics
