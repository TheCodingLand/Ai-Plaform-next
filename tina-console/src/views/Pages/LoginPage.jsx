import React from "react";
import PropTypes from "prop-types";
import {Redirect } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from '@material-ui/core/CircularProgress';
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import LockOutline from "@material-ui/icons/LockOutlined";
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import {UserContext} from 'components/Context/UserProvider'
import loginPageStyle from "assets/jss/ctg-ai-lab/views/loginPageStyle.jsx";
import { Typography, TextField } from "@material-ui/core";


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      username:"",
      password:"",
      email:"",
      loggingIn:false,
      erromsg:"",
      full_name: "",
      showPassword: false,
    };
  }
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };


  login = (context) => {
    context.login({username: this.state.username, password : this.state.password} )
    //this.setState({loggingIn:true})
    //context.login(this.state.username,this.state.password).then((token) => this.props.history.push("/dashboard"))
  }

  handleChange = (name) => event => {
    
    this.setState({ [name]: event.target.value });
    

  }
  
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  _handleKeyPress = (context) => (e) => {
    if (e.key === 'Enter') {
      this.login(context)
    }
  }

  render() {
    const { classes } = this.props;
    return (
      
      <div className={classes.content}>
        <div className={classes.container}>
        <UserContext.Consumer>{ context => 
          context.authenticated ? <Redirect from='/pages/login' to='/Dashboard' /> :
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <form>
                <Card className={classes[this.state.cardAnimaton]}>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                    color="ctg"
                  >
                    <h5 className={classes.cardTitle}>Log in With your Windows account</h5>
                    <div className={classes.socialLine}>
                      {[
                        "fab fa-windows"
                      ].map((prop, key) => {
                        return (
                          <Button
                          
                            
                            color="transparent"
                            justIcon
                            key={key}
                            className={classes.customButtonClass}
                          >
                            <i className={prop} />
                          </Button>
                        );
                      })}
                    </div>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText="Username.."
                      id="username"
                      onChange={this.handleChange('username')}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Face className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      onKeyPress={this._handleKeyPress(context)} 
                      type={this.state.showPassword ? 'text' : 'password'}
                      id="password"
                      onChange={this.handleChange('password')}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton className={classes.iconButton}
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                >
                  {this.state.showPassword ? <VisibilityOff className={classes.inputAdornmentIcon} /> : <Visibility className={classes.inputAdornmentIcon} />}
                </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                    <Typography className={classes.error}>{context.errormsg}</Typography>
                  </CardBody>
                  

                  <CardFooter className={classes.justifyContentCenter}>
                  
                  {this.state.loggingIn ?<CircularProgress size={50} />:
                    
                    <Button disabled={this.state.loggingIn} onClick={() => this.login(context)} color="rose" simple size="lg" block>
                      Let's Go
                    </Button>}
                  </CardFooter>
                  
                </Card>
              </form>
            </GridItem>
          </GridContainer>
          }
          </UserContext.Consumer>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(loginPageStyle)(LoginPage);
