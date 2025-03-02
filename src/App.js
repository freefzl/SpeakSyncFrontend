import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container, CssBaseline } from "@material-ui/core";
import Home from "./components/Home";
import Room from "./components/Room";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="md">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/room/:roomId" component={Room} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
