import React from "react";

// core components

import Dashboard from "components/Dashboard/Dashboard";
import { AppContext } from "components/Context/AppProvider";
class DashboardPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { classes } = this.props;

    return (
      <AppContext.Consumer>
        {context => <Dashboard appdata={context} />}
      </AppContext.Consumer>
    );
  }
}

export default DashboardPage;
