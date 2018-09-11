import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { AppProvider } from "components/Context/AppProvider";
import EventsProvider from "components/Context/EventsProvider";
import "assets/css/ctg-ai-lab.css?v=1.4.0";
import { UserContext, UserProvider } from "components/Context/UserProvider";
import indexRoutes from "routes/index.jsx";
//import websocket from 'components/Context/socket'

import {
  SocketContext,
  SocketProvider
} from "./components/Context/SocketProvider";

//const socket = websocket()
//console.log(socket)

const hist = createBrowserHistory();

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <UserContext.Consumer>
    {user => (
      <Route
        {...rest}
        render={props => (
          //user.authenticated === true
          //?
          <Component {...props} />
          //  :
          //<Redirect to='/pages/login-page' />
        )}
      />
    )}
  </UserContext.Consumer>
);

ReactDOM.render(
  <SocketProvider>
    <SocketContext.Consumer>
      {socket => (
        <UserProvider>
          <AppProvider>
            <EventsProvider websocket={socket.socket}>
              <Router history={hist}>
                <Switch>
                  {indexRoutes.map((prop, key) => {
                    if (prop.path === "/pages") {
                      console.log("found route login-page");
                      return (
                        <Route
                          path={prop.path}
                          component={prop.component}
                          key={key}
                        />
                      );
                    } else {
                      return (
                        <PrivateRoute
                          path={prop.path}
                          component={prop.component}
                          key={key}
                        />
                      );
                    }
                  })}
                </Switch>
              </Router>
            </EventsProvider>
          </AppProvider>
        </UserProvider>
      )}
    </SocketContext.Consumer>
  </SocketProvider>,

  document.getElementById("root")
);
