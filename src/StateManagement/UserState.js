import React from "react";
import { useImmerReducer } from "use-immer";

export const loginReducer = (draft, action) => {
  switch (action.type) {
    case "field": {
      draft[action.fieldName] = action.payload;
      draft.modified = true;
      return;
    }
    case "login": {
      draft.isLoggedIn = true;
      draft.modified = false;
      draft.uid = action.payload.uid;
      draft.firstName = action.payload.firstName;
      draft.lastName = action.payload.lastName;
      draft.email = action.payload.email;
      draft.country = action.payload.country;
      draft.zipCode = action.payload.zipCode;
      draft.currentCareerLevel = action.payload.currentCareerLevel;
      draft.resume = action.payload.resume;
      return;
    }
    case "logOut": {
      draft.isLoggedIn = false;
      draft.modified = false;
      draft.uid = "";
      draft.firstName = "";
      draft.lastName = "";
      draft.email = "";
      draft.country = "";
      draft.zipCode = "";
      draft.currentCareerLevel = "";
      draft.resume = "";
      return;
    }
    default:
      return;
  }
};

const initialState = {
  isLoggedIn: true,
  modified: false,
  uid: "uid",
  firstName: "testName",
  lastName: "testLastName",
  email: "test@test.com",
  country: "",
  zipCode: "",
  currentCareerLevel: "",
  resume: ""
};

export const UserStateContext = React.createContext();
export const UserDispatchContext = React.createContext();

export const UserStateProvider = props => {
  const [state, dispatch] = useImmerReducer(loginReducer, initialState);
  // const { username, password, isLoading, error, isLoggedIn } = state;

  return (
    <UserDispatchContext.Provider value={dispatch}>
      <UserStateContext.Provider value={state}>
        <React.Fragment>{props.children}</React.Fragment>
      </UserStateContext.Provider>
    </UserDispatchContext.Provider>
  );
};

// function LoginUseContext() {
//   const [state, dispatch] = useImmerReducer(loginReducer, initialState);
//   const { username, password, isLoading, error, isLoggedIn } = state;

//   const onSubmit = async e => {
//     e.preventDefault();

//     dispatch({ type: "login" });

//     try {
//       await login({ username, password });
//       dispatch({ type: "success" });
//     } catch (error) {
//       dispatch({ type: "error" });
//     }
//   };

//   return (
//     <DispatchContext.Provider value={dispatch}>
//       <StateContext.Provider value={state}>
//         <div className="App useContext">
//           <div className="login-container">
//             {isLoggedIn ? (
//               <>
//                 <h1>Welcome {username}!</h1>
//                 <button onClick={() => dispatch({ type: "logOut" })}>
//                   Log Out
//                 </button>
//               </>
//             ) : (
//               <form className="form" onSubmit={onSubmit}>
//                 {error && <p className="error">{error}</p>}
//                 <p>Please Login!</p>
//                 <input
//                   type="text"
//                   placeholder="username"
//                   value={username}
//                   onChange={e =>
//                     dispatch({
//                       type: "field",
//                       fieldName: "username",
//                       payload: e.currentTarget.value
//                     })
//                   }
//                 />
//                 <input
//                   type="password"
//                   placeholder="password"
//                   autoComplete="new-password"
//                   value={password}
//                   onChange={e =>
//                     dispatch({
//                       type: "field",
//                       fieldName: "password",
//                       payload: e.currentTarget.value
//                     })
//                   }
//                 />
//                 <button className="submit" type="submit" disabled={isLoading}>
//                   {isLoading ? "Logging in..." : "Log In"}
//                 </button>
//               </form>
//             )}
//           </div>

//           <TodoPage todos={todos} />
//         </div>
//       </StateContext.Provider>
//     </DispatchContext.Provider>
//   );
// }

// function TodoPage({ todos }) {
//   return (
//     <div className="todoContainer">
//       <h2>Todos</h2>
//       {todos.map(item => (
//         <TodoItem key={item.title} {...item} />
//       ))}
//     </div>
//   );
// }

// function TodoItem({ title, completed }) {
//   const dispatch = useContext(DispatchContext);
//   const state = useContext(StateContext);
//   // const { isLoggedIn } = state;
//   const isLoggedIn = true;
//   return (
//     <div className="todoItem">
//       <p>{title}</p>
//       <div>
//         <input
//           type="checkbox"
//           checked={completed}
//           onClick={() => {
//             if (!isLoggedIn) {
//               alert("Please login to click this!");
//             }
//           }}
//           onChange={() => {
//             if (isLoggedIn) {
//               dispatch({ type: "toggleTodoCompleted", payload: title });
//             }
//           }}
//         />
//       </div>
//     </div>
//   );
// }
