import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import GridItem from "components/Grid/GridItem";

import { withStyles } from "@material-ui/core";
import ListCheckBoxMultiple from "components/ListCheckbox/ListCheckboxMultiple";

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
    let items = this.props.appdata.rawdataColumns
      .filter(item => item !== "_id")
      .filter(item => item !== this.props.classColumn);
    return (
      <Fragment>
        <GridItem xs={6} sm={6} md={3}>
          <Typography className={classes.typography}>
            Select input data :
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={12} md={3}>
          <ListCheckBoxMultiple items={items} />
        </GridItem>
      </Fragment>
    );
  }
}
export default withStyles(styles)(Step2);
