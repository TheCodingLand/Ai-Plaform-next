import React, { Fragment } from "react";
import FastTextTesting from "./Methods/FastTextTesting";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { AppContext } from "components/Context/AppProvider";
import { EventsContext } from "components/Context/EventsProvider";

class TestingPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <AppContext.Consumer>
        {context => (
          <Fragment>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>FastText</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <FastTextTesting appdata={context} />
              </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Allen NLP</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

export default TestingPage;
