import React from "react";
import axios from "axios";
import {API_ROOT, HTTPS} from "appConfig"
export const AppContext = React.createContext();

export class AppProvider extends React.Component {
  constructor() {
    super();

    this.state = {
      events: [],
      datasets: [],
      models: [],
      rawdataCollections: [],
      testedModels : [],
      rawdataColumns: [],
      actions: [],
      get: this.get.bind(this),
      getRawdataColumns: this.getRawdataColumns.bind(this),
      dashboardLoaded:false,
      getTestedModels: this.getTestedModels.bind(this)
    };
  }
  
  getState() {
    
   this.get("ft", "models").then(() => this.getTestedModels()).then(() => this.setState({dashboardLoaded: true}))
    this.get("results", "actions")
    this.get("ft", "datasets")
    this.getCollections("rawdata")
    
  }


  
  getModelResult(model) {
      
      
      let url = `${HTTPS}://rest.${API_ROOT}/results/actions/?filter={"data.model._id":{'$oid':'${model._id.$oid}'}}`

      return axios.get(url).then(res => {
        console.log(res);
        if (res.data._embedded.length > 0) {
          //Sort here ?
          
          return res.data._embedded[0]
        }
      }
    )


  }

  getTestedModels = () => {
    
    Promise.all(this.state.models.map(this.getModelResult)).then(models => this.setState({testedModels:models}))

    
  }

  getRawdataColumns(collectionName) {
    let url = `${HTTPS}://rest.${API_ROOT}/rawdata/${collectionName}/?pagesize=1&np`;
    axios.get(url).then(res => {
      //console.log(res);
      if (res.data.length > 0) {
        let keys = Object.getOwnPropertyNames(res.data[0]);
        
        return keys;
      }
    });
  }

  getCollections(db) {
    let url = `${HTTPS}://rest.${API_ROOT}/${db}/`;
    let cols = [];
    return axios.get(url).then(res => {
      //console.log(res.data._embedded);
      res.data._embedded.forEach(coll => {
        cols.push(coll._id);
        url = `${HTTPS}://rest.${API_ROOT}/${db}/${coll._id}/?pagesize=1&np`;
        axios.get(url).then(res => {
         // console.log(res);
          if (res.data.length > 0) {
            let keys = Object.getOwnPropertyNames(res.data[0]);
            this.setState({ rawdataColumns: { [coll._id]: keys } });
          }
        });
      });
      this.setState({ rawdataCollections: cols });
    });
  }
  componentWillMount() {
    this.getState();
  }
  get(db, coll) {
    let url = `${HTTPS}://rest.${API_ROOT}/${db}/${coll}`;

    return axios.get(url).then(res => {
      //console.log(res.data._embedded);
      this.setState({ [coll]: res.data._embedded });
    });
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
