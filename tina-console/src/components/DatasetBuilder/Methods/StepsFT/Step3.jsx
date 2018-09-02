import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";

import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import { withStyles } from "@material-ui/core";
import ListCheckBoxMultiple from "components/ListCheckbox/ListCheckboxMultiple";

const styles = theme => ({
  card: {
    width: "100%"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    marginTop: "27px"
  },
  textFields: {
    paddingBottom: "10px",
    margin: theme.spacing.unit,
    width: "100%",
    position: "relative"
  }
});
class Step3 extends React.Component {
  constructor() {
    super();
    this.state = {
      checked: []
    };
    this.update = this.update.bind(this);
  }
  update(checked) {
    this.setState({ checked: checked });
    this.props.setVal(checked);
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
    this.props.setVal(event.target.value);
    //else if (name==="datasetname") {}
  };
  render() {
    console.log(this.props.appdata.rawdataColumns);
    const { classes } = this.props;
    let items = this.props.appdata.rawdataColumns[this.props.collectionName]
      .filter(item => item !== "_id")
      .filter(item => item !== this.props.classColumn);
    return (
      <GridContainer>
        <Card className={classes.card}>
          <GridItem xs={6} sm={6} md={3}>
            <Typography className={classes.typography}>
              Select input data :
            </Typography>
          </GridItem>

          <GridItem xs={12} sm={12} md={3}>
            <ListCheckBoxMultiple update={this.update} items={items} />
          </GridItem>
          <GridItem xs={12} sm={12} md={3}>
            <Typography>PREVIEW :</Typography>
            {this.state.checked.map(item => (
              <Typography key={item}>"{item}" </Typography>
            ))}
          </GridItem>
        </Card>
      </GridContainer>
    );
  }
}
export default withStyles(styles)(Step3);
