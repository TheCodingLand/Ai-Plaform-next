import React, { Fragment } from 'react';
import * as Methods from 'components/Training/Methods/FastTextTraining'
import FastTextTraining from './Methods/FastTextTraining';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { Paper } from '@material-ui/core';
import FastTextTesting from './Methods/FastTextTesting';


const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },

})



class TrainingPage extends React.Component {
  render(){
    const {classes} = this.props
    return (<Fragment>
      
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>FastText</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
<Paper>


          <ExpansionPanel >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Training</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <FastTextTraining />
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Testing</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <FastTextTesting />
            </ExpansionPanelDetails>
          </ExpansionPanel>
      
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Optimize</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <FastTextTraining />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          </Paper>
      </ExpansionPanelDetails>
      </ExpansionPanel>
      
      
      
    
    
    
    
    </Fragment>
      
    )



  }
}

export default withStyles(styles)(TrainingPage);


