import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Dashboard from "components/Dashboard/Dashboard";
import { AppContext } from "components/Context/AppProvider";
class TestingPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <AppContext.Consumer>
              {context => <Dashboard appdata={context} />}
            </AppContext.Consumer>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default TestingPage;
