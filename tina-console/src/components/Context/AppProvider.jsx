import React from 'react'
import axios from 'axios'

export const AppContext = React.createContext()


export class AppProvider extends React.Component {
    constructor() {
        super()

        this.state = {
            events: [],
            datasets: [],
            models: [],
            rawdataCollections: [],
            rawdataColumns: []
        }

    }
    getState() {
        this.state.models = this.get('ft', 'models')
        this.state.results = this.get('results', 'actions')
        this.state.datasets = this.get('ft', 'datasets')
        this.state.rawdataCollections = this.getCollections('rawdata')
    }
    getCollections(db) {
        let url = `http://rest.tina.ctg.lu/${db}/`
        let cols = []
        axios.get(url).then(res => {
            console.log(res.data._embedded)
            res.data._embedded.forEach((coll) => {
                cols.push(coll._id)
                url = `http://rest.tina.ctg.lu/${db}/${coll._id}/?pagesize=1&np`
                axios.get(url).then(res => {
                    console.log(res)
                    if (res.data.length > 0) {
                        let keys = Object.getOwnPropertyNames(res.data[0])
                        this.setState({ rawdataColumns: { [coll._id]: keys } })
                    }
                })


            }

            )
            this.setState({ rawdataCollections: cols })
        }

        )

    }
    componentWillMount() { this.getState() }
    get(db, coll) {
        let url = `http://rest.tina.ctg.lu/${db}/${coll}`

        axios.get(url).then(res => {
            console.log(res.data._embedded)
            this.setState({ [coll]: res.data._embedded })


        })

    }
    render() {

        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}

            </AppContext.Provider>

        )
    }
}
