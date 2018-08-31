import React, { Component } from 'react'
import DropzoneComponent from 'react-dropzone-component';
import Button from 'components/CustomButtons/Button'
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import withStyles from "@material-ui/core/styles/withStyles";
import 'react-dropzone-component/styles/filepicker.css'
import { AppContext } from 'components/Context/AppProvider'

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
  },
  typography: {
    marginTop: "32px",
    paddingBottom: "10px",
    margin: theme.spacing.unit,
    display: 'inline-block',
    position: "relative"
  }

});

class Upload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      valid: true,
      name: "",
      version: 1,
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








    this.added = (file) => { this.setState({ visible: 'None', filesize: file.size, uploading: true }) }

    this.send = (file, xhr, formData) => {
      this.setState({ links: [] })

      let currentdate = new Date()
      let s = Date.now();
      s = s.toString()
      s = s + file.name

      let token = btoa(s)
      if (token.length < 25) {
        token = token.slice(8, 19)
      } else { token = token.slice(8, 24) }
      this.setState({ token: token })
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

    this.success = file => {
      console.log('uploaded', file);

      //this.props.ws.emit("fileuploaded", file.name ) 
      //TODO: add an event
      this.dropzone.removeFile(file);
    }

    this.removedfile = file => console.log('removing...', file);

    this.dropzone = null;
  }

  validateForm() {
    let errors = {}
    if (this.state.name === '') {
      errors = { ...errors, nameError: 'You must select a dataset !' }
      console.log("dataset not selected")
    }




    this.setState(errors)
    return false
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
            {this.state.valid ? <Button onClick={this.handlePost.bind(this)}>Start Upload</Button> : ""}
          </ul>
        </aside>

        <Card>
          <GridContainer>
            <GridItem xs={6} sm={6} md={3}>
              <Typography className={classes.typography}>Create new collection :</Typography>
            </GridItem>
            <GridItem xs={6} sm={6} md={3}>

              <TextField
                className={classes.textFields}
                label="name"
                id="name"
                onChange={this.handleChange('name')}
                formControlProps={{
                  fullWidth: true
                }} />
            </GridItem>
            <GridItem xs={6} sm={6} md={3}>
              <Typography className={classes.typography}>Or update existing :</Typography>
            </GridItem>

            <GridItem xs={6} sm={6} md={3}>
              <Typography className={classes.typography}>Select</Typography>
              <AppContext.Consumer>{context => this.context.rawdataCollections ?
                context.rawdataCollections.map(collection => <Typography>{collection}</Typography>) : ""}</AppContext.Consumer>
            </GridItem>




          </GridContainer></Card>


      </section >
    );
  }
}




export default withStyles(styles)(Upload)