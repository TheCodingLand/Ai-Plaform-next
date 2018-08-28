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
import {AppContext} from 'components/Context/AppProvider'
import {EventsContext} from 'components/Context/EventsProvider'
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
    return (
    <EventsContext.Consumer>{ events => 
    <AppContext.Consumer>{ context =>
    <Fragment>
      
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
            <FastTextTraining appdata={context}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Testing</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <FastTextTesting appdata={context}/>
            </ExpansionPanelDetails>
          </ExpansionPanel>
      
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Optimize</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <div></div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          </Paper>
      </ExpansionPanelDetails>
      </ExpansionPanel>
      
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Allen NLP</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <div></div>

        </ExpansionPanelDetails>
        </ExpansionPanel>
      
      
      
      
    
    
    
    </Fragment>
    }
    </AppContext.Consumer> } 
    </EventsContext.Consumer>
    )



  }
}

export default withStyles(styles)(TrainingPage);


