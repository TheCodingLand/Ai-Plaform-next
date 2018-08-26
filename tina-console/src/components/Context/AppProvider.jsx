import React from 'react'
import axios from 'axios'

export const AppContext = React.createContext()


export class AppProvider extends React.Component {
    constructor() {
        super()
    
        this.state = {
            events : [],
            datasets : [],
            models : []
        }
        this.getState()
    }
    getState() {
        this.state.models=this.get('ft','models')
        this.state.datasets=this.get('ft','datasets')
    }
    
    get(db,coll) {
        let url = `http://rest.tina.ctg.lu/${db}/${coll}`
        
            axios.get(url).then(res => {  console.log(res.data._embedded)
            this.setState({ [coll] : res.data._embedded })
        

        })
    
    }
    render () {
        
        return (
            <AppContext.Provider value={this.state}>
            {this.props.children}

            </AppContext.Provider>
           
        )
    }
}
    