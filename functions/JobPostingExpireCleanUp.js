exports.jobPostingExpireCleanUp = async function(request, response, admin) {
  const db = admin.firestore();

  function calculateExpiration(planName, date) {
    if (planName === "Marathon") {
      return date + 3925743000;
      // return date + 86400000;
    }
    if (planName === "Mid-range") {
      return date + 2629743000;
      // return date + 86400000;
    }
    if (planName === "Sprint") {
      return date + 1296000000;
      // return date + 86400000;
    }
  }

  async function updateDocuments(id, postedBy) {
    try {
      await db
        .collection("jobs")
        .doc(id)
        .update({
          status: "expired"
        });
      await db
        .collection("jobStats")
        .doc(postedBy)
        .collection("jobStats")
        .doc(id)
        .update({
          status: "expired"
        });
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  try {
    const documents = await db
      .collection("jobs")
      .where("status", "==", "active")
      .get();
    documents.forEach(document => {
      const docData = document.data();
      if (
        docData.advertisementPlan === "Marathon" &&
        Date.now() > calculateExpiration("Marathon", docData.date)
      ) {
        return updateDocuments(docData.id, docData.postedBy);
      } else if (
        docData.advertisementPlan === "Mid-range" &&
        Date.now() > calculateExpiration("Mid-range", docData.date)
      ) {
        return updateDocuments(docData.id, docData.postedBy);
      } else if (
        docData.advertisementPlan === "Sprint" &&
        Date.now() > calculateExpiration("Sprint", docData.date)
      ) {
        return updateDocuments(docData.id, docData.postedBy);
      } else {
        //   console.log("job is not expired");
        return false;
      }
    });

    return response
      .status(200)
      .send({ data: "clean-up success", success: true });
  } catch (error) {
    console.log(error);
    return response.status(400).response.send({ data: error, success: false });
  }
};
