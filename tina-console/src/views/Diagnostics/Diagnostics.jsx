
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
    { id: 'dataset', numeric: false, disablePadding: true, label: 'Dataset' },
    { id: 'model', numeric: false, disablePadding: false, label: 'Model' },
    { id: 'column', numeric: false, disablePadding: false, label: 'Column' },
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'confidence', numeric: true, disablePadding: false, label: 'Confidence' },
    { id: 'total', numeric: true, disablePadding: false, label: 'Total' },
    { id: 'success', numeric: true, disablePadding: false, label: 'Success' },
    { id: 'ignored', numeric: true, disablePadding: false, label: 'Ignored' },
    { id: 'failures', numeric: true, disablePadding: false, label: 'Failures' },
    { id: 'percent', numeric: true, disablePadding: false, label: '%' },
  ];

const Diagnostics = () => {
    
    let eventsWithResuts = (context) => {
        let evs = []
        context.events.forEach((e) => { if (e.result) {evs.push(e)} } )
        console.log(evs)
        let events = evs.map((event) => { 
            
            let e = event
            e = Object.assign({}, e, event.result )
            e.dataset = e.dataset.dataset.name
            e.column = e.model.model.label
            e.model = e.model.model.name
            e.percent =parseInt(e.percent)
            e.started = new Date(e.started*1000)
            e.finished = new Date(e.finished*1000)

            
           
            
            return (e) } ) 
        
        return events
        }
    


        
        
        
        
return (<Fragment>

<EventsContext.Consumer>{ context => <Fragment><EventsTable title={'Training Events'} events={context.events} rows={rows} /> <EventsTable title={'Testint results'} events={eventsWithResuts(context)} rows={rowsresults} /></Fragment>
 }</EventsContext.Consumer>
</Fragment>

)
}

export default Diagnostics
