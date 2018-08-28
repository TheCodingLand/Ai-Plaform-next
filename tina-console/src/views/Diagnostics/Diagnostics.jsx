
import React from 'react'
import {EventsContext} from 'components/Context/EventsProvider'
import EventsTable from 'components/Diagnostics/EventsTable'

export default Diagnostics = () => {
return (
<EventsContext.Consumer> {  context => <EventsTable events={context} />
 }
</EventsContext.Consumer>


)
            


}
