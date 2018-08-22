import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import Grid from '@material-ui/core/Grid';
import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import monitoringStyle from "assets/jss/ctg-ai-lab/components/monitoringStyle";
import Typography from "@material-ui/core/Typography";
import Context from 'components/Context/Context'

class Monitoring extends React.Component {
    
    constructor(){
        super()
    this.messages = [{ name: "training event", text : "training finished at : 15h00"},{ name: "training event", text : "training finished at : 15h00"},{name: "training event", text : "training finished at : 15h00"},{ name: "training event", text : "training finished at : 15h00"},{name: "training event", text : "training finished at : 15h00"},{ name: "training event", text : "training finished at : 15h00"}]
}
    
    render() { 

        const { classes } = this.props;
        return (
         <Context.Consumer>{ websocket => 
        
        
        <GridContainer>
           <GridItem xs={12} sm={12} md={12}>
            <Typography className={classes.block}>Last Events :</Typography>
            </GridItem>
        
            <Paper xs={12} sm={12} md={12} className={classes.terminal}>
            <GridItem xs={12} sm={12} md={12}> 
        

        <List className={classes.list}>      
            <GridContainer justify="space-evenly">
            <GridItem >
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                TASK NAME :
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem >
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                STARTED :
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem >
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
               FINISHED :
              </Typography>
            </ListItem>
            </GridItem>
            </GridContainer>
           </List>
            
            </GridItem>
            {websocket.tasks.slice(0,5).map((task) => {
                return (
            <GridItem key={task.taskProperties.key} xs={12} sm={12} md={12}>  
             <List className={classes.list}>      
             <GridContainer justify="space-evenly">
            <GridItem>
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                {task.name}
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem>

            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                {task.taskProperties.started}test
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem>

            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                {task.taskProperties.finished}test
              </Typography>
            </ListItem>
            </GridItem>
            </GridContainer>

            </List>
            </GridItem>
            
        ) })
            }
            </Paper>




            <GridItem xs={12} sm={12} md={12}>
            <Typography className={classes.block}>Last Login events :</Typography>
            </GridItem>
        
            <Paper xs={12} sm={12} md={12} className={classes.terminal}>
            <GridItem xs={12} sm={12} md={12}> 
        

        <List className={classes.list}>      
        <GridContainer justify="space-evenly">

             <GridItem xs={4} sm={4} md={4}>
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                ERROR :
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                MESSAGE :
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
               DATETIME :
              </Typography>
            </ListItem>
            </GridItem>
            </GridContainer>
           </List>
            
            </GridItem>
            {websocket.errors.slice(0,5).map((error) => {
                return (
            <GridItem key={error.taskProperties.key} xs={12} sm={12} md={12}>  
             <List className={classes.list}>      
             <GridContainer justify="space-evenly">
              <GridItem xs={4} sm={4} md={4}>
            
          
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                {error.name}
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
            
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                {error.taskProperties.started}
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                {error.taskProperties.finished}
              </Typography>
            </ListItem>
            </GridItem>
            </GridContainer>
            </List>
            </GridItem>
            
        ) })
            }
            </Paper>

            <GridItem xs={12} sm={12} md={12}>
            <Typography className={classes.block}>Last Events :</Typography>
            </GridItem>
        
            <Paper xs={12} sm={12} md={12} className={classes.terminal}>
            <GridItem xs={12} sm={12} md={12}> 
        

        <List className={classes.list}>      
        <GridContainer justify="space-evenly">

             <GridItem xs={4} sm={4} md={4}>
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                ACTION :
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                USERNAME :
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
               PASSWORD :
              </Typography>
            </ListItem>
            </GridItem>
            </GridContainer>
           </List>
            
            </GridItem>
            {websocket.logins.slice(0,5).map((login) => {
                return (
            <GridItem key={login.taskProperties.key} xs={12} sm={12} md={12}>  
             <List className={classes.list}>      
             <GridContainer justify="space-evenly">
              <GridItem xs={4} sm={4} md={4}>
            
          
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                {login.action}
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
            
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                {login.taskProperties.username}
              </Typography>
            </ListItem>
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
            <ListItem className={classes.inlineBlock}>
              <Typography className={classes.terminalText}>
                {login.taskProperties.password}
              </Typography>
            </ListItem>
            </GridItem>
            </GridContainer>
            </List>
            </GridItem>
            
        ) })
            }
            </Paper>














             </GridContainer>







         }
           </Context.Consumer>
            
            
          
        )  
        }
    }

export default withStyles(monitoringStyle)(Monitoring);