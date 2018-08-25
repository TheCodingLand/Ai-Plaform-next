import React, { Component } from 'react'
import DropzoneComponent from 'react-dropzone-component';
import Button from 'components/CustomButtons/Button'
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CustomInput from 'components/CustomInput/CustomInput'
import InputLabel from "@material-ui/core/InputLabel";
import withStyles from "@material-ui/core/styles/withStyles";
import 'react-dropzone-component/styles/filepicker.css'

const styles = theme => ({
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none"
    },
  
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120,
      marginTop: "27px",
    },
    sliders: {
      paddingBottom: "10px",
      margin: theme.spacing.unit,
  
      position: "relative"
    },
    textFields: {
      paddingBottom: "10px",
      margin: theme.spacing.unit,
  
      position: "relative"
    }
  
  });

class Upload extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            valid:true,
            name : "",
            version:1,
            type: ''
        }

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true,
            maxFilesize: 50000,
            autoProcessQueue: false
        };

        this.componentConfig = {
            iconFiletypes: [],
            showFiletypeIcon: false,
            postUrl: 'http://upload.tina.ctg.lu/uploadHandler'
        };








        this.added = (file) => {this.setState({visible:'None', filesize:file.size, uploading:true})} 
        
        this.send = (file, xhr, formData) => {
        this.setState({links:[]})
        
        let currentdate = new Date()
        let s = Date.now();
        s = s.toString()
        s = s + file.name

        let token = btoa(s)
        if (token.length<25){
        token = token.slice(8,19)
    }   else{token = token.slice(8,24)}
        this.setState({token:token})
        formData.append('token', token)
        formData.append('name', this.state.name)
        formData.append('type', 'dataset')
        formData.append('version', this.state.version)
        //localStorage.setItem(this.state)
    }










    



        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];

        // Simple callbacks work too, of course
        this.callback = () => console.log('Hello!');

        this.success = file => { console.log('uploaded', file);
        
        //this.props.ws.emit("fileuploaded", file.name ) 
        //TODO: add an event
        this.dropzone.removeFile(file);    
    }

        this.removedfile = file => console.log('removing...', file);

        this.dropzone = null;
    }


    handlePost() {
        this.dropzone.processQueue();
    }


    handleChange = name => event => {
        
          this.setState({ [name]: event.target.value });
        //else if (name==="datasetname") {}
      };

    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;
        const { classes } = this.props;
        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            drop: this.callbackArray,
            addedfile: this.added,
            success: this.success,
            removedfile: this.removedfile,
            sending: this.send
        }

        


            return (
              <section>
                <div className="dropzone" >
                  <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig}></DropzoneComponent>
         
                </div>
                <aside>
                  <ul>
                    {this.state.valid ? <Button onClick={this.handlePost.bind(this)}>Start Upload</Button> :""}
                  </ul>
                </aside>
                <Card>
                    <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
              <CustomInput
                className={classes.textFields}
                labelText="name"
                id="name"
                onChange={this.handleChange('name')}
                formControlProps={{
                  fullWidth: true
                }}/>
                <CustomInput
                className={classes.textFields}
                labelText="version"
                id="version"
                onChange={this.handleChange('version')}
                formControlProps={{
                  fullWidth: true
                }}/>
                <CustomInput
                className={classes.textFields}
                labelText="type"
                id="type"
                onChange={this.handleChange('type')}
                formControlProps={{
                  fullWidth: true
                }}/>
              
              </GridItem></GridContainer></Card>


              </section>
            );
          }
        }
        
    


export default withStyles(styles)(Upload)