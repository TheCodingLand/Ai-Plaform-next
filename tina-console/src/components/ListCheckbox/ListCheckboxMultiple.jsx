import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
});

class ListCheckboxMultiple extends React.Component {
  state = {
    checked: []
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
    this.props.update(newChecked);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List>
          {this.props.items.map(value => (
            <ListItem
              onClick={this.handleToggle(value)}
              key={value}
              dense
              button
              className={classes.listItem}
            >
              <ListItemText primary={`${value}`} />
              <ListItemSecondaryAction>
                <Checkbox
                  onChange={this.handleToggle(value)}
                  checked={this.state.checked.indexOf(value) !== -1}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

ListCheckboxMultiple.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListCheckboxMultiple);
