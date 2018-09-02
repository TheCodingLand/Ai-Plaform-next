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
      classColumn: "",
      dataSourceName: "",
      textColumns: "",

      steps: [
        {
          valid: true,
          validated: false,
          setVal: this.setDataSource.bind(this)
        },
        {
          valid: true,
          validated: false,
          setVal: this.setClassColumn.bind(this)
        },
        {
          valid: true,
          validated: false,
          setVal: this.setTextColumns.bind(this)
        }
      ]
    };
  }
  setTextColumns = data => {
    if (data) {
      let steps = this.state.steps;
      steps[2].valid = true;
      steps[2].validated = true;

      this.setState({ textColumns: data, steps: steps });
    }
  };
  setClassColumn = data => {
    if (data) {
      let steps = this.state.steps;
      steps[1].valid = true;
      steps[1].validated = true;
      this.setState({ classColumn: data, steps: steps });
    }
  };
  setDataSource = data => {
    if (data) {
      let steps = this.state.steps;
      steps[0].valid = true;
      steps[0].validated = true;
      this.setState({ dataSourceName: data, steps: steps });
    }
  };

  isStepOptional = step => {
    return step === 1;
  };

  handleNext = () => {
    const { activeStep } = this.state;
    if (!this.state.steps[activeStep].validated) {
      let steps = this.state.steps;
      steps[activeStep].valid = false;
      this.setState({ steps: steps });
    }

    if (this.state.steps[activeStep].valid) {
      this.setState({
        activeStep: activeStep + 1
      });
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
          <Fragment className={this.props.classes.step}>
            <Step1
              value={this.state.dataSourceName}
              valid={this.state.steps[0].valid}
              setVal={this.state.steps[0].setVal}
              appdata={this.props.appdata}
            />
          </Fragment>
        );
      case 1:
        return (
          <Fragment className={this.props.classes.step}>
            <Step2
              value={this.state.classColumn}
              collectionName={this.state.dataSourceName}
              valid={this.state.steps[1].valid}
              setVal={this.state.steps[1].setVal}
              appdata={this.props.appdata}
            />
          </Fragment>
        );
      case 2:
        return (
          <Fragment className={this.props.classes.step}>
            <Step3
              value={this.state.classColumn}
              collectionName={this.state.dataSourceName}
              valid={this.state.steps[2].valid}
              setVal={this.state.steps[2].setVal}
              appdata={this.props.appdata}
              classColumn={this.props.classColumn}
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

                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
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
