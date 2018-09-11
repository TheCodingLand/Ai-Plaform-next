import React from 'react'
import API_ROOT  from '../../appConfig'

export const UserContext = React.createContext()


export class UserProvider extends React.Component {
    constructor() {
        super()


        this.state = {
            user: {
                name: "julien",
                erromsg:"",
                full_name: "",
                token:""
                

            }


        }

        this.getUserToken = (username, password) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("getting user token")
                    let o = { action: "login", username: username, password: password }
                    this.sendObject(o)
                    this.setState({ user: username, password: password, authenticated: true })
                    let token = "uyuierytt5454er4t"

                    resolve(token)
                }, 2000);
            })
        }
        this.login = (username, password) => {

            return this.getUserToken(username, password)

        }


    }
  

    login = (creds) => {
        console.log("logging user")
        fetch(`http://auth.${API_ROOT}/authenticate`, {
          method: 'post',
          body: JSON.stringify(creds)
          }).then(result => { if (!result.token) { this.setState({ erromsg:"invalid user of password"}) } else {
    
            this.setState({token:result.token, full_name :result.full_name })
            } })

        

    }
    render() {
        return (
            <UserContext.Provider value={{
                user: this.state.user,
                full_name:this.state.full_name,
                token: this.token,
                login : this.login
            }}
            >
                {this.props.children}

            </UserContext.Provider>
        )
    }
}

