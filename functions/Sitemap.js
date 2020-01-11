const path = require("path");
const os = require("os");
const fs = require("fs");

exports.createUrlIndex = async function(snapshot, admin) {
  const data = snapshot.data();
  const id = data.id;

  //change name of the bucket before deploy
  const fileBucket = "butterfly-remote-jobs-dev.appspot.com";
  const filePath = "sitemap/sitemap.txt";
  const metadata = {
    contentType: "text/plain"
  };

  const fileName = path.basename(filePath);
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  try {
    await bucket.file(filePath).download({ destination: tempFilePath });
    // console.log("Text downloaded locally to", tempFilePath);
    const newUrl = `\nhttps://www.butterflyremote.com/job-description/${id}`;
    //Write the new URL to sitemap.txt
    await fs.appendFile(tempFilePath, newUrl, err => {
      if (err) {
        return console.log(err);
      }
      console.log("Sitemap Updated!");
    });
    // await fs.readFile(tempFilePath, "utf8", (err, data) => {
    //   if (err) throw err;
    //   // console.log("OK: " + tempFilePath);
    //   // console.log(data);
    // });

    const updatedFilePath = path.join(path.dirname(filePath), fileName);
    // Uploading the updated file.
    await bucket.upload(tempFilePath, {
      destination: updatedFilePath,
      metadata: metadata
    });
    console.log("Sitemap Saved!");
    // Once the file has been uploaded delete the local file to free up disk space.
    await fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.log(error);
  }
};

exports.returnSitemap = async function(request, response, admin) {
  //change name of the bucket before deploy
  const fileBucket = "butterfly-remote-jobs-dev.appspot.com";
  const filePath = "sitemap/sitemap.txt";
  const fileName = path.basename(filePath);
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  const sendData = async data => {
    try {
      // console.log(data);
      await response.send(data);
      // Once the sitemap has been returned delete the local file to free up disk space.
      await fs.unlinkSync(tempFilePath);
    } catch (error) {
      console.log(error);
      await response.send({ error: "Error Occurred" });
    }
  };

  const getSitemap = async () => {
    try {
      await bucket.file(filePath).download({ destination: tempFilePath });
      await fs.readFile(tempFilePath, "utf8", (err, data) => {
        if (err) throw err;
        // console.log("OK: " + tempFilePath);
        // console.log(data);
        // response.setHeader(
        //   "Content-disposition",
        //   "attachment; filename=sitemap.txt"
        // );
        // response.setHeader("Content-type", "text/plain");
        // response.charset = "UTF-8";
        return sendData(data);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return getSitemap();
};

exports.removeUrlIndex = async function(snapshot, admin) {
  const data = snapshot.data();
  const id = data.id;
  //change name of the bucket before deploy
  const fileBucket = "butterfly-remote-jobs-dev.appspot.com";
  const filePath = "sitemap/sitemap.txt";
  const metadata = {
    contentType: "text/plain"
  };

  const fileName = path.basename(filePath);
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  const saveDataOverrideSitemapInStorage = async newSitemap => {
    try {
      await fs.writeFile(tempFilePath, newSitemap, "utf-8", function(err) {
        if (err) throw err;
        console.log("Sitemap Saved!");
      });
      const updatedFilePath = path.join(path.dirname(filePath), fileName);
      // Uploading the updated file.
      await bucket.upload(tempFilePath, {
        destination: updatedFilePath,
        metadata: metadata
      });
      console.log("Sitemap Updated");
      // Once the file has been uploaded delete the local file to free up disk space.
      await fs.unlinkSync(tempFilePath);
    } catch (error) {
      console.log(error);
    }
  };

  const updateSitemapDeleteRemovedJobs = async () => {
    try {
      await bucket.file(filePath).download({ destination: tempFilePath });
      // console.log("Text downloaded locally to", tempFilePath);
      const urlToRemove = `\nhttps://www.butterflyremote.com/job-description/${id}`;
      //Write the new URL to sitemap.txt
      await fs.readFile(tempFilePath, "utf8", (err, data) => {
        if (err) throw err;
        const newSitemap = data.replace(urlToRemove, "");
        saveDataOverrideSitemapInStorage(newSitemap);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return updateSitemapDeleteRemovedJobs();
};
