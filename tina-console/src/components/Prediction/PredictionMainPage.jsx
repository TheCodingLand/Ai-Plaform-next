import React, { Fragment } from 'react'
import FastTextPrediction from './Methods/FastTextPrediction'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { AppContext } from 'components/Context/AppProvider'
import { EventsContext } from 'components/Context/EventsProvider'



class PredictionPage extends React.Component {
  render() {
   
    return (
      <EventsContext.Consumer>{events =>
        <AppContext.Consumer>{context =>
          <Fragment>

            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>FastText</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>

                <FastTextPrediction appdata={context} />

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
        </AppContext.Consumer>}
      </EventsContext.Consumer>
    )

  }
}

export default PredictionPage


