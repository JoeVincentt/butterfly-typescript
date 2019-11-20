import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { Grid } from "@material-ui/core";
import RoomIcon from "@material-ui/icons/Room";

const CompanyInfoCard = ({
  location,
  company,
  companyId,
  logoImage,
  altLogoText
}) => {
  const classes = useStyles();

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Avatar alt={altLogoText} src={logoImage} className={classes.bigAvatar} />
      <Button
        size="small"
        color="secondary"
        onClick={() => console.log("Company ID is", companyId)}
      >
        See Profile
      </Button>

      <Typography gutterBottom variant="h6" component="h2">
        {company}
      </Typography>
      <Grid container direction="row" justify="center" alignItems="center">
        <RoomIcon color="disabled" fontSize="small" />
        <Typography variant="body2" color="textSecondary" component="p">
          {location}
        </Typography>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles({
  bigAvatar: {
    margin: 10,
    width: 100,
    height: 100
  }
});

export default CompanyInfoCard;
