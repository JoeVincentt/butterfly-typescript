exports.createIndex = async function(snapshot, client) {
  const jobSearchIndex = client.initIndex("job_search");
  const data = snapshot.data();
  const dataToIndex = {
    id: data.id,
    postedBy: data.postedBy,
    title: data.title,
    about: data.about,
    category: data.category,
    companyLocation: data.companyLocation,
    companyName: data.companyName,
    logo: data.logo,
    date: data.date,
    advertisementPlan: data.advertisementPlan,
    externalJobPostingLink: data.externalJobPostingLink,
    jobType: data.jobType
  };
  const objectID = snapshot.id; //or data.id

  //Add the data to the algolia index
  return jobSearchIndex.addObject({
    objectID,
    ...data
  });
};

exports.removeIndex = async function(snapshot, client) {
  const jobSearchIndex = client.initIndex("job_search");
  const objectID = snapshot.id;

  //Delete an ID from the index
  return jobSearchIndex.deleteObject(objectID);
};
