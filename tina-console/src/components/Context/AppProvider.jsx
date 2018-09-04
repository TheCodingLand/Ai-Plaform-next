import React from "react";
import axios from "axios";
import API_ROOT from "appConfig"
export const AppContext = React.createContext();

export class AppProvider extends React.Component {
  constructor() {
    super();

    this.state = {
      events: [],
      datasets: [],
      models: [],
      rawdataCollections: [],
      rawdataColumns: [],
      actions: [],
      get: this.get.bind(this),
      getRawdataColumns: this.getRawdataColumns.bind(this)
    };
  }
  getState() {
    this.get("ft", "models");
    this.get("results", "actions");
    this.get("ft", "datasets");
    this.getCollections("rawdata");
  }
  getRawdataColumns(collectionName) {
    let url = `http://rest.${API_ROOT}/rawdata/${collectionName}/?pagesize=1&np`;
    axios.get(url).then(res => {
      console.log(res);
      if (res.data.length > 0) {
        let keys = Object.getOwnPropertyNames(res.data[0]);

        return keys;
      }
    });
  }

  getCollections(db) {
    let url = `http://rest.${API_ROOT}/${db}/`;
    let cols = [];
    axios.get(url).then(res => {
      console.log(res.data._embedded);
      res.data._embedded.forEach(coll => {
        cols.push(coll._id);
        url = `http://rest.${API_ROOT}/${db}/${coll._id}/?pagesize=1&np`;
        axios.get(url).then(res => {
          console.log(res);
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
    let url = `http://rest.${API_ROOT}/${db}/${coll}`;

    axios.get(url).then(res => {
      console.log(res.data._embedded);
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
