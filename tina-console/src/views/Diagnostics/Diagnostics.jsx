
import React, {Fragment} from 'react'
import {EventsContext} from 'components/Context/EventsProvider'
import EventsTable from 'components/Diagnostics/EventsTable'


const rows = [
    { id: 'text', numeric: false, disablePadding: true, label: 'Text' },
    { id: 'state', numeric: false, disablePadding: false, label: 'State' },
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
  ];

  const rowsresults = [
    { id: 'text', numeric: false, disablePadding: true, label: 'Text' },
    { id: 'state', numeric: false, disablePadding: false, label: 'State' },
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
    { id: 'total', numeric: true, disablePadding: true, label: 'Text' },
    { id: 'success', numeric: true, disablePadding: false, label: 'State' },
    { id: 'ignored', numeric: true, disablePadding: false, label: 'ID' },
    { id: 'failed', numeric: true, disablePadding: false, label: 'Action' },
  ];

const Diagnostics = () => {
    
    let eventsWithResuts = (context) => {
        let evs = []
        context.events.forEach((e) => { if (e.result) {evs.push(e)} } )
        evs.map((event) => { 
            let e = event
            Object.assign({}, e, event.result )
    
            return (e) } ) }
    


        
        
        
        
return (<Fragment>

<EventsContext.Consumer>{ context => <Fragment><EventsTable title={'Training Events'} events={context.events} rows={rows} /> <EventsTable title={'Training Events'} events={eventsWithResuts(context)} rows={rowsresults} /></Fragment>
 }</EventsContext.Consumer>
</Fragment>

)
}

export default Diagnostics
