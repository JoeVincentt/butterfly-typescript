import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";

import "./JobsFeed.css";
import CompanyBar from "../CompanyBar/CompanyBar";
import JobCard from "../JobCard/JobCard";

const JobsFeed = ({ jobs }) => {
  const classes = useStyles();
  const [sortBy, setSortBy] = React.useState("");

  const handleChange = name => event => {
    setSortBy(event.target.value);
  };

  const renderJobsFeed = () =>
    jobs.map(
      (
        {
          id,
          title,
          location,
          company,
          companyId,
          logoImage,
          altLogoText,
          date
        },
        index
      ) => (
        <JobCard
          key={id}
          id={id}
          title={title}
          location={location}
          company={company}
          companyId={companyId}
          logoImage={logoImage}
          altLogoText={altLogoText}
          date={date}
        />
      )
    );

  const renderFeaturedSortBar = () => (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignContent="center"
    >
      <Grid item>
        <Typography className={classes.featuredText} variant="h5">
          Featured Jobs
        </Typography>
      </Grid>
      <Grid item>
        <FormControl className={classes.formControl}>
          <InputLabel id="sortSelectLabel" htmlFor="sortBy-input">
            SORT BY
          </InputLabel>
          <Select
            native
            autoWidth
            value={sortBy}
            onChange={handleChange("sortBy")}
            inputProps={{
              name: "sortBy",
              id: "sortBy-input"
            }}
          >
            <option value="" />
            <option value={10}>Ten</option>
            <option value={20}>Twenty</option>
            <option value={30}>Thirty</option>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        {renderFeaturedSortBar()}
      </Grid>
      <Grid item xs={12}>
        {renderJobsFeed()}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  featuredText: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3)
  }
}));

export default JobsFeed;
