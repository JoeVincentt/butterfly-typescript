import React, { useEffect, useState, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import firebase from "firebase/app";
import "firebase/firestore";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  LinearProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  Tooltip,
  FormControlLabel,
  Switch,
  IconButton
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { convertTimestamp } from "../../utils/convertTimestamp";
import colors from "../../../constants/colors";
import { UserStateContext } from "../../../StateManagement/UserState";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  {
    id: "candidateName",
    numeric: false,
    disablePadding: false,
    label: "Name"
  },
  {
    id: "position",
    numeric: false,
    disablePadding: false,
    label: "Position"
  },
  { id: "company", numeric: false, disablePadding: false, label: "Company" },
  {
    id: "country",
    numeric: false,
    disablePadding: false,
    label: "Country"
  },
  {
    id: "zipCode",
    numeric: false,
    disablePadding: false,
    label: "Zip Code"
  },
  {
    id: "timezone",
    numeric: false,
    disablePadding: false,
    label: "Timezone"
  },
  {
    id: "yearsOfExperience",
    numeric: true,
    disablePadding: false,
    label: "Years of Experience"
  },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  { id: "date", numeric: true, disablePadding: false, label: "Date" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "resume", numeric: false, disablePadding: false, label: "Resume" }
];

function EnhancedTableHead(props) {
  const innerClasses = useTableHeadStyles();
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={innerClasses.rowName}>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all candidates" }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={"left"}
            sortDirection={orderBy === headCell.id ? order : false}
            className={innerClasses.rowName}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useTableHeadStyles = makeStyles(theme => ({
  rowName: {
    fontSize: "1rem",
    color: colors.purple
  }
}));

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Applicants
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={() => props.handleDelete()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null
      //   <Tooltip title="Filter list">
      //     <IconButton aria-label="filter list">
      //       <FilterListIcon />
      //     </IconButton>
      //   </Tooltip>
      }
    </Toolbar>
  );
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const EnhancedTable = props => {
  const classes = useStyles();
  const db = firebase.firestore();

  const state = useContext(UserStateContext);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);
  const [rows, setRow] = useState([]);

  useEffect(() => {
    setRow(props.rows);
    setLoading(false);
    //reset New Applicants field
    resetNewApplicantsStats();
    return () => {};
  }, []);

  const resetNewApplicantsStats = async () => {
    try {
      await db
        .collection("dashboardStats")
        .doc(state.uid)
        .update({
          "employerStats.newApplicants": 0
        });
    } catch (error) {}
  };

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.id);

      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleDelete = () => {
    // console.log("delete");
    // console.log(selected);
    let newRows = [...rows];
    newRows = newRows.filter(row => {
      if (!selected.includes(row.id)) {
        return row;
      } else {
        db.collection("applications-employer")
          .doc(state.uid)
          .collection("applications")
          .doc(row.id)
          .delete()
          .then(function() {
            // console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            // console.error("Error removing document: ", error);
          });

        //UPDATE EMPLOYER DASHBOARD STATS
        db.collection("dashboardStats")
          .doc(state.uid)
          .update({
            "employerStats.totalApplicants": firebase.firestore.FieldValue.increment(
              -1
            )
          })
          .then(() => {
            // console.log("Document successfully updated!");
          })
          .catch(error => {
            // console.log("Error updating document:", error);
          });

        return null;
      }
    });
    setRow(newRows);
    setSelected([]);
  };

  const updateStatusToChecked = (id, status) => {
    if (status !== "checked") {
      db.collection("applications-employer")
        .doc(state.uid)
        .collection("applications")
        .doc(id)
        .update({
          status: "checked"
        })
        .then(function() {
          let newRows = [...rows];
          newRows.map(row => {
            if (row.id === id) {
              row.status = "checked";
            }
          });
          setRow(newRows);
          // console.log("Document successfully updated!");
        })
        .catch(function(error) {
          // console.error("Error updating document: ", error);
        });
    } else {
      return;
    }
  };

  if (loading) {
    return <LinearProgress />;
  } else {
    return (
      <React.Fragment>
        <Helmet>
          <title>Applicants</title>
        </Helmet>
        <div className={classes.root}>
          <Grid container justify="flex-start">
            <Button
              color="primary"
              className={classes.button}
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() =>
                props.history.push("/dashboard-employer/job-listings")
              }
            >
              Job Listing
            </Button>
          </Grid>
          <Paper className={classes.paper}>
            <EnhancedTableToolbar
              numSelected={selected.length}
              handleDelete={handleDelete}
            />
            <div className={classes.tableWrapper}>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort(rows, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          className={classes.hoverRow}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              onClick={event => handleClick(event, row.id)}
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="left"
                            style={{ padding: "1.2em" }}
                          >
                            {row.candidateName}
                          </TableCell>

                          <TableCell align="left">
                            <Link to={`/job-description/${row.jobID}`}>
                              {row.appliedFor}
                            </Link>
                          </TableCell>

                          <TableCell align="left">{row.company}</TableCell>
                          <TableCell align="left">{row.country}</TableCell>
                          <TableCell align="left">{row.zipCode}</TableCell>
                          <TableCell align="left">{row.timezone}</TableCell>
                          <TableCell align="left">
                            {row.yearsOfExperience}
                          </TableCell>
                          <TableCell align="left">{row.email}</TableCell>
                          <TableCell align="left">
                            {convertTimestamp(row.date)}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={
                              row.status === "checked"
                                ? classes.resumeChecked
                                : classes.resumeUnchecked
                            }
                          >
                            {row.status === "unchecked" ? (
                              <CheckBoxOutlineBlankIcon />
                            ) : (
                              <CheckBoxIcon />
                            )}
                          </TableCell>
                          <TableCell align="left">
                            <a
                              href={row.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                color="primary"
                                // className={classes.button}
                                size="large"
                                startIcon={<OpenInBrowserIcon />}
                                onClick={() =>
                                  updateStatusToChecked(row.id, row.status)
                                }
                              >
                                Open
                              </Button>
                            </a>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={
              <Switch
                checked={dense}
                onChange={handleChangeDense}
                color="primary"
              />
            }
            label="Minimize View"
          />
        </div>
      </React.Fragment>
    );
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "auto",
    // marginTop: theme.spacing(3),
    flexGrow: 1,
    // overflow: "scroll"
    margin: theme.spacing(1)
  },
  paper: {
    width: "auto",
    marginBottom: theme.spacing(2)
    // boxShadow: "0 0 10px 0px rgba(107, 19, 107, 0.3)"
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: "auto"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  resumeChecked: {
    color: "#00c853"
  },
  resumeUnchecked: {
    color: "#f44336"
  },
  hoverRow: {
    "&:hover": {
      backgroundColor: "ghostwhite"
    }
  },
  button: {
    marginBottom: theme.spacing(2)
  }
}));

export default withRouter(EnhancedTable);
