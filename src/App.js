import React from "react";
import {
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes
} from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { purple } from "@material-ui/core/colors";
import Content from "./Components/Router";
import { UserStateProvider } from "./StateManagement/UserState";
import { PostJobStateProvider } from "./StateManagement/PostJobState";
import { PaymentStateProvider } from "./StateManagement/PaymentState";
import "./App.css";

let theme = createMuiTheme({
  overrides: {
    MuiListItemIcon: {
      root: {
        minWidth: 40
      }
    },
    MuiDrawer: {
      paper: {
        minWidth: 210
      }
    },
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
  status: {},
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
