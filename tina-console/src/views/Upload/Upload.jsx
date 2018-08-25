import React, { Component } from 'react'
import DropzoneComponent from 'react-dropzone-component';
import Button from 'components/CustomButtons/Button'
import 'react-dropzone-component/styles/filepicker.css'


export default class Upload extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            datasetname: "",
            valid:true
        }

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: "*.*",
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



    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;

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
              </section>
            );
          }
        }
        
    


