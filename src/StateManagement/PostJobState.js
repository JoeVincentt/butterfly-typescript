import React from "react";
import { useImmerReducer } from "use-immer";
import { convertTimestamp } from "../Components/utils/convertTimestamp";

export const postJobReducer = (draft, action) => {
  switch (action.type) {
    case "field": {
      draft[action.fieldName] = action.payload;
      return;
    }
    case "setJobDescription": {
      draft.logo = action.payload.logo;
      draft.companyName = action.payload.companyName;
      draft.companyLocation = action.payload.companyLocation;
      draft.companyWebsite = action.payload.companyWebsite;
      draft.companyAbout = action.payload.companyAbout;
      draft.title = action.payload.title;
      draft.category = action.payload.category;
      draft.jobType = action.payload.jobType;
      draft.about = action.payload.about;
      draft.hiringProcessSteps = action.payload.hiringProcessSteps;
      draft.responsibilities = action.payload.responsibilities;
      draft.educationAndExperience = action.payload.educationAndExperience;
      draft.skills = action.payload.skills;
      draft.compensationAndBenefits = action.payload.compensationAndBenefits;
      draft.additionalInformation = action.payload.additionalInformation;
      return;
    }
    case "resetJobDescription": {
      draft.logo = "";
      draft.companyName = "";
      draft.companyLocation = "";
      draft.companyWebsite = "";
      draft.companyAbout = "";
      draft.title = "";
      draft.category = "";
      draft.jobType = "Full-Time";
      draft.about = "";
      draft.responsibilities = [""];
      draft.educationAndExperience = [""];
      draft.skills = [""];
      draft.compensationAndBenefits = [""];
      draft.additionalInformation = "";
      return;
    }
    default:
      return;
  }
};

const initialState = {
  id: "draftJobPosting",
  date: convertTimestamp(Date.now()),
  advertisementPlan: "Marathon",
  logo: "",
  companyName: "",
  companyLocation: "",
  companyWebsite: "",
  companyAbout: "",
  title: "",
  category: "",
  jobType: "Full-Time",
  about: "",
  hiringProcessSteps: [""],
  responsibilities: [""],
  educationAndExperience: [""],
  skills: [""],
  compensationAndBenefits: [""],
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
