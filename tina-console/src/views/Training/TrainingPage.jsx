import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import RunTrainingCard from "../../components/Training/RunTrainingCard";
import withStyles from "@material-ui/core/styles/withStyles";

import SocketProvider from 'components/Context/SocketProvider'

const styles = theme => ({})
class TrainingPage extends React.Component {
  constructor() {
    super()
    
    
  }
    startTraining = (data) => {

      //console.log(this.props.context)
    }

    startTesting(data) {

    }

    startOptimization(data) {

    }


    render() {
      const { classes } = this.props;
      
return (
<div>

<GridContainer>
  <GridItem xs={12} sm={12} md={8}>
  { // A card for running a training with a specific Dataset
  }
  <RunTrainingCard startTraining={this.startTraining} datasets={this.context.datasets} />
  { // A card for running optimizations with a range of settings and a step value
  }
  </GridItem>
 </GridContainer></div>


)


}}

export default TrainingPage

    
/* 
    export default withStyles(styles)(React.forwardRef((props, ref) => (
      <Context.Consumer>
        {context => <TrainingPage {...props} context={context} ref={ref} />}
      </Context.Consumer>
    ))
  )

 */
    