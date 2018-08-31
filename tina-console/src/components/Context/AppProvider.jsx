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
            rawdataColumns: [],
            results: []
        }

    }
    getState() {
        this.setState({ models: this.get('ft', 'models') })
        this.setState({ result: this.get('results', 'actions') })
        this.setState({ datasets: this.get('ft', 'datasets') })
        this.setState({ rawdataCollections: this.getCollections('rawdata') })
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
