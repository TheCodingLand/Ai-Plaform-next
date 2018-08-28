
import React, {Fragment} from 'react'
import {EventsContext} from 'components/Context/EventsProvider'
import EventsTable from 'components/Diagnostics/EventsTable'

const Diagnostics = () => {
return (<Fragment>
<EventsContext.Consumer>{  context => <EventsTable events={context} />
 }
</EventsContext.Consumer>
</Fragment>

)
}

export default Diagnostics
