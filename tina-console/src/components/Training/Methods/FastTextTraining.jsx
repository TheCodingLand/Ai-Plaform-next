import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/lab/Slider";
import { saveState, loadState } from "components/LocalStorage/LocalStorage";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { EventsContext } from "components/Context/EventsProvider";
import TextField from "@material-ui/core/TextField";
import { object } from "prop-types";
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
    paddingBottom: "10px",
    margin: theme.spacing.unit,
    width: "100%",
    position: "relative"
  }
});
class RunTrainingCard extends React.Component {
  constructor() {
    super();
    this.saveState = newstate => {
      saveState({ ...this.state, newstate }, "training");
      this.setState(newstate);
    };
    this.loadState = () => {
      this.setState(loadState("training"));
    };
    this.state = {
      id: "",
      datasetErrorText: "",
      modelNameErrorText: "",

      dataset: {
        _id: { $oid: "" },
        dataset: {
          name: "",
          version: 0,
          classifier: "",
          TextColumns: []
        }
      },
      model: {
        model: {
          name: "",
          epochs: 200,
          version: "1",
          ngrams: 3,
          learningRate: 0.2,
          splitAt: 95
        }
      },
      testmodel: true,
      confidence: 90,
      trainingStarted: false
    };
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }
  componentWillMount() {
    this.loadState();
  }
  validateForm() {
    let valid = true;
    let errors = {};
    if (this.state.dataset._id.$oid === "") {
      errors = { ...errors, datasetErrorText: "You must select a dataset !" };
      valid = false;
      console.log("dataset not selected");
    }
    if (this.state.model.model.name === "") {
      errors = { ...errors, modelNameErrorText: "You must enter a model name" };
      valid = false;
      console.log("model not selected");
    }
    if (valid) {
      this.saveState({ modelNameErrorText: "", datasetErrorText: "" });
      return valid;
    } else {
      this.saveState(errors);
      return valid;
    }
  }

  start = context => {
    if (this.validateForm() === true) {
      let data = {
        dataset: this.state.dataset,
        model: this.state.model,
        testmodel: this.state.model.testmodel,
        confidence: this.state.confidence
      };
      let id = context.createEvent("ft", "training", data);
      this.setState({ id: id });
    }
  };

  handleChangeSlider = name => (event, value) => {
    let prevmodel = this.state.model.model;
    let newmodel = { ...prevmodel, [name]: value };
    console.log(newmodel);
    this.saveState({ model: { ...prevmodel, model: newmodel } });
    //this.setState(...model: { model: { [name]: event.target.value }}});
  };
  /* 
    handleChangeDataset(event) {
      this.setState({ [event.target.name]: event.target.value });
    }; */

  handleChangeSelect(event) {
    if (this.props.appdata.datasets) {
      this.props.appdata.datasets.forEach(ds => {
        if (ds._id.$oid === event.target.value) {
          let model = this.state.model;
          console.log(ds.dataset);
          model.model.name = ds.dataset.classifier;

          this.saveState({
            [event.target.name]: ds,
            model: { ...this.state.model, model: model }
          });
        }
      });
    }
  }

  handleChange = name => event => {
    if (name === "splitlang") {
      this.saveState({ [name]: event.target.checked });
    } else {
      let prevmodel = this.state.model.model;
      let newmodel = { ...prevmodel, [name]: event.target.value };
      console.log(newmodel);
      this.saveState({ model: { ...prevmodel, model: newmodel } });
      //this.setState({ model: { model: { [name]: event.target.value }}});
    }
    //else if (name==="datasetname") {}
  };
  render() {
    const { classes } = this.props;
    return (
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Training Settings</h4>
          <p className={classes.cardCategoryWhite} />
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={12} md={3}>
              <FormControl
                className={classes.formControl}
                error={this.state.datasetErrorText !== ""}
              >
                <InputLabel htmlFor="dataset-id">Dataset</InputLabel>
                <Select
                  onChange={this.handleChangeSelect}
                  value={this.state.dataset._id.$oid}
                  input={<Input name="dataset" id="dataset-id" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {this.props.appdata.datasets
                    ? this.props.appdata.datasets.map(ds => {
                        return (
                          <MenuItem key={ds._id.$oid} value={ds._id.$oid}>
                            {ds.dataset.name} {ds.dataset.version}
                          </MenuItem>
                        );
                      })
                    : ""}
                </Select>
                <FormHelperText>{this.state.datasetErrorText}</FormHelperText>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={12} md={9} />
            <GridItem xs={12} sm={6} md={3}>
              <TextField
                className={classes.textFields}
                label="Dataset version"
                id="datasetversion"
                disabled
                value={this.state.dataset.dataset.version}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <TextField
                className={classes.textFields}
                label="Column label :"
                id="column"
                disabled
                value={this.state.dataset.dataset.classifier}
                formControlProps={{
                  fullWidth: true
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <Typography className={classes.sliders} id="epochslabel">
                Epochs
              </Typography>
              <GridContainer>
                <GridItem xs={10} sm={10} md={10}>
                  <Slider
                    value={this.state.model.model.epochs}
                    aria-labelledby="epochslabel"
                    min={20}
                    max={1000}
                    step={1}
                    onChange={this.handleChangeSlider("epochs")}
                  />
                </GridItem>

                <GridItem xs={2} sm={2} md={2}>
                  <Typography>{this.state.model.model.epochs}</Typography>
                </GridItem>
              </GridContainer>
            </GridItem>

            <GridItem xs={12} sm={12} md={6}>
              <Typography className={classes.sliders} id="learningratelabel">
                Learning Rate
              </Typography>
              <GridContainer>
                <GridItem xs={10} sm={10} md={10}>
                  <Slider
                    value={this.state.model.model.learningRate}
                    aria-labelledby="learningratelabel"
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={this.handleChangeSlider("learningRate")}
                  />
                </GridItem>

                <GridItem xs={2} sm={2} md={2}>
                  <Typography>
                    {this.state.model.model.learningRate.toFixed(2)}
                  </Typography>
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Typography className={classes.sliders} id="ngramslabel">
                Ngrams
              </Typography>
              <GridContainer>
                <GridItem xs={10} sm={10} md={10}>
                  <Slider
                    value={this.state.model.model.ngrams}
                    aria-labelledby="ngramslabel"
                    min={1}
                    max={5}
                    step={1}
                    onChange={this.handleChangeSlider("ngrams")}
                  />
                </GridItem>
                <GridItem xs={2} sm={2} md={2}>
                  <Typography>{this.state.model.model.ngrams}</Typography>
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={6} />
            <GridItem xs={12} sm={12} md={4}>
              <TextField
                required
                error={this.state.modelNameErrorText !== ""}
                helperText={this.state.modelNameErrorText}
                className={classes.textFields}
                label="model name"
                value={this.state.model.model.name}
                onChange={this.handleChange("name")}
                id="model"
                formControlProps={{
                  fullWidth: true
                }}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <TextField
                className={classes.textFields}
                label="version"
                id="version"
                value={this.state.model.model.version}
                onChange={this.handleChange("version")}
                formControlProps={{
                  fullWidth: true
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={12} md={6}>
              <Typography className={classes.sliders} id="splittestlabel">
                Split Training / testing data at :{" "}
              </Typography>
              <GridContainer>
                <GridItem xs={10} sm={10} md={10}>
                  <Slider
                    value={this.state.model.model.splitAt}
                    aria-labelledby="splittestlabel"
                    min={50}
                    max={100}
                    step={1}
                    onChange={this.handleChangeSlider("splitAt")}
                  />
                </GridItem>

                <GridItem xs={2} sm={2} md={2}>
                  <Typography>{this.state.model.model.splitAt}%</Typography>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter>
          <EventsContext.Consumer>
            {context =>
              context.getTask(this.state.id) ? (
                <Button disabled>In Progress</Button>
              ) : (
                <Button onClick={() => this.start(context)} color="primary">
                  Start training
                </Button>
              )
            }
          </EventsContext.Consumer>
        </CardFooter>
      </Card>
    );
  }
}

export default withStyles(styles)(RunTrainingCard);
