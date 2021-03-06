import React from "react";
//meterial
import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import orderBy from "lodash/sortBy";
// @material-ui/icons
// import Store from "@material-ui/icons/Store";
// import Warning from "@material-ui/icons/Warning";
// import DateRange from "@material-ui/icons/DateRange";
// import LocalOffer from "@material-ui/icons/LocalOffer";
// import Update from "@material-ui/icons/Update";
// import ArrowUpward from "@material-ui/icons/ArrowUpward";
// import AccessTime from "@material-ui/icons/AccessTime";
// import Accessibility from "@material-ui/icons/Accessibility";
// import BugReport from "@material-ui/icons/BugReport";
// import Code from "@material-ui/icons/Code";
// import Cloud from "@material-ui/icons/Cloud";

//components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";

import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import { AppContext } from "components/Context/AppProvider";

import dashboardStyle from "assets/jss/ctg-ai-lab/views/dashboardStyle.jsx";

class Dashboard extends React.Component {
  constructor() {
    super();
  }
  componentWillMount() {
    this.props.appdata.getTestedModels()
  }
  sortFloat(a, b) {
    return b.result.percent - a.result.percent;
  }
  top5(actions) {
    
    console.log(actions);
    if (actions.length > 0) {
    
    actions = actions.filter(action => { if (action !== undefined) { if (action.action === "testing") { return true } 
    return false } } ) 
    }
    let ids = [];
    let unique = [];
    actions.forEach(action => {
      if (!ids.includes(action.data.model._id.$oid)) {
        ids.push(action.data.model._id.$oid);
        unique.push(action);
      }
    });
    unique.sort(this.sortFloat);
 
    return unique
  }
  getColor(percent) {
    if (percent > 90) {
      return "success";
    }
    if (percent < 70) {
      return "danger";
    }
    return "warning";
  }
  render() {
    const { classes } = this.props;
    return (
      <AppContext.Consumer>
        {context => (
          <div>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                Models:
              </GridItem>
              {this.top5(context.testedModels).map(result => (
                <GridItem key={result.key} xs={12} sm={6} md={3}>
                  <Card>
                    <CardHeader
                      color={this.getColor(result.result.percent)}
                      stats
                      icon
                    >
                      <CardIcon color={this.getColor(result.result.percent)}>
                        <Icon>content_copy</Icon>
                      </CardIcon>
                      <p className={classes.cardCategory}>
                        Trained : {result.data.model.model.name}, success rate :
                      </p>
                      <h3 className={classes.cardTitle}>
                        {result.result.percent.toFixed(2)}
                        <small>%</small>
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <Typography>{result.data.model.model.label}</Typography>
                    </CardContent>
                    <CardFooter stats>
                      <div className={classes.stats}>
                        <Typography>Model ID :</Typography>{" "}
                        {result.data.model._id.$oid}
                      </div>
                    </CardFooter>
                  </Card>
                </GridItem>
              ))}
            </GridContainer>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withStyles(dashboardStyle)(Dashboard);
