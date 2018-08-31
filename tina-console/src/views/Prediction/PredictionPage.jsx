import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import PredictionMainPage from "components/Prediction/PredictionMainPage"


class PredictionPage extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <PredictionMainPage />
          </GridItem>
        </GridContainer></div>
    )
  }
}

export default PredictionPage


