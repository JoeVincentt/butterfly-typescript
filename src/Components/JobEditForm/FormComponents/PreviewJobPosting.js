import React, { useContext, useEffect, useState } from "react";
import { LinearProgress } from "@material-ui/core";

import {
  // PostJobDispatchContext,
  EditJobStateContext
} from "../../../StateManagement/EditJobState";
import JobDescriptionPage from "../../JobDescriptionPage/JobDescriptionPage";

const PreviewJobEditing = job => {
  const [loading, setLoading] = useState(true);
  //Use context
  const state = useContext(EditJobStateContext);
  // const dispatch = useContext(EditJobDispatchContext);

  useEffect(() => {
    setLoading(false);
  }, []);

  // return <div>preview</div>;
  if (loading) {
    return <LinearProgress />;
  } else {
    return <JobDescriptionPage job={state} />;
  }
};

export default PreviewJobEditing;
