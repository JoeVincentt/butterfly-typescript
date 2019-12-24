import React from "react";
import { Grid, Typography } from "@material-ui/core";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  EmailShareButton
} from "react-share";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon
} from "react-share";

const ShareButtons = ({ shareUrl, title }) => {
  return (
    <Grid item>
      <Grid item style={{ marginBottom: 5, marginTop: 16 }}>
        <Typography variant="caption" color="textSecondary">
          Share this job:
        </Typography>
      </Grid>
      <Grid container direction="row" spacing={1} alignContent="center">
        <Grid item>
          <FacebookShareButton
            url={shareUrl}
            quote={title}
            style={{ color: "red" }}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </Grid>
        <Grid item>
          <TwitterShareButton
            url={shareUrl}
            title={title}
            className="Demo__some-network__share-button"
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </Grid>
        <Grid item>
          <LinkedinShareButton
            url={shareUrl}
            windowWidth={750}
            windowHeight={600}
            className="Demo__some-network__share-button"
          >
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </Grid>
        <Grid item>
          <EmailShareButton
            url={shareUrl}
            subject={title}
            body="body"
            className="Demo__some-network__share-button"
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ShareButtons;
