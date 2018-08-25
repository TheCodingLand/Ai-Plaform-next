import React from "react";
import CustomInput from 'components/CustomInput/CustomInput'
import InputLabel from "@material-ui/core/InputLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/lab/Slider'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Switch from '@material-ui/core/Switch';
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { EventsContext } from 'components/Context/EventsProvider'

const styles = theme => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },

  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    marginTop: "27px",
  },
  sliders: {
    paddingBottom: "10px",
    margin: theme.spacing.unit,

    position: "relative"
  },
  textFields: {
    paddingBottom: "10px",
    margin: theme.spacing.unit,

    position: "relative"
  }

});
class RunTrainingCard extends React.Component {
  constructor() {
    super()
    this.state = {
      dataset: "",
      model: '',
      splitlang: false,
      epochs: 200,
      version: '1',
      ngrams: 3,
      learningrate: .2,
      trainingStarted: false
    };
    this.handleChangeDataset = this.handleChangeDataset.bind(this)


  }
  makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  startTraining = (context) => {
    let id = this.makeid()
    this.setState({ trainingStarted: true, id: id })
    console.log('fired onclick')
    context.action('training', {
      id: id,
      action: `training`,
      dataset: this.state.dataset,
      model: this.state.model,
      splitlang: this.state.splitlang,
      epochs: this.state.epochs,
      version: this.state.version,
      learningRate: this.learningrate,
      ngrams: this.ngrams
    })
  }

  handleChangeSlider = name => (event, value) => {
    this.setState({ [name]: value });
  };

  handleChangeDataset(event) {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChange = name => event => {
    if (name === "splitlang") {
      this.setState({ [name]: event.target.checked });
    } else {
      this.setState({ [name]: event.target.value });
    }
    //else if (name==="datasetname") {}
  };
  render() {
    const { classes } = this.props;
    return (
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>FastText Training Settings</h4>
          <p className={classes.cardCategoryWhite}></p>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={3}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="dataset-id">Dataset</InputLabel>
                <Select
                  onChange={this.handleChangeDataset}
                  value={this.state.dataset}
                  input={<Input name="dataset" id="dataset-id" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="bnp">BNP v1</MenuItem>
                </Select>
                <FormHelperText>go to upload to add more</FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                className={classes.textFields}
                labelText="Dataset version"
                id="datasetverson"
                disabled
                formControlProps={{
                  fullWidth: true
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>


            <GridItem xs={12} sm={12} md={6}>

              <Typography className={classes.sliders} id="epochslabel">Epochs</Typography>
              <GridContainer>
                <GridItem xs={10} sm={10} md={10}>
                  <Slider value={this.state.epochs} aria-labelledby="epochslabel" min={20} max={1000} step={1} onChange={this.handleChangeSlider('epochs')} />
                </GridItem>

                <GridItem xs={2} sm={2} md={2}>
                  <Typography>{this.state.epochs}</Typography>
                </GridItem>

              </GridContainer>
            </GridItem>



            <GridItem xs={12} sm={12} md={6}>

              <Typography className={classes.sliders} id="learningratelabel">Learning Rate</Typography>
              <GridContainer>
                <GridItem xs={10} sm={10} md={10}>
                  <Slider value={this.state.learningrate} aria-labelledby="learningratelabel" min={0} max={1} step={.1} onChange={this.handleChangeSlider('learningrate')} />
                </GridItem>

                <GridItem xs={2} sm={2} md={2}>
                  <Typography>{this.state.learningrate.toFixed(2)}</Typography>
                </GridItem>

              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Typography className={classes.sliders} id="ngramslabel">Ngrams</Typography>
              <GridContainer>
                <GridItem xs={10} sm={10} md={10}>
                  <Slider value={this.state.ngrams} aria-labelledby="ngramslabel" min={1} max={3} step={1} onChange={this.handleChangeSlider('ngrams')} />
                </GridItem>
                <GridItem xs={2} sm={2} md={2}>
                  <Typography>{this.state.ngrams}</Typography>
                </GridItem>


              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                className={classes.textFields}
                labelText="model"
                onChange={this.handleChange('model')}
                id="model"
                formControlProps={{
                  fullWidth: true
                }}
              />
              </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                className={classes.textFields}
                labelText="version"
                id="version"
                onChange={this.handleChange('version')}
                formControlProps={{
                  fullWidth: true
                }}
              />
            
            </GridItem>
            {/* <GridItem xs={12} sm={12} md={4}>
              <FormControlLabel className={classes.formControl}
                control={
                  <Switch
                    checked={this.state.splitlang}
                    onChange={this.handleChange('splitlang')}
                    value="splitlang"
                  />
                }
                label="Split Language ?"
              />
            </GridItem> */}
          </GridContainer>

        </CardBody>
        <CardFooter>
          <EventsContext.Consumer>{context =>
            this.state.trainingStarted ? <Button disabled>In Progress</Button> : <Button onClick={() => this.startTraining(context)} color="primary">Start training</Button>
          }</EventsContext.Consumer>
        </CardFooter>
      </Card>



    )


  }
}



export default withStyles(styles)(RunTrainingCard);


