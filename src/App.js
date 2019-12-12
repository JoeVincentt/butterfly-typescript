import React from "react";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
  responsiveFontSizes
} from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { orange, purple } from "@material-ui/core/colors";
import Content from "./Components/Content";
import { UserStateProvider } from "./StateManagement/UserState";
import { PostJobStateProvider } from "./StateManagement/PostJobState";
import { PaymentStateProvider } from "./StateManagement/PaymentState";
import "./App.css";

let theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      elevation1: {
        boxShadow:
          "0px 2px 1px -1px #9c27b030, 0px 0px 1px 0px #9c27b030, 0px 1px 4px 0px #9c27b030"
      }
    }
  },
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
      <SnackbarProvider maxSnack={4}>
        <UserStateProvider>
          <PostJobStateProvider>
            <PaymentStateProvider>
              <Content />
            </PaymentStateProvider>
          </PostJobStateProvider>
        </UserStateProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
