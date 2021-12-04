import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Home from "./Components/Home";

class App extends Component {
  render() {
    return (
        <div>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home} />
            </Switch>
          </BrowserRouter>
        </div>
    );
  }
}
export default App;