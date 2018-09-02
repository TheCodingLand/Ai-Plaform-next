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

      steps: {
        step1: {
          valid: true,
          setVal: this.setDataSource.bind(this)
        },
        step2: {
          valid: true,
          setVal: this.setClassColumn.bind(this)
        },
        step3: {
          valid: true,
          setVal: this.setTextColumns.bind(this)
        }
      }
    };
  }
  setTextColumns = textColumns => {
    this.setState({ textColumns: textColumns });
  };
  setClassColumn = classColumn => {
    this.setState({ classColumn: classColumn });
  };
  setDataSource = dataSourceName => {
    this.setState({ dataSourceName: dataSourceName });
  };

  isStepOptional = step => {
    return step === 1;
  };

  handleNext = () => {
    const { activeStep } = this.state;
    /* let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    } */
    this.setState({
      activeStep: activeStep + 1
      //skipped
    });
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
              valid={this.state.dsvalid}
              setVal={this.state.steps.step1.setVal}
              appdata={this.props.appdata}
            />
          </Fragment>
        );
      case 1:
        return (
          <Fragment className={this.props.classes.step}>
            <Step2
              valid={this.state.dsvalid}
              setVal={this.state.steps.step1.setVal}
              appdata={this.props.appdata}
            />
          </Fragment>
        );
      case 2:
        return "This is the bit I really care about!";
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
