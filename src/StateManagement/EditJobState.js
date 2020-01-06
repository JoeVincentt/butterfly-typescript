import React from "react";
import { useImmerReducer } from "use-immer";
import { convertTimestamp } from "../Components/utils/convertTimestamp";

export const editJobReducer = (draft, action) => {
  switch (action.type) {
    case "field": {
      draft[action.fieldName] = action.payload;
      return;
    }
    case "setJobDescription": {
      draft.date = action.payload.date;
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
      draft.requirements = action.payload.requirements;
      draft.responsibilities = action.payload.responsibilities;
      draft.educationAndExperience = action.payload.educationAndExperience;
      draft.skills = action.payload.skills;
      draft.compensationAndBenefits = action.payload.compensationAndBenefits;
      draft.additionalInformation = action.payload.additionalInformation;
      draft.externalJobPostingLink = action.payload.externalJobPostingLink;
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
      draft.requirements = [""];
      draft.responsibilities = [""];
      draft.educationAndExperience = [""];
      draft.skills = [""];
      draft.compensationAndBenefits = [""];
      draft.additionalInformation = "";
      draft.externalJobPostingLink = "";
      return;
    }
    default:
      return;
  }
};

const initialState = {
  id: "draftJobPosting",
  date: convertTimestamp(Date.now()),
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
  requirements: [""],
  responsibilities: [""],
  educationAndExperience: [""],
  skills: [""],
  compensationAndBenefits: [""],
  additionalInformation: "",
  externalJobPostingLink: ""
};

export const EditJobStateContext = React.createContext();
export const EditJobDispatchContext = React.createContext();

export const EditJobStateProvider = props => {
  const [state, dispatch] = useImmerReducer(editJobReducer, initialState);
  // const { username, password, isLoading, error, isLoggedIn } = state;

  return (
    <EditJobDispatchContext.Provider value={dispatch}>
      <EditJobStateContext.Provider value={state}>
        <React.Fragment>{props.children}</React.Fragment>
      </EditJobStateContext.Provider>
    </EditJobDispatchContext.Provider>
  );
};
