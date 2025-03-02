import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  makeStyles,
} from "@material-ui/core";
import Home from "./components/Home";
import Room from "./components/Room";
import Footer from "./components/Footer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
}));

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className={classes.root}>
          <main className={classes.main}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/room/:roomId" component={Room} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
