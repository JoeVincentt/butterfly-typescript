import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserStateContext } from "../../StateManagement/UserState";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useContext(UserStateContext);
  return (
    <Route
      {...rest}
      render={props => {
        if (isLoggedIn) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/sign-in",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};
