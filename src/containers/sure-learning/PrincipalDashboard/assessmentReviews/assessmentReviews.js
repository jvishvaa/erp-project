/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Typography,
  withStyles,
  Divider,
  Select,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  TextField,
  TablePagination,
  Box,
  FormHelperText,
  Checkbox,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import styles from "./assessmentReviews.style";
import endpoints from 'config/endpoints';
import Loader from "../../hoc/loader";
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import useFetch from '../../hoc/useFetch';
import axios from 'axios';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';

let status;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};

const AssessmentReview = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem("udaanDetails")));
  const [course, setCourse] = useState([]);
  // const [branch, setBranch] = useState([]);
  const [questionLink, setQuestionLink] = useState("");
  const [questionModle, setQuestionModule] = useState(false);
  const [viewQrA, setQrA] = useState(false);
  const [openMarksModel, setMarksModle] = useState(false);
  const [ReviewId, setReviewId] = useState("");
  const [marks, setMarks] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(null);
  const [page, setPage] = useState(0);
  const [permission, setPermission] = useState([]);
  const [email, setEmail] = useState("");
  const [checkLoader, setCheckLoader] = useState(false);
  const [assessmentModuleId, setAssessmentModuleId] = useState(null);

  const { setAlert } = useContext(AlertNotificationContext);

  const {
    data: assesssmentReviews,
    isLoading: gettingAssessmentReviews,
    doFetch: fetchReviewsData,
  } = useFetch(null);

  const {
    data: submitMarksReview,
    isLoading: submittingMarks,
    doFetch: fetchSubmitMarks,
  } = useFetch(null);

  const {
    data: getCourses,
    isLoading: gettingCourses,
    doFetch: fetchCourses,
  } = useFetch(null);

  const {
    // data: getBranchs,
    isLoading: gettingBranches,
    doFetch: fetchBranches,
  } = useFetch(null);

  let loader = null;
  if (
    gettingCourses ||
    gettingBranches ||
    gettingAssessmentReviews ||
    submittingMarks ||
    checkLoader
  ) {
    loader = <Loader open />;
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
    if (!rowsPerPage) {
      setRowsPerPage(5);
    }
  }

  function lastPageChange(lastPage) {
    setPage(lastPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setPage(0);
  }

  function firstPageChange() {
    setPage(0);
  }

  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Assessment_Review' && item.module_type === 'Self_Driven') {
        setAssessmentModuleId(item.module);
        getPermissonData(item.module);
      }
    })
  }, [])

  useEffect(() => {
    if (auth && assessmentModuleId) {
      fetchCourses({
        url: `${endpoints.sureLearning.principalCompletedViewCourse}?course_type=${"self_driven"}&page_size=${100}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assessmentModuleId,
        },
      });

      fetchBranches({
        url: `${endpoints.sureLearning.principalviewBranches}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assessmentModuleId,
        },
      });
    }
  }, [auth, assessmentModuleId]);

  // For Permissions
  function getPermissonData(id) {
    axios
      .get(endpoints.sureLearning.getPermissons, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: id,
        },
      })
      .then((response) => {
        setPermission(response.data.response);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  function functionToGetReviews() {
    if (!course) {
      setAlert('warning', "Select and course");
      return;
    }

    setRowsPerPage(null);
    setPage(0);
    // &branch_id=${branch}
    fetchReviewsData({
      url: `${endpoints.sureLearning.AssessmentReviewApi
        }?course_id=${course}&page_size=${5}&page=${1}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: assessmentModuleId,
      },
    });
  }

  function functionToGetScores() {
    if (!course) {
      setAlert('warning', "Select and course");
      return;
    }

    if (
      !email ||
      !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        email
      )
    ) {
      setAlert('warning', "Email Can't be empty");
      return;
    }

    setRowsPerPage(null);
    setPage(0);

    const courseArr = [];
    for (let i = 0; i < course.length; i += 1) {
      courseArr.push(
        getCourses &&
        getCourses.results.filter(
          (item) => item.course.course_name === course[i]
        )[0].course.id
      );
    }
    // &branch_id=${branch}

    async function loading() {
      setCheckLoader(true);

      const response = await fetch(
        `${endpoints.sureLearning.getAssessmentScores}?course_id=${[courseArr]}&email=${email}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.personal_info.token}`,
            module: assessmentModuleId,
          },
        }
      );
      const res = await response.json();
      // console.log("s",response.status)
      status = response.status;
      return res;
    }

    // async function loading() {
    //   setCheckLoader(true);

    //   const response = await fetch({
    //     url: `${endpoints.sureLearning.getAssessmentScores}?course_id=${[
    //       courseArr,
    //     ]}&email=${email}`,
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${auth.personal_info.token}`,
    //       module: assessmentModuleId,
    //     },
    //   });

    //   const res = await response.json();
    //   console.log("s", res);
    //   status = response.status;
    //   return res;
    // }
    loading()
      .then((response) => {
        if (status === 200) {
          setCheckLoader(false);
          console.log(response);
          setAlert('success', `Your assessment scores has been sent to ${email}.`);
          // eslint-disable-next-line no-console
        }
      })
      .catch((error) => {
        setCheckLoader(false);
        setAlert('warning', `Error:${error}`);
      });
    setEmail("");
    setCourse([]);
  }

  useEffect(() => {
    if (course && (submitMarksReview || page || rowsPerPage) && assessmentModuleId) {
      fetchReviewsData({
        url: `${endpoints.sureLearning.AssessmentReviewApi
          }?course_id=${course}&page_size=${rowsPerPage || 5}&page=${page + 1}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assessmentModuleId,
        },
      });
    }
  }, [submitMarksReview, page, rowsPerPage, assessmentModuleId]);

  useEffect(() => {
    setCourse([]);
  }, []);

  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };
  DialogTitle.propTypes = {
    children: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  const handleCloseQuestionModule = () => {
    setQuestionLink("");
    setQuestionModule(false);
    setQrA(false);
  };

  function functionToViewQuestionDialog() {
    let dialoge = null;

    dialoge = (
      <Dialog
        fullWidth
        maxWidth="xl"
        style={{ paddingTop: "12vh", margin: ' 5px 100px 5px 100px' }}
        open={questionModle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          onClose={handleCloseQuestionModule}
        >
          {viewQrA ? "View Question" : "View Answer"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          {questionLink && typeof questionLink === "string" && (
            <Grid container spacing={2}>
              <Grid item md={1} />
              <Grid item md={10} xs={12} style={{ margin: "12px 0px" }}>
                <iframe
                  title="MyFrame"
                  src={`${questionLink}#toolbar=0`}
                  style={{ width: "100%", height: "700px", frameborder: "0" }}
                  alt="PDF file is crashed"
                />
              </Grid>
            </Grid>
          )}
          {questionLink && typeof questionLink !== "string" && (
            <Grid container spacing={4}>
              {questionLink &&
                questionLink.length !== 0 &&
                questionLink.map((item) => (
                  <Grid item md={12} xs={12} key={item.id}>
                    <Box border={2}>
                      <img
                        src={item.answer_file}
                        alt="crash"
                        height="auto"
                        width="100%"
                      />
                    </Box>
                  </Grid>
                ))}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    );
    return dialoge;
  }

  function submitMarksFunction() {
    if (!marks) {
      setAlert('warning', "Enter marks");
      return;
    }
    const data = {
      marks_scored: marks,
    };
    fetchSubmitMarks({
      url: `${endpoints.sureLearning.uploadReviewMarksApi}${ReviewId}/assessment_marks_upload/`,
      method: "PUT",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: assessmentModuleId,
      },
    });
    setMarksModle(false);
  }

  const handleCloseMarks = () => {
    setMarksModle(false);
    setMarks("");
    setReviewId("");
  };

  function functionTodateFormate(item) {
    const a = item.split(" ");
    const p = a[0].split(/\D/g);
    const b = [p[2], p[1], p[0]].join("/");
    const c = `${b}, ${a[1]} ${a[2]}`;
    return c !== "undefined" ? c.split(",")[0] : "";
  }

  function functionForUploadMarksModle() {
    let dialoge = null;

    dialoge = (
      <>
        <Dialog
          fullWidth
          maxWidth="md"
          open={openMarksModel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" onClose={handleCloseMarks}>
            Upload Marks
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item md={10} xs={12}>
                <TextField
                  margin="dense"
                  required
                  type="number"
                  placeholder="000"
                  value={marks || ""}
                  fullWidth
                  // eslint-disable-next-line max-len
                  onInput={(e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value, 10))
                      .toString()
                      .slice(0, 3);
                  }}
                  onChange={(e) =>
                    e.target.value.length < 4 && e.target.value > -1
                      ? setMarks(e.target.value)
                      : ""
                  }
                  variant="outlined"
                  label="Upload Marks"
                />
              </Grid>
              <Grid item md={2} xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "8px" }}
                  onClick={() => submitMarksFunction()}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </>
    );
    return dialoge;
  }

  function functionToViewQuestion(questionData) {
    setQuestionLink(questionData);
    setQuestionModule(true);
    setQrA(true);
  }

  function functionToViewAnswer(file) {
    setQuestionLink(file);
    setQuestionModule(true);
    setQrA(false);
  }

  function functionToUploadMarks(id) {
    setMarksModle(true);
    setReviewId(id);
  }

  const isAllSelected =
    getCourses?.results?.length > 0 &&
    course?.length === getCourses?.results?.length;

  console.log(
    isAllSelected,
    course?.length,
    getCourses?.results?.length,
    "isAllSelected"
  );

  const handleChange = (event) => {
    const value = event.target.value;
    // console.log(value[value.length - 1], "handleChange");
    const courseList = getCourses?.results.map(
      (item) => item?.course?.course_name
    );
    if (value[value.length - 1] === "all") {
      setCourse(
        course?.length === getCourses?.results?.length ? [] : courseList
      );
      return;
    }

    setCourse(value);
  };

  console.log(course, "assessmentReviews");

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Sure Learning'
        childComponentName='Assessment Reviews'
        isAcademicYearVisible={true}
      />
      {/* <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          {localStorage.getItem("coursesType") === "trainer_driven" ? (
            <Typography variant="h4">Assessment Scores</Typography>
          ) : (
            <Typography variant="h4">Assessment Reviews</Typography>
          )}
        </Grid>
      </Grid>
      <Divider className={classes.divider} /> */}
      <div style={{ margin: ' 5px 40px 5px 40px' }}>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <Typography>
                Select Course &nbsp;
                <strong style={{ color: "red" }}>*</strong>
              </Typography>
              {localStorage.getItem("coursesType") === "trainer_driven" ? (
                <Select
                  margin="dense"
                  value={course || []}
                  onChange={handleChange}
                  // onChange={(e) => setCourse(e.target.value)}
                  fullWidth
                  variant="outlined"
                  style={{ color: "black", margin: "8px 0 0 0" }}
                  renderValue={(selected) => selected.join(", ")}
                  multiple
                  MenuProps={MenuProps}
                >
                  <MenuItem key="all" value="all">
                    <ListItemIcon>
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={
                          course.length > 0 &&
                          course.length < getCourses.results.length
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.selectAllText }}
                      primary="Select All"
                    />
                  </MenuItem>
                  {getCourses &&
                    getCourses.results.length !== 0 &&
                    getCourses.results.map((item) => (
                      <MenuItem
                        key={item.course.id}
                        value={item.course.course_name}
                        name={item.course.course_name}
                      >
                        <Checkbox
                          checked={course.indexOf(item.course.course_name) > -1}
                        />
                        <ListItemText primary={item.course.course_name} />
                      </MenuItem>
                    ))}
                </Select>
              ) : (
                <Select
                  margin="dense"
                  value={course || []}
                  onChange={(e) => setCourse(e.target.value)}
                  fullWidth
                  variant="outlined"
                  style={{ color: "black" }}
                >
                  {getCourses &&
                    getCourses.results.length !== 0 &&
                    getCourses.results.map((item) => (
                      <MenuItem key={item.course.id} value={item.course.id}>
                        {item.course.course_name}
                      </MenuItem>
                    ))}
                </Select>
              )}
            </Grid>
            {localStorage.getItem("coursesType") === "trainer_driven" ? (
              <Grid item md={6} xs={12}>
                <Typography>
                  Enter Email Address
                  <b style={{ color: "red" }}>*</b>
                </Typography>
                <TextField
                  label=""
                  margin="dense"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                />
                {email &&
                  !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
                    email
                  ) ? (
                  <FormHelperText
                    id="component-error-text"
                    style={{ color: "red" }}
                  >
                    Invalid Email Address
                  </FormHelperText>
                ) : null}
                {email &&
                  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
                    email
                  ) ? (
                  <FormHelperText
                    id="component-error-text"
                    style={{ color: "green" }}
                  >
                    Valid Email Address
                  </FormHelperText>
                ) : null}
              </Grid>
            ) : null}
            {/* <Grid item md={5} xs={12}>
            <Typography>
              Select Branch &nbsp;
              <strong style={{ color: 'red' }}>*</strong>
            </Typography>
            <Select
              multiple
              margin="dense"
              value={branch || ''}
              onChange={(e) => setBranch(e.target.value)}
              fullWidth
              variant="outlined"
              style={{ color: 'black' }}
            >
              {getBranchs
                  && getBranchs.length !== 0
                  && getBranchs.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item.id}
                    >
                      {item.branch_name}
                    </MenuItem>
                  ))}
            </Select>
          </Grid> */}
            {localStorage.getItem("coursesType") === "trainer_driven" ? (
              <Grid item md={3} xs={12}>
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  size="medium"
                  onClick={() => functionToGetScores()}
                >
                  Send Assessment Scores
                </Button>
              </Grid>
            ) : (
              <Grid item md={3} xs={12}>
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={() => functionToGetReviews()}
                >
                  Get Assessment Reviews
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
        <Divider className={classes.divider} />

        {localStorage.getItem("coursesType") !== "trainer_driven" &&
          assesssmentReviews &&
          assesssmentReviews.results.length === 0 && (
            <Typography
              variant="h4"
              style={{ color: "blue", textAlign: "center" }}
            >
              No Reviews are Added
            </Typography>
          )}

        {localStorage.getItem("coursesType") !== "trainer_driven" &&
          assesssmentReviews &&
          assesssmentReviews.results.length !== 0 && (
            <Paper className={classes.paper}>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell float="left">
                          <Typography>S.No.</Typography>
                        </TableCell>
                        <TableCell float="left">
                          <Typography>Name</Typography>
                        </TableCell>
                        <TableCell float="left">
                          <Typography>Email</Typography>
                        </TableCell>
                        <TableCell float="left">
                          <Typography>Question</Typography>
                        </TableCell>
                        <TableCell float="left">
                          <Typography>Answer</Typography>
                        </TableCell>
                        <TableCell float="left">
                          <Typography>Upload Marks</Typography>
                        </TableCell>
                        <TableCell float="left">
                          <Typography>
                            Submitted Date
                            <br />
                            (DD/MM/YYYY)
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {localStorage.getItem("coursesType") !== "trainer_driven" &&
                        assesssmentReviews &&
                        assesssmentReviews.results.length !== 0 &&
                        assesssmentReviews.results.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell float="left">
                              <Typography>{index + 1}</Typography>
                            </TableCell>
                            <TableCell float="left">
                              <Typography>
                                {(item.user &&
                                  item.user &&
                                  item.user.first_name) ||
                                  ""}
                              </Typography>
                            </TableCell>
                            <TableCell float="left">
                              <Typography>
                                {(item.user && item.user && item.user.email) ||
                                  ""}
                              </Typography>
                            </TableCell>
                            <TableCell float="left">
                              <Button
                                className={classes.button}
                                color="primary"
                                variant="contained"
                                onClick={() =>
                                  functionToViewQuestion(
                                    item.question_file && item.question_file
                                  )
                                }
                              >
                                View Question
                              </Button>
                            </TableCell>
                            <TableCell float="left">
                              <Button
                                className={classes.button}
                                color="primary"
                                variant="contained"
                                onClick={() =>
                                  functionToViewAnswer(item.answer_file)
                                }
                              >
                                View Answer
                              </Button>
                            </TableCell>
                            {item.is_marks_upload === true ? (
                              <TableCell float="left">
                                {item.marks_scored}
                                {permission.can_update ? (
                                  <Button
                                    className={classes.button}
                                    color="primary"
                                    variant="contained"
                                    onClick={() => functionToUploadMarks(item.id)}
                                  >
                                    Upload Marks
                                  </Button>
                                ) : null}
                              </TableCell>
                            ) : (
                              <TableCell float="left">
                                <Button
                                  className={classes.button}
                                  color="primary"
                                  variant="contained"
                                  onClick={() => functionToUploadMarks(item.id)}
                                >
                                  Upload Marks
                                </Button>
                              </TableCell>
                            )}
                            <TableCell float="left">
                              <Typography>
                                {(item.completed_date.split("T")[0] &&
                                  functionTodateFormate(item.completed_date)) ||
                                  ""}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
            </Paper>
          )}
        {localStorage.getItem("coursesType") !== "trainer_driven" &&
          assesssmentReviews &&
          assesssmentReviews.results &&
          assesssmentReviews.results.length !== 0 && (
            <Paper style={{ backgroundColor: "white", marginTop: "10px" }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TablePagination
                      colSpan={6}
                      labelDisplayedRows={() =>
                        `Page ${page + 1} of ${+assesssmentReviews.total_pages}`
                      }
                      rowsPerPageOptions={[5, 20, 30]}
                      count={+assesssmentReviews.count}
                      rowsPerPage={rowsPerPage || 5}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "Rows per page" },
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                    <TableCell style={{ marginTop: "13px" }}>
                      <IconButton
                        onClick={firstPageChange}
                        disabled={page === 0 || page === 1}
                      >
                        <FirstPageIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          lastPageChange(assesssmentReviews.total_pages - 1)
                        }
                        disabled={page === +assesssmentReviews.total_pages - 1}
                      >
                        <LastPageIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          )}
        {loader}
        {questionLink && functionToViewQuestionDialog()}
        {functionForUploadMarksModle()}
      </div>
    </Layout>
  );
};
AssessmentReview.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default withStyles(styles)(AssessmentReview);
