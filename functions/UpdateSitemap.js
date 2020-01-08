const path = require("path");
const os = require("os");
const fs = require("fs");
exports.createUrlIndex = async function(snapshot, admin) {
  const data = snapshot.data();
  const id = data.id;

  const fileBucket = "butterfly-remote-jobs-prod.appspot.com";
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
      console.log("The file was saved!");
    });
    await fs.readFile(tempFilePath, "utf8", (err, data) => {
      if (err) throw err;
      console.log("OK: " + tempFilePath);
      console.log(data);
    });

    const updatedFilePath = path.join(path.dirname(filePath), fileName);
    // Uploading the updated file.
    await bucket.upload(tempFilePath, {
      destination: updatedFilePath,
      metadata: metadata
    });
    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    await fs.unlinkSync(tempFilePath);
    return true;
  } catch (error) {
    return false;
  }
};

exports.returnSitemap = async function(request, response, admin) {
  const fileBucket = "butterfly-remote-jobs-prod.appspot.com";
  const filePath = "sitemap/sitemap.txt";

  const fileName = path.basename(filePath);
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);

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
      response.send(data);
    });
    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    await fs.unlinkSync(tempFilePath);
    return true;
  } catch (error) {
    return false;
  }
};
