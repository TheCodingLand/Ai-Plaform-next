import React, { Fragment } from "react";

class Step1 extends React.Component {
  constructor() {
    state = {
        valid = false,
        errors = { ...errors, dataCollectionErrorText: 'or select one !' }
    };
  }
  render() {
    return (
      <Fragment>
        <GridItem xs={6} sm={6} md={3}>
          <Typography className={classes.typography}>
            Select input data :
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={12} md={3}>
          <FormControl
            className={classes.formControl}
            error={this.state.dataCollectionErrorText != ""}
          >
            <InputLabel htmlFor="collection-id">Data Collection</InputLabel>
            <Select
              onChange={this.handleChange("collection")}
              value={this.state.collection}
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
              {this.state.dataCollectionErrorText}
            </FormHelperText>
          </FormControl>
        </GridItem>
      </Fragment>
    );
  }
}
