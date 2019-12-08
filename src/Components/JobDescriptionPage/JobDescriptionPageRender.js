import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { withRouter } from "react-router-dom";
import JobDescriptionPage from "./JobDescriptionPage";
import ButterflyLoader from "../Loader/ButterflyLoader";

const JobDescriptionPageRender = props => {
  const db = firebase.firestore();

  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log(props.match.params.id);
    if (props.match.params.id !== null) {
      getJobDescription();
    }
    //need to fetch job description from the database
  }, []);

  const getJobDescription = () => {
    const id = props.match.params.id.toString();
    // console.log(id);
    db.collection("jobs")
      .where("id", "==", id)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          // Contents of first document
          // console.log(querySnapshot.docs[0].data());
          setJob(querySnapshot.docs[0].data());
          setLoading(false);
        } else {
          // console.log("No such document!");
        }
      })
      .catch(error => {
        // console.log("Error getting document:", error);
      });
  };

  if (loading) {
    return <ButterflyLoader />;
  } else {
    return <JobDescriptionPage job={job} />;
  }
};

export default withRouter(JobDescriptionPageRender);
