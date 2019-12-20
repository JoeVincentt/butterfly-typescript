import React from "react";
import { useImmerReducer } from "use-immer";

export const paymentReducer = (draft, action) => {
  switch (action.type) {
    case "field": {
      draft[action.fieldName] = action.payload;
      return;
    }
    case "setPayment": {
      draft.companyName = action.payload.companyName;
      draft.firstName = action.payload.firstName;
      draft.lastName = action.payload.lastName;
      draft.email = action.payload.email;
      // draft.price = action.payload.price;
      return;
    }
    default:
      return;
  }
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  companyName: "",
  price: 119,
  basePrice: 0,
  paymentSuccess: false
};

export const PaymentStateContext = React.createContext();
export const PaymentDispatchContext = React.createContext();

export const PaymentStateProvider = props => {
  const [state, dispatch] = useImmerReducer(paymentReducer, initialState);
  // const { username, password, isLoading, error, isLoggedIn } = state;

  return (
    <PaymentDispatchContext.Provider value={dispatch}>
      <PaymentStateContext.Provider value={state}>
        <React.Fragment>{props.children}</React.Fragment>
      </PaymentStateContext.Provider>
    </PaymentDispatchContext.Provider>
  );
};
