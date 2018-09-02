import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import DatasetBuilderMainPage from "components/DatasetBuilder/DatasetBuilderMainPage";

class DatasetBuilderPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <DatasetBuilderMainPage />
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default DatasetBuilderPage;
