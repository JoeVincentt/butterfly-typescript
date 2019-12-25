import React, { useEffect, useState, useContext } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { withRouter } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";

import ApplicantsList from "./ApplicantsList";
import { UserStateContext } from "../../../StateManagement/UserState";

const ApplicationListRender = props => {
  const db = firebase.firestore();
  const state = useContext(UserStateContext);
  const [rows, setRow] = useState([]);
  const [loading, setLoading] = useState(true);

  //fetch applicants
  useEffect(() => {
    if (props.match.params.jobID !== null) {
      fetchApplicants();
      console.log(props.match.params);
    }
  }, []);

  const fetchApplicants = () => {
    const id = props.match.params.jobID.toString();
    let newRows = [];
    db.collection("applications-employer")
      .doc(state.uid)
      .collection("applications")
      .where("jobID", "==", `${id}`)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          const data = doc.data();
          newRows.push(
            createData(
              data.id,
              data.jobID,
              `${data.firstName} ${data.lastName}`,
              data.jobTitle,
              data.companyName,
              data.country,
              data.zipCode,
              data.timezone,
              data.yearsOfExperience,
              data.email,
              data.date,
              data.status,
              data.resume
            )
          );
        });
      })
      .then(() => {
        setRow(newRows);
        setLoading(false);
      })
      .catch(function(error) {
        setLoading(false);
        console.log("Error getting document:", error);
      });
  };

  const createData = (
    id,
    jobID,
    candidateName,
    appliedFor,
    company,
    country,
    zipCode,
    timezone,
    yearsOfExperience,
    email,
    date,
    status,
    resume
  ) => {
    return {
      id,
      jobID,
      candidateName,
      appliedFor,
      company,
      country,
      zipCode,
      timezone,
      yearsOfExperience,
      email,
      date,
      status,
      resume
    };
  };

  if (loading) {
    return <LinearProgress />;
  } else {
    return <ApplicantsList rows={rows} />;
  }
};

export default withRouter(ApplicationListRender);
