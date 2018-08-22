import React from 'react'


const DatasetsContext = React.createContext()


class DatasetsProvider extends React.Component {
    constructor() {
        super()

    
    state = {
        Datasets : []
    }
}

    update = (websocket) =>{ 
        console.log("updating Datasetss")

      }
    render () {
        return (
            <DatasetsContext.Provider value = {{
                Datasets : this.state.Datasets,
                update: this.update,
                


            }}
            >
            {this.props.children}

            </DatasetsContext.Provider>
        )
    }
}

export default DatasetsProvider