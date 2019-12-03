import React, { useContext, useMemo } from "react";
import { useImmerReducer } from "use-immer";

export const postJobReducer = (draft, action) => {
  switch (action.type) {
    case "setJobDescription": {
      draft.logo = action.payload.logo;
      draft.companyName = action.payload.companyName;
      draft.companyLocation = action.payload.companyLocation;
      draft.companyWebsite = action.payload.companyWebsite;
      draft.companyAbout = action.payload.companyAbout;
      draft.title = action.payload.title;
      draft.category = action.payload.category;
      draft.fullTimePosition = action.payload.fullTimePosition;
      draft.partTimePosition = action.payload.partTimePosition;
      draft.contractPosition = action.payload.contractPosition;
      draft.about = action.payload.about;
      draft.highlights = action.payload.highlights;
      draft.responsibilities = action.payload.responsibilities;
      draft.educationAndExperience = action.payload.educationAndExperience;
      draft.skills = action.payload.skills;
      draft.benefits = action.payload.benefits;
      draft.compensation = action.payload.compensation;
      draft.additionalInformation = action.payload.additionalInformation;
      return;
    }
    default:
      return;
  }
};

const initialState = {
  id: "draftJobPosting",
  date: "15 OCT",
  logo: "",
  companyName: "",
  companyLocation: "",
  companyWebsite: "",
  companyAbout: "",
  title: "",
  category: "",
  fullTimePosition: true,
  partTimePosition: false,
  contractPosition: false,
  about: "",
  highlights: [""],
  responsibilities: [""],
  educationAndExperience: [""],
  skills: [""],
  benefits: [""],
  compensation: [""],
  additionalInformation: ""
};

export const PostJobStateContext = React.createContext();
export const PostJobDispatchContext = React.createContext();

export const PostJobStateProvider = props => {
  const [state, dispatch] = useImmerReducer(postJobReducer, initialState);
  // const { username, password, isLoading, error, isLoggedIn } = state;

  return (
    <PostJobDispatchContext.Provider value={dispatch}>
      <PostJobStateContext.Provider value={state}>
        <React.Fragment>{props.children}</React.Fragment>
      </PostJobStateContext.Provider>
    </PostJobDispatchContext.Provider>
  );
};
