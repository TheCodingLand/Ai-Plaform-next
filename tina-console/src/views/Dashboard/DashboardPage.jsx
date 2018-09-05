import React from "react";

// core components

import Dashboard from "components/Dashboard/Dashboard";
import { AppContext } from "components/Context/AppProvider";
import { CircularProgress } from "@material-ui/core";
class DashboardPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { classes } = this.props;

    return (
      <AppContext.Consumer>
        {context => 
        context.dashboardLoaded?
        <Dashboard appdata={context} />
          :
          <CircularProgress />
      }
      </AppContext.Consumer>
    );
  }
}

export default DashboardPage;
