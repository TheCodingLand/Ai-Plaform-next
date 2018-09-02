import React, { Fragment } from "react";
import { EventsContext } from "components/Context/EventsProvider";
import EventsTable from "components/Statistics/EventsTable";

const rows = [
  { id: "text", numeric: false, disablePadding: true, label: "Text" },
  { id: "state", numeric: false, disablePadding: false, label: "State" },
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  { id: "action", numeric: false, disablePadding: false, label: "Action" }
];

const rowsresults = [
  { id: "dataset", numeric: false, disablePadding: true, label: "Dataset" },
  { id: "started", numeric: false, disablePadding: false, label: "Start" },
  { id: "finished", numeric: false, disablePadding: false, label: "End" },
  { id: "model", numeric: false, disablePadding: false, label: "Model" },
  { id: "column", numeric: false, disablePadding: false, label: "Column" },
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  {
    id: "confidence",
    numeric: true,
    disablePadding: false,
    label: "Confidence"
  },
  { id: "total", numeric: true, disablePadding: false, label: "Total" },
  { id: "success", numeric: true, disablePadding: false, label: "Success" },
  { id: "ignored", numeric: true, disablePadding: false, label: "Ignored" },
  { id: "failures", numeric: true, disablePadding: false, label: "Failures" },
  { id: "percent", numeric: true, disablePadding: false, label: "%" }
];

const Statistics = () => {
  let eventsWithResuts = context => {
    //let evs = []
    console.log(context.results);
    let evs = context.results.filter(e => e.result && e.action === "testing");

    //context.events.forEach((e) => { if (e.result && e.action === 'testing') { evs.push(e) } })
    console.log(evs);
    let events = evs.map(event => {
      let e = event;
      e = Object.assign({}, e, event.result);
      e.dataset = e.data.dataset.dataset.name;
      e.column = e.data.model.model.label;
      e.model = e.data.model.model.name;
      e.percent = parseInt(e.percent);
      e.confidence = e.data.confidence;
      e.started = new Date(e.started * 1000).toLocaleTimeString();
      e.finished = new Date(e.finished * 1000).toLocaleTimeString();

      return e;
    });

    return events;
  };
  return (
    <Fragment>
      <EventsContext.Consumer>
        {context => (
          <Fragment>
            <EventsTable
              title={"Training Events"}
              events={context.events}
              rows={rows}
            />{" "}
            <EventsTable
              title={"Testing results"}
              events={eventsWithResuts(context)}
              rows={rowsresults}
            />
          </Fragment>
        )}
      </EventsContext.Consumer>
    </Fragment>
  );
};

export default Statistics;
