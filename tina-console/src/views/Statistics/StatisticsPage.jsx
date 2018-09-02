import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Statistics from "components/Statistics/Statistics";
import { AppContext } from "components/Context/AppProvider";
class StatisticsPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <AppContext.Consumer>
              {context => <Statistics context={context} />}
            </AppContext.Consumer>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default StatisticsPage;
