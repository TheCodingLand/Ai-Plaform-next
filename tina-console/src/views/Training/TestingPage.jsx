import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import TestingMainPage from "components/Testing/TestingMainPage"




class TestingPage extends React.Component {
  constructor() {
    super()


  }

  render() {
    const { classes } = this.props;

    return (
      <div>

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>


            <TestingMainPage />


          </GridItem>
        </GridContainer></div>


    )


  }
}

export default TestingPage


