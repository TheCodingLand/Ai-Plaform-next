import React from 'react'
import API_ROOT  from '../../appConfig'

export const UserContext = React.createContext()


export class UserProvider extends React.Component {
    constructor() {
        super()


        this.state = {
            
                name: "julien",
                erromsg:"",
                full_name: "",
                token:""
            

       

        }
        this.login = this.login.bind(this)

        /* this.getUserToken = (username, password) => {
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
        } */
        //this.login = (username, password) => {

            //return this.getUserToken(username, password)

        //}


    }
  

    login(creds) {
        console.log("logging user")
        fetch(`http://api.${API_ROOT}/auth/login`, {
          method: 'post',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
          body: JSON.stringify(creds)
          }).then(result => { if (!result.token) { this.setState({ erromsg:"invalid user of password"}) } else {
    
            this.setState({token:result.token, full_name :result.displayName })
            } })

        

    }
    render() {
        return (
            <UserContext.Provider value={{
                user: this.state,
                
                token: this.token,
                login : this.login
            }}
            >
                {this.props.children}

            </UserContext.Provider>
        )
    }
}

