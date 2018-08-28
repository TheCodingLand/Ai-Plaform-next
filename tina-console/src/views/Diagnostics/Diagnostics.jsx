
import React, {Fragment} from 'react'
import {EventsContext} from 'components/Context/EventsProvider'
import EventsTable from 'components/Diagnostics/EventsTable'


const rows = [
    { id: 'text', numeric: false, disablePadding: true, label: 'Text' },
    { id: 'state', numeric: false, disablePadding: false, label: 'State' },
    
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
  ];

const Diagnostics = () => {
return (<Fragment>
<EventsContext.Consumer>{ context => <EventsTable title={'Training Events'} events={context.events} rows={rows} />
 }</EventsContext.Consumer>
</Fragment>

)
}

export default Diagnostics
