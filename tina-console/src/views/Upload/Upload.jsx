import React, { Component } from 'react'
import DropzoneComponent from 'react-dropzone-component';
import Button from 'components/CustomButtons/Button'
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import API_ROOT from "appConfig"
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import withStyles from "@material-ui/core/styles/withStyles";
import 'react-dropzone-component/styles/filepicker.css'
import { AppContext } from 'components/Context/AppProvider'
import Card from "components/Card/Card.jsx"
import CardHeader from "components/Card/CardHeader.jsx"
import CardBody from "components/Card/CardBody.jsx"
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from "@material-ui/core/InputLabel"
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'

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
      type: '',
      dataCollectionErrorText: "",
      nameError: "",
      collection: "",
      uploadInProgress:false

    }
    this.validateForm = this.validateForm.bind(this)
    this.handlePost = this.handlePost.bind(this)
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
      postUrl: `http://upload.${API_ROOT}/uploadHandler`
    };



    this.added = (file) => { this.setState({ visible: 'None', filesize: file.size, uploading: true }) }

    this.send = (file, xhr, formData) => {
      this.setState({ links: [], uploadInProgress:true })

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
      formData.append('collection', this.state.collection)


      //localStorage.setItem(this.state)
    }



    // If you want to attach multiple callbacks, simply
    // create an array filled with all your callbacks.
    this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];

    // Simple callbacks work too, of course
    this.callback = () => console.log('Hello!');

    this.success = file => {
      console.log('uploaded', file);
      this.setState({uploadInProgress:false})
      //this.props.ws.emit("fileuploaded", file.name ) 
      //TODO: add an event
      this.dropzone.removeFile(file);
    }

    this.removedfile = file => console.log('removing...', file);

    this.dropzone = null;
  }

  validateForm = () => {
    let errors = {}
    let valid = true
    console.log("checking for errors")
    console.log(this.state.name)
    console.log(this.state.collection)
    if (this.state.name === '' && this.state.collection === '') {
      valid = false
      errors = { ...errors, dataCollectionErrorText: 'or select one !' }
      errors = { ...errors, nameError: 'you must name the collection' }
      console.log("dataset not selected")
    }
    if (valid === true) {
      this.setState({ dataCollectionErrorText: "", nameError: "" })
      return valid
    }
    else {
      this.setState(errors)
      return valid
    }
  }

  handlePost() {

    if (this.validateForm() === true) {
      this.dropzone.processQueue()
    }
    else {
      console.log("errors in form, check input")
    }
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

          </ul>
        </aside>


        <AppContext.Consumer>{context =>
          <Card>
            <CardHeader color="danger">
              <h4 className={classes.cardTitleWhite}>Data Import</h4>
              <p className={classes.cardCategoryWhite}></p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={6} sm={6} md={3}>
                  <Typography className={classes.typography}>Create new collection :</Typography>
                </GridItem>
                <GridItem xs={6} sm={6} md={3}>

                  <TextField
                    error={this.state.nameError !== ""}
                    helperText={this.state.nameError}
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
                <GridItem xs={12} sm={12} md={3}>
                  <FormControl className={classes.formControl} error={this.state.dataCollectionErrorText != ''}>
                    <InputLabel htmlFor="collection-id">Data Collection</InputLabel>
                    <Select
                      onChange={this.handleChange('collection')}
                      value={this.state.collection}
                      input={<Input name="collection" id="collection-id" />}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {context.rawdataCollections ?
                        context.rawdataCollections.map((collection) => {
                          return (
                            <MenuItem key={collection} value={collection}>
                              <em>{collection}</em>
                            </MenuItem>)
                        })
                        : ""}
                    </Select>
                    <FormHelperText>{this.state.dataCollectionErrorText}</FormHelperText>
                  </FormControl>
                </GridItem>
                <GridItem xs={6} sm={6} md={3}>
                  <Button disabled={this.state.uploadInProgress} color="danger" onClick={this.handlePost}>Start Upload</Button>
                </GridItem>

              </GridContainer>
            </CardBody>
          </Card>
        }</AppContext.Consumer>


      </section >
    );
  }
}




export default withStyles(styles)(Upload)