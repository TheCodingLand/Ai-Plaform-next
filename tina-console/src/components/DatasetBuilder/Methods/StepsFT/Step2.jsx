import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";

import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import { withStyles } from "@material-ui/core";

const styles = theme => {};

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
            <InputLabel htmlFor="collection-id">Data Collection</InputLabel>
            <Select
              onChange={this.handleChange("collection")}
              value={this.props.value}
              input={<Input name="collection" id="collection-id" />}
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
      </GridContainer>
    );
  }
}
export default withStyles(styles)(Step2);
