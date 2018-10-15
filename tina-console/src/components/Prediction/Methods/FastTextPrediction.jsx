import React, { Fragment } from "react";
import CustomInput from "components/CustomInput/CustomInput";
import InputLabel from "@material-ui/core/InputLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import { saveState, loadState } from "components/LocalStorage/LocalStorage";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { EventsContext } from "components/Context/EventsProvider";

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
    marginTop: "27px"
  },
  sliders: {
    paddingBottom: "10px",
    margin: theme.spacing.unit,

    position: "relative"
  },
  textFields: {
    marginTop: "27px",
    paddingBottom: "10px",
    margin: theme.spacing.unit,
    width: "100%",
    position: "relative"
  }
});

class FastTextPrediction extends React.Component {
  constructor() {
    super();
    this.saveState = newstate => {
      saveState({ ...this.state, newstate }, "prediction");
      this.setState(newstate);
    };
    this.loadState = () => {
      let savedstate = loadState("prediction");
      if (savedstate) {
        savedstate = { ...savedstate, predictStarted: false };
        this.setState(...this.state, savedstate);
      }
    };
    this.state = {
      id: "",
      predictions: [],
      predictStarted: false,
      nborresultsErrorText: "",
      textErrorText: "",
      modelErrorText: "",
      model: {
        _id: { $oid: "" },
        model: {
          name: "",
          version: 0,
          label: ""
        }
      },
      nbofresults: 1,
      text: "",
      result: ""
    };
    this.getResult = this.getResult.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }
  componentWillMount() {
    //this.loadState();
  }

  validateForm() {
    let errors = {};
    let valid = true;
    if (this.state.model._id.$oid === "") {
      errors = { ...errors, modelErrorText: "You must select a model !" };
      valid = false;
      console.log("dataset not selected");
    }
    if (this.state.text === "") {
      errors = { ...errors, textErrorText: "You must enter text !" };
      valid = false;
      console.log("dataset not selected");
    }

    if (this.state.nbofresults === "") {
      errors = {
        ...errors,
        nborresultsErrorText: "You must enter a deired NB of results"
      };
      valid = false;
      console.log("model not selected");
    }

    if (valid) {
      this.saveState({
        modelErrorText: "",
        textErrorText: "",
        nborresultsErrorText: ""
      });
      return valid;
    } else {
      this.saveState(errors);
      return valid;
    }
  }

  start = context => {
    if (this.validateForm() === true) {
      let data = {
        modelid: this.state.model._id.$oid,
        text: this.state.text,
        nbofresults: this.state.nbofresults
      };
      
      context.createEvent("ft", "predict", data, this.getResult)
      
      
      //CALLBACK OR NOT CALLBACK, THIS IS THE QUESTION
      // let id = context.createEvent("ft", "predict", data, this.eventRecieved);
      //this.setState({ id: id });
    }
  };

  getResult = (context) => {
    
    console.log(context.predictions);
    console.log(context.lastTaskId)
    let prediction = context.predictions.filter(
     
     prediction => prediction.id === context.lastTaskId
    );
    console.log(prediction);
    

    let text = "";
    if (prediction.length > 0) {
      if (prediction[0].result) {
        let i = 1;

        prediction[0].result.forEach(r => {
          text =`${text}\nResultat ${i}:\ncategory : ${r.category}\nconfidence : ${r.confidence}\n`
          i = i+1;
        });
      }
      return text;
    }
    return "";
  }

  handleChangeSelect(event) {
    if (this.props.appdata.models) {
      this.props.appdata.models.forEach(ds => {
        if (ds._id.$oid === event.target.value) {
          this.saveState({ [event.target.name]: ds });
        }
      });
    }
  }

  handleChange = name => event => {
    this.saveState({ [name]: event.target.value });
  };

  getModels = () => {
    return this.props.appdata.models.map(md => {
      return (
        <MenuItem key={md._id.$oid} value={md._id.$oid}>
          {md.model.name} {md.model.version}
        </MenuItem>
      );
    });
  };

  render() {
    //console.log(this.props.appdata.datasets)
    const { classes } = this.props;
    return (
      <Card>
        <CardHeader color="success">
          <h4 className={classes.cardTitleWhite}>FastText Testing Settings</h4>
          <p className={classes.cardCategoryWhite} />
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <FormControl
                className={classes.formControl}
                error={this.state.modelErrorText != ""}
              >
                <InputLabel htmlFor="model-id">Model</InputLabel>
                <Select
                  onChange={this.handleChangeSelect}
                  value={this.state.model._id.$oid}
                  input={<Input name="model" id="model-id" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.props.appdata.models ? this.getModels() : ""}
                </Select>
                <FormHelperText>{this.state.modelErrorText}</FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <TextField
                className={classes.textFields}
                label="Column label :"
                id="column"
                disabled
                value={this.state.model.model.label}
                formControlProps={{
                  fullWidth: true
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={12} md={12}>
              <TextField
                error={this.state.textErrorText !== ""}
                className={classes.textFields}
                label="Text"
                id="text"
                multiline
                rows={10}
                value={this.state.text}
                helperText={this.state.textErrorText}
                onChange={this.handleChange("text")}
                formControlProps={{
                  fullWidth: true
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <TextField
                error={this.state.nborresultsErrorText !== ""}
                className={classes.textFields}
                helperText={this.state.nborresultsErrorText}
                label="Number Of Resuts"
                id="nbofresults"
                value={this.state.nbofresults}
                onChange={this.handleChange("nbofresults")}
                formControlProps={{
                  fullWidth: true
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                className={classes.textFields}
                labelText="version"
                id="version"
                disabled
                value={this.state.model.model.version}
                formControlProps={{
                  fullWidth: true
                }}
              />
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter>
          <EventsContext.Consumer>
            {context => (
              <Fragment>
                {this.state.predictStarted ? (
                  <Button disabled>In Progress</Button>
                ) : (
                  <Button
                    onClick={() => new this.start(context)}
                    color="success"
                  >
                    Predict
                  </Button>
                )}

                <GridItem xs={12} sm={12} md={12}>
                  <TextField
                    className={classes.textFields}
                    label="Results"
                    id="result"
                    disabled
                    multiline
                    rows={10}
                    value={this.getResult(context)}
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </Fragment>
            )}
          </EventsContext.Consumer>
        </CardFooter>
      </Card>
    );
  }
}

export default withStyles(styles)(FastTextPrediction);
