import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import { withStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress"
const styles = theme => ({
  card: {
    width: "100%"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 500,
    marginTop: "27px"
  },
  textFields: {
    marginTop: "27px",
    paddingBottom: "10px",
    margin: theme.spacing.unit,
    width: "100%",
    position: "relative"
  }
});

class Step2 extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
    this.props.setVal(event.target.value);
    //else if (name==="datasetname") {}
  };
  render() {
    console.log(this.props.appdata.rawdataColumns);
    const { classes } = this.props;
    return (
      
      <GridContainer>
        {this.props.collectionName ? 
        <Card className={classes.card}>
          <GridItem xs={6} sm={6} md={3}>
            <Typography className={classes.typography}>
              Select input data :
            </Typography>
          </GridItem>

          <GridItem xs={12} sm={12} md={3}>
            <FormControl
              className={classes.formControl}
              error={!this.props.valid}
            >
              <InputLabel htmlFor="classification-id">
                Classification Column :
              </InputLabel>
              <Select
                onChange={this.handleChange("classification")}
                value={this.props.classification}
                input={<Input name="classification" id="classification-id" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {this.props.appdata.rawdataColumns
                  ? this.props.appdata.rawdataColumns[this.props.collectionName]
                      .filter(collection => collection !== "_id")
                      .map(collection => {
                        return (
                          <MenuItem key={collection} value={collection}>
                            <em>{collection}</em>
                          </MenuItem>
                        );
                      })
                  : ""}{" "}
                */}
              </Select>
              <FormHelperText>
                {!this.props.valid ? this.state.errorText : ""}
              </FormHelperText>
            </FormControl>
          </GridItem>
        </Card> : <CircularProgress />}
      </GridContainer>
    );
  }
}
export default withStyles(styles)(Step2);
