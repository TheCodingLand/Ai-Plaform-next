import React from "react";
//meterial
import Icon from "@material-ui/core/Icon";
import withStyles from "@material-ui/core/styles/withStyles";

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


import dashboardStyle from "assets/jss/ctg-ai-lab/views/dashboardStyle.jsx";

class Dashboard extends React.Component {
    render() {
        const { classes } = this.props;
return (<div>

<GridContainer>
    <GridItem xs={12} sm={12} md={12}>
    Models:
    </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Trained : RCSL Vesion 1.3, success rate :</p>
                <h3 className={classes.cardTitle}>
                  91<small>%</small>
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <a href="#advanced" onClick={e => e.preventDefault()}>
                    Advanced stats

                  </a>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Trained : RCSL Vesion 0.8, success rate :</p>
                <h3 className={classes.cardTitle}>
                  80<small>%</small>
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <a href="#advanced" onClick={e => e.preventDefault()}>
                    Advanced stats

                  </a>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Trained : RCSL Vesion 0.2, success rate :</p>
                <h3 className={classes.cardTitle}>
                  65<small>%</small>
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <a href="#advanced" onClick={e => e.preventDefault()}>
                    Advanced stats

                  </a>
                </div>
              </CardFooter>
            </Card>
          </GridItem>


      <GridItem xs={12} sm={12} md={12}>
    Usage:
    </GridItem>
    <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>timeline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>used : RCSL Vesion 1.3</p>
                <h3 className={classes.cardTitle}>
                  15020<small>hits</small>
                </h3>
              </CardHeader>
         
            </Card>
          </GridItem>

          </GridContainer>





</div>)


    }}

export default withStyles(dashboardStyle)(Dashboard);