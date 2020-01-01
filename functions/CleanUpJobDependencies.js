exports.cleanUpDependencies = async function(snapshot, admin) {
  const db = admin.firestore();
  const data = snapshot.data();
  try {
    //DELETE JOB STATS INSTANCE
    await db
      .collection("jobStats")
      .doc(data.postedBy)
      .collection("jobStats")
      .doc(data.id)
      .delete();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
