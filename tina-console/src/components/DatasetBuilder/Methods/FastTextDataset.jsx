import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Step1 from "./StepsFT/Step1";
import Step2 from "./StepsFT/Step2";
import Step3 from "./StepsFT/Step3";
import { EventsContext } from "components/Context/EventsProvider";

const styles = theme => ({
  root: {
    width: "90%"
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  step: {}
});

class HorizontalLinearStepper extends React.Component {
  constructor() {
    super();
    this.state = {
      activeStep: 0,
      skipped: new Set(),
      collection: "",
      textColumns: "",
      classification: "",
      version: "",
      datasetName: "",
      id: "",
      dataBuilderStarted: false,
      steps: [
        {
          valid: true,
          validated: false,
          setVal: this.setCollection.bind(this)
        },
        {
          valid: true,
          validated: false,
          setVal: this.setClassificationCol.bind(this)
        },
        {
          valid: true,
          validated: false,
          setVal: this.setTextColumns.bind(this)
        }
      ]
    
    };
    this.onFinished = this.onFinished.bind(this)
  }
  //STEP 1
  validate1() {
    if (
      this.state.collection !== "" &&
      this.state.datasetName !== "" &&
      this.state.version !== ""
    ) {
      return true;
    }
    return false;
  }
  validate(newstate) {
    console.log(newstate);
    if (
      newstate.collection !== "" &&
      newstate.datasetName !== "" &&
      newstate.version !== ""
    ) {
      return true;
    }
    return false;
  }
  setCollection = data => {
    if (data) {
      // console.log(data);

      let newstate = { ...this.state, data };
      if (this.validate(newstate)) {
        let steps = this.state.steps;
        steps[0].valid = true;
        steps[0].validated = true;
        data.steps = steps;
      }

      this.setState(data);
    }
  };

  //STEP 2
  setClassificationCol = data => {
    if (data) {
      let steps = this.state.steps;
      steps[1].valid = true;
      steps[1].validated = true;
      this.setState({ classification: data, steps: steps });
    }
  };
  //STEP 3
  setTextColumns = data => {
    if (data) {
      let steps = this.state.steps;
      steps[2].valid = true;
      steps[2].validated = true;
      this.setState({ textColumns: data, steps: steps });
    }
  };

  finish = context => {
    let data = {
      classification: this.state.classification,
      datasetName: this.state.datasetName,
      version: this.state.version,
      collection: this.state.collection,
      columns: this.state.textColumns
    };
    let id = context.createEvent("ft", "datasetbuilder", data, this.onFinished());
    this.setState({ id: id, dataBuilderStarted: true});
  };
  onFinished = () => this.setState({dataBuilderStarted:false})
  handleNext = context => {
    const { activeStep } = this.state;

    if (activeStep === 0) {
      if (this.validate1) {
        this.setState({
          activeStep: activeStep + 1
        });
      }
    }

    if (!this.state.steps[activeStep].validated) {
      let steps = this.state.steps;
      steps[activeStep].valid = false;
      this.setState({ steps: steps });
    }

    if (this.state.steps[activeStep].valid) {
      if (this.state.activeStep === this.state.steps.length - 1) {
        this.finish(context);
      } else {
        this.setState({
          activeStep: activeStep + 1
        });
      }
    }

    /* let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    } */
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1
    });
  };
  getSteps() {
    return [
      "Select a Data source",
      "Select the Classification column",
      "Select Text columns"
    ];
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Fragment>
            <Step1
              collection={this.state.collection}
              valid={this.state.steps[0].valid}
              setVal={this.state.steps[0].setVal}
              appdata={this.props.appdata}
            />
          </Fragment>
        );
      case 1:
        return (
          <Fragment>
            <Step2
              classification={this.state.classification}
              collectionName={this.state.collection}
              valid={this.state.steps[1].valid}
              setVal={this.state.steps[1].setVal}
              appdata={this.props.appdata}
            />
          </Fragment>
        );
      case 2:
        return (
          <Fragment>
            <Step3
              value={this.state.classColumn}
              collectionName={this.state.collection}
              valid={this.state.steps[2].valid}
              setVal={this.state.steps[2].setVal}
              appdata={this.props.appdata}
              classColumn={this.props.classification}
            />
          </Fragment>
        );
      default:
        return "Unknown step";
    }
  }

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  render() {
    const { classes } = this.props;
    const steps = this.getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {};
            const labelProps = {};

            return (
              <Step key={label} {...props}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed - you&quot;re finished
              </Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </div>
          ) : (
            <div>
              <Typography className={classes.instructions}>
                {this.getStepContent(activeStep)}
              </Typography>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <EventsContext.Consumer>
                  {context => (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.handleNext(context)}
                      className={classes.button}
                      disabled = {this.state.dataBuilderStarted}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  )}
                </EventsContext.Consumer>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

HorizontalLinearStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(HorizontalLinearStepper);
