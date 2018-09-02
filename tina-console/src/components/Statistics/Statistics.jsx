import React, { Fragment } from "react";
import { EventsContext } from "components/Context/EventsProvider";
import EventsTable from "components/Statistics/EventsTable";
import { AppProvider, AppContext } from "../../components/Context/AppProvider";

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

class Statistics extends React.Component {
  componentWillMount() {
    this.props.context.get("results", "actions");
  }
  eventsWithResuts = () => {
    //let evs = []
    console.log(this.props.context.actions);
    let evs = this.props.context.actions.filter(
      e => e.result && e.action === "testing"
    );

    //context.events.forEach((e) => { if (e.result && e.action === 'testing') { evs.push(e) } })
    console.log(evs);
    let events = evs.map(event => {
      let e = event;
      e = Object.assign({}, e, event.result);
      e.dataset = e.data.dataset.dataset.datasetName;
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

  render() {
    return (
      <Fragment>
        <Fragment>
          <EventsTable
            title={"Testing results"}
            events={this.eventsWithResuts()}
            rows={rowsresults}
          />
        </Fragment>
      </Fragment>
    );
  }
}
export default Statistics;
