import React from "react";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
  responsiveFontSizes
} from "@material-ui/core/styles";
import { orange, purple } from "@material-ui/core/colors";
import Content from "./Components/Content";
import { UserStateProvider } from "./StateManagement/UserState";
import "./App.css";

let theme = createMuiTheme({
  palette: {
    primary: purple
  },
  status: {
    danger: orange[500]
  },
  typography: {}
});

theme = responsiveFontSizes(theme);

const App = props => {
  return (
    <ThemeProvider theme={theme}>
      <UserStateProvider>
        <Content />
      </UserStateProvider>
    </ThemeProvider>
  );
};

export default App;
