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
import { withStyles, TextField, Card } from "@material-ui/core";

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
    paddingBottom: "10px",
    margin: theme.spacing.unit,
    width: "100%",
    position: "relative"
  }
});

class Step1 extends React.Component {
  constructor() {
    super();
    this.state = {
      collection: ""
    };
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });

    this.props.setVal({ [name]: event.target.value });
    //else if (name==="datasetname") {}
  };
  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <Card className={classes.card}>
          <GridItem xs={6} sm={6} md={3}>
            <Typography className={classes.typography}>
              Select input data :
            </Typography>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              className={classes.textFields}
              label="Dataset Name :"
              name="datasetname"
              id="datasetname"
              onChange={this.handleChange("datasetName")}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <TextField
              className={classes.textFields}
              label="Version :"
              name="version"
              id="version"
              onChange={this.handleChange("version")}
            />
          </GridItem>

          <GridItem xs={12} sm={12} md={3}>
            <FormControl
              className={classes.formControl}
              error={!this.props.valid}
            >
              <InputLabel htmlFor="collection-id">Data Collection</InputLabel>
              <Select
                onChange={this.handleChange("collection")}
                value={this.props.collection}
                input={<Input name="collection" id="collection-id" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {this.props.appdata.rawdataCollections
                  ? this.props.appdata.rawdataCollections.map(collection => {
                      return (
                        <MenuItem key={collection} value={collection}>
                          <em>{collection}</em>
                        </MenuItem>
                      );
                    })
                  : ""}
              </Select>
              <FormHelperText>
                {!this.props.valid ? this.state.errorText : ""}
              </FormHelperText>
            </FormControl>
          </GridItem>
        </Card>
      </GridContainer>
    );
  }
}
export default withStyles(styles)(Step1);
