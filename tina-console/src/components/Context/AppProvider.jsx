import React from 'react'
import axios from axios

export const AppContext = React.createContext()


class AppProvider extends React.Component {
    constructor() {
        super()
    
        this.state = {
            events : [],
            datasets : [],
            models : []
        }
    }
    getState() {
        this.state.models=this.get('ft','models')
        this.state.datasets=this.get('ft','datasets')
    }
    
    get(coll,item) {
        let url = `http://rest.tina.ctg.lu/${coll}/${item}`
        axios.get(url).then(res => { this.setState({ [item] :res })

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
    