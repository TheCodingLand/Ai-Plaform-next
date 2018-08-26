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
class RunTestingCard extends React.Component {
  constructor() {
    super()
    this.state = {
      dataset: "",
      model: '',
      confidence: 90,
      TestingStarted: false,
      split: 95,
      models: []
    };
    this.handleChangeDataset = this.handleChangeDataset.bind(this)


  }
  makeid = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  startTesting = (context) => {
    let id = this.makeid()
    this.setState({ TestingStarted: true, id: id })
    console.log('fired onclick')
    context.action('testing', {
      id: id,
      action: `testing`,
      dataset: this.state.dataset,
      model: this.state.model,
      version: this.state.version,
      
    })
  }

  handleChangeSlider = name => (event, value) => {
    this.setState({ [name]: value });
  };

  handleChangeDataset(event) {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChange = name => event => {
    
      this.setState({ [name]: event.target.value });
    
    //else if (name==="datasetname") {}
  };

  

  render() {
    
    const { classes } = this.props;
    return (
      <Card>
        <CardHeader color="rose">
          <h4 className={classes.cardTitleWhite}>FastText Testing Settings</h4>
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
                  {this.props.appdata.datasets.map((ds) => {
                
                
                  <MenuItem value={ds.name}>{ds.name} {ds.version}</MenuItem>
                } )}
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

              <Typography className={classes.sliders} id="confidencelabel">only return results with confidence ></Typography>
              <GridContainer>
                <GridItem xs={10} sm={10} md={10}>
                  <Slider value={this.state.confidence} aria-labelledby="confidencelabel" min={50} max={100} step={1} onChange={this.handleChangeSlider('confidence')} />
                </GridItem>

                <GridItem xs={2} sm={2} md={2}>
                  <Typography>{this.state.confidence}%</Typography>
                </GridItem>

             </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>

              <Typography className={classes.sliders} id="splittestlabel">Split at : </Typography>
              <GridContainer>
                <GridItem xs={10} sm={10} md={10}>
                  <Slider value={this.state.split} aria-labelledby="splittestlabel" min={50} max={100} step={1} onChange={this.handleChangeSlider('split')} />
                </GridItem>

                <GridItem xs={2} sm={2} md={2}>
                  <Typography>{this.state.split}%</Typography>
                </GridItem>

             </GridContainer>
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
            this.state.testingStarted ? <Button disabled>In Progress</Button> : <Button onClick={() => this.startTesting(context)} color="rose">Start testing</Button>
          }</EventsContext.Consumer>
        </CardFooter>
      </Card>



    )


  }
}



export default withStyles(styles)(RunTestingCard);


