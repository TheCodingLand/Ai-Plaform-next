import React from 'react'


export const UserContext = React.createContext()


export class UserProvider extends React.Component {
    constructor() {
        super()


        this.state = {
            user: {
                name: "julien"
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
    auth = () => {
    
        fetch(`http://auth.${API_ROOT}/authenticate`, {
          method: 'post',
          body: JSON.stringify({username: this.state.username, password:this.state.password})
          }).then(result => this.authResult(result))
        
      }
    
    authResult= (result) => { if (!result.token) { this.setState({ erromsg:"invalid user of password"}) } else {
    
    this.setState({token:result.token, full_name :result.full_name })
    } }

    login = (socket) => {
        console.log("loggingin User")
        

    }
    render() {
        return (
            <UserContext.Provider value={{
                user: this.state.user,
                update: this.update,
            }}
            >
                {this.props.children}

            </UserContext.Provider>
        )
    }
}

