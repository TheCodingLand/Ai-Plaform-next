import React from 'react'


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

    render () {
        
        return (
            <AppContext.Provider value={this.state}>
            {this.props.children}

            </AppContext.Provider>
           
        )
    }
}
    