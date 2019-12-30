import React from "react";
import { withRouter } from "react-router-dom";
import { InputBase, IconButton, Grid } from "@material-ui/core";
import { makeStyles, fade } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import "./Pagination.scss";

import { renderJobsFeed } from "../JobsFeed/utils/renderJobsFeed";

import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  Pagination,
  Highlight,
  ClearRefinements,
  RefinementList,
  Configure,
  connectSearchBox,
  connectHits
} from "react-instantsearch-dom";

import colors from "../../constants/colors";

const algoliaClient = algoliasearch(
  "FQOPOU9VTD",
  "bac581e50537247c3eff1ba5fb3a3a07"
);

const searchClient = {
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          processingTimeMS: 0
        }))
      });
    }

    return algoliaClient.search(requests);
  }
};

function CustomSearchBar() {
  return (
    <InstantSearch indexName="job_search" searchClient={searchClient}>
      <div className="left-panel">
        <RefinementList attribute="title" />
        <Configure hitsPerPage={10} />
      </div>
      <div className="right-panel">
        <SearchBox
          translations={{
            placeholder: ""
          }}
        />
        <CustomHits />
      </div>
    </InstantSearch>
  );
}

const WrapperSearchBox = ({ currentRefinement, isSearchStalled, refine }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Grid container justify="center">
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            value={currentRefinement}
            onChange={event => refine(event.currentTarget.value)}
            // onBlur={() =>
            //   setTimeout(() => {
            //     refine("");
            //   }, 100)
            // }
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ "aria-label": "search" }}
          />
          {/* {isSearchStalled ? "My search is stalled" : ""} */}

          <IconButton
            style={{
              color: "#ccc",
              marginRight: 5,
              visibility: currentRefinement.length <= 0 && "hidden"
            }}
            size="small"
            aria-label="clear search field"
            onClick={() => {
              refine("");
            }}
          >
            <HighlightOffIcon fontSize="small" />
          </IconButton>
        </div>{" "}
      </Grid>
    </Grid>
  );
};
const SearchBox = connectSearchBox(WrapperSearchBox);

const Hits = withRouter(({ hits, history }) => {
  const navigateToJobDetails = id => history.push(`/job-description/${id}`);

  if (hits.length <= 0) {
    return <React.Fragment />;
  } else {
    return (
      <React.Fragment>
        {renderJobsFeed(hits, navigateToJobDetails, "")}
        <Grid container justify="center" style={{ marginTop: 20 }}>
          <Pagination />
        </Grid>
      </React.Fragment>
    );
  }
});
const CustomHits = connectHits(Hits);

const useStyles = makeStyles(theme => ({
  // root: {
  //   flexGrow: 1
  // },
  hitPaper: {
    position: "absolute",
    marginTop: 5
  },
  root: {
    width: 500
  },
  typography: {
    padding: theme.spacing(2)
  },
  appBar: {
    background: "#ffffff",
    boxShadow: "0 0 10px 0px rgba(107, 19, 107, 0.2)"
  },

  buttonBar: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  },
  logo: {
    marginLeft: theme.spacing(2),
    height: "auto",
    width: 180
  },
  loginButton: {
    margin: theme.spacing(1),
    color: colors.purple,
    backgroundColor: colors.grey
  },
  menuButton: {
    color: colors.purple
  },
  postJobButton: {
    margin: theme.spacing(1),
    background: `linear-gradient(to bottom, #8e24aa, #333399)`
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    border: "1px solid rgba(107, 19, 107, 0.2)",
    backgroundColor: fade("rgb(251,244,247)", 0.45),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginBottom: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginLeft: 0,
    // width: "100%",
    width: "fit-content",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(5)
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: theme.spacing(4)
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: theme.spacing(0)
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    color: "#8a24ae",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "#8a24ae"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  }
}));

export default CustomSearchBar;
