/* eslint-disable radix */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import {
  withStyles,
  Typography,
  Divider,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  // Modal,
  // Fade,
  // Backdrop,
  IconButton,
  TextField,
  TableFooter,
  TablePagination,
  MenuItem,
  Select,
  ListItemText,
  Checkbox,
  ListItemIcon,
} from "@material-ui/core";
import PropTypes from "prop-types";
import FirstPageIcon from "@material-ui/icons/FirstPage";
// import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
// import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from "@material-ui/icons/LastPage";
import styles from "./report.style";
import Loader from "../../hoc/loader";
import endpoints from 'config/endpoints';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
// import course from "../../studentCourse/courses/course";
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import useFetch from '../../hoc/useFetch';
import axios from 'axios';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
let array = [];
let courseVal = [];

let link1;
let link2;
let link3;
let link4;
let finalUrl;
const Report = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem("udaanDetails")));
  // const [level, setLevel] = useState('');
  const [checkLoader] = useState(false);
  // const [levelUpdate, setLevelUpdate] = useState('');
  // const [levelId, setlevelId] = useState('');
  // const [open, setOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [roleId, setRoleId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [branch, setBranch] = useState(null);
  const [bottomHRef, setBottomHRef] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [permission, setPermission] = useState([]);
  const [courseReportModuleId, setCourseReportModuleId] = useState(null);

  const [courseFullList, setCourseFullList] = useState([]);

  // const verifyEmail = auth
  // && auth.academic_profile
  // && auth.academic_profile.user.email;

  // const verify=verifyEmail.includes("@orchids.edu.in")
  const loginData = JSON.parse(localStorage.getItem("udaanDetails"));
  var verify = loginData.role_permission.is_orchids;

  const [courseIdVal, setCourseIdVal] = useState(null);
  const { setAlert } = useContext(AlertNotificationContext);
  const {
    data: levelList,
    isLoading: levelListLoading,
    doFetch: fetchlevel,
  } = useFetch([]);
  // const {
  //   data: roleList,
  //   isLoading: roleListLoading,
  //   doFetch: fetchRoles,
  // } = useFetch(null);

  const {
    data: courseList,
    isLoading: courseListLoading,
    doFetch: fetchcourseList,
  } = useFetch(null);
  const {
    data: branchList,
    isLoading: branchListLoading,
    doFetch: fetchBranches,
  } = useFetch(null);
  // console.log(levelList.total_pages);
  // const {
  //   data: UpdateLevelResponse,
  //   isLoading: updateLevelLoading,
  //   doFetch: fetchupdateLevel,
  // } = useFetch([]);

  useEffect(() => {
    if (courseList?.length > 0) {
      const defaultCourse = [{
        course_name: "Select All",
        id: 0
      }];
      const finalCourses = defaultCourse.concat(courseList)
      setCourseFullList(finalCourses);
    }

  }, [courseList])

  const [trainingTypeList] = useState([
    {
      id: "1",
      name: "Induction Training",
    },
    {
      id: "4",
      name: "Subject Training",
    },
    // {
    //   id: '3',
    //   name: 'Trainer Driven',
    // },
  ]);

  const [trainingType, setTrainingType] = useState("");
  let isRoleChosen = false;
  let isTrainingTypeChosen = false;
  // let array=[];

  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Course_Wise_Report' || item.module_type === 'Reports') {
        setCourseReportModuleId(item.module);
        getPermissonData(item.module);
      }
    })
  }, [])

  useEffect(() => {
    // console.log(courseId,courseIdVal)
    // courseVal.length=0;
    let courseIDList = []
    // courseVal.splice(0, courseVal.length);
    courseId && courseId.map((each) => {
      courseIDList.push(each.id)
    })
    // for (let i = 0; i < courseId && courseId.length; i += 1) {
    //   courseIDList.push(
    //     courseList &&
    //     courseList.filter((item) => item.course_name === courseId[i].course_name)[0].id
    //   );
    // }
    console.log("Test", courseId, courseIDList);
    // if (page || rowsPerPage) {
    if (branch && trainingType && roleId && courseId && courseReportModuleId) {
      if (startDate && endDate) {
        fetchlevel({
          url: `${endpoints.sureLearning.userReportApi}?page=${page +
            1}&page_size=${rowsPerPage ||
            10}&role_id=${array}&course_type=${trainingType?.id}&course_id=${courseIDList}&start_date=${startDate}&end_date=${endDate}&branch=${branch?.id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.personal_info.token}`,
            module: courseReportModuleId,
          },
        });
      } else if (startDate) {
        fetchlevel({
          url: `${endpoints.sureLearning.userReportApi}?page=${page +
            1}&page_size=${rowsPerPage ||
            10}&role_id=${array}&course_type=${trainingType?.id}&course_id=${courseIDList}&start_date=${startDate}&branch=${branch?.id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.personal_info.token}`,
            module: courseReportModuleId,
          },
        });
      } else if (endDate) {
        fetchlevel({
          url: `${endpoints.sureLearning.userReportApi}?page=${page +
            1}&page_size=${rowsPerPage ||
            10}&role_id=${array}&course_type=${trainingType?.id}&course_id=${courseIDList}&end_date=${endDate}&branch=${branch?.id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.personal_info.token}`,
            module: courseReportModuleId,
          },
        });
      } else {
        fetchlevel({
          url: `${endpoints.sureLearning.userReportApi}?page=${page +
            1}&page_size=${rowsPerPage ||
            10}&role_id=${array}&course_type=${trainingType?.id}&course_id=${courseIDList}&branch=${branch?.id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.personal_info.token}`,
            module: courseReportModuleId,
          },
        });
      }
    }
  }, [searchClicked, page, fetchlevel, rowsPerPage, auth.personal_info.token, courseReportModuleId]);

  useEffect(() => {
    let courseIDList = []
    // courseVal.splice(0, courseVal.length);
    courseId && courseId.map((each) => {
      courseIDList.push(each.id)
    })
    // for (let i = 0; i < courseId && courseId.length; i += 1) {
    //   courseIDList.push(
    //     courseList &&
    //     courseList.filter((item) => item.course_name === courseId[i].course_name)[0].id
    //   );
    // }
    console.log("Test", courseId, courseIDList);
    if (roleId && trainingType && courseId) {
      if (startDate && endDate) {
        setBottomHRef([
          {
            csv: `${endpoints.sureLearning.courseWiseReportExcelApi
              }?course_id=${courseIDList}&role_id=${array}&course_type=${trainingType?.id}&start_date=${startDate}&end_date=${endDate}&branch=${branch?.id}&Authorization=Bearer ${auth.personal_info.token
              }&module=${courseReportModuleId}&export_type=csv`,
          },
        ]);
      } else if (startDate) {
        setBottomHRef([
          {
            csv: `${endpoints.sureLearning.courseWiseReportExcelApi
              }?course_id=${courseIDList}&role_id=${array}&course_type=${trainingType?.id}&start_date=${startDate}&branch=${branch?.id}&Authorization=Bearer ${auth.personal_info.token
              }&module=${courseReportModuleId}&export_type=csv`,
          },
        ]);
      } else if (endDate) {
        setBottomHRef([
          {
            csv: `${endpoints.sureLearning.courseWiseReportExcelApi
              }?course_id=${courseIDList}&role_id=${array}&course_type=${trainingType?.id}&end_date=${endDate}&branch=${branch?.id}&Authorization=Bearer ${auth.personal_info.token
              }&module=${courseReportModuleId}&export_type=csv`,
          },
        ]);
      } else {
        setBottomHRef([
          {
            csv: `${endpoints.sureLearning.courseWiseReportExcelApi
              }?course_id=${courseIDList}&role_id=${array}&course_type=${trainingType?.id}&branch=${branch?.id}&Authorization=Bearer ${auth.personal_info.token
              }&module=${courseReportModuleId}&export_type=csv`,
          },
        ]);
      }
    }
  }, [
    setBottomHRef,
    roleId,
    trainingType,
    courseId,
    startDate,
    endDate,
    branch,
  ]);

  const handleStartDateChange = (val) => {
    // console.log(array)
    setStartDate(val);
  };
  const handleEndDateChange = (val) => {
    setEndDate(val);
    // console.log(array)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (!rowsPerPage) {
      setRowsPerPage(10);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  function firstPageChange() {
    setPage(0);
  }

  function lastPageChange(lastPage) {
    setPage(lastPage);
  }
  useEffect(() => {
    // fetchlevel({
    //   url: `${endpoints.sureLearning.userReportApi}?course_id=${courseId}`,
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${auth.personal_info.token}`,
    //   },
    //   fetchlevel,
    // });
    link1 = `${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=USER`;
    link2 = `${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=USER`;
    link3 = `${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=ADMIN`;
    link4 = `${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=ADMIN`;

    finalUrl =
      auth.role_permission.user_type === "USER"
        ? verify
          ? link1
          : link2
        : auth.role_permission.user_type === "ADMIN"
          ? verify
            ? link3
            : link4
          : null;
    async function getRole() {
      const response = await fetch(finalUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: courseReportModuleId,
        },
      });
      const getData = await response.json();
      return getData;
    }
    getRole().then((data) => {
      const defaultRole = [{
        role_id: 0,
        role_name: 'Select All',
        is_orchids: true,
        user_type: "USER"
      }]
      const finalRoleList = defaultRole.concat(data.response);
      setRoleList(finalRoleList);
    });

    // fetchRoles({
    //   url: endpoints.sureLearning.courseRoleApi,
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${auth.personal_info.token}`,
    //   },
    // });
    fetchBranches({
      url: endpoints.sureLearning.getBranchNamesApi,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: courseReportModuleId,
      },
    });
  }, [fetchlevel, fetchBranches, auth.personal_info.token, courseReportModuleId]);

  let loader = null;
  if (levelListLoading || checkLoader || courseListLoading) {
    loader = <Loader open />;
  }

  const getReports = () => {
    setSearchClicked(!searchClicked);
    setPage(0);
    if (!branch) {
      setAlert('warning', "Select a branch");
      return;
    }
    if (!roleId) {
      setAlert('warning', "Select a role");
      return;
    }
    if (!trainingType) {
      setAlert('warning', "Select a training type");
      return;
    }
    if (!courseId) {
      setAlert('warning', "Select a course");
    }
  };

  const roleChosen = (e) => {
    // setRoleId(e.target.value);
    // console.log(branch)
    setRoleId(e.target.value);
    isRoleChosen = true;
    setCourseId(null);
    setCourseIdVal(null);

  };

  // async function getCourse(e) {
  //   const response = await fetch(
  //     `${endpoints.sureLearning.courseListApi}?role_id=${array}&course_type=${e.target.value}`,
  //     {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${auth.personal_info.token}`,
  //     },
  //   });
  //   const getData = await response.json();
  //   return getData;
  // }

  const trainingTypeChosen = (value) => {
    if (!branch) {
      setAlert('warning', "select Branch");
      return;
    }
    if (roleId.length === 0) {
      setAlert('warning', "Select Role");
      return;
    }

    // const array = [];
    // array.length=0;
    // console.log("role"+roleId);
    array.splice(0, array.length);
    console.log("name", roleId);
    for (let i = 0; i < roleId.length; i += 1) {
      array.push(
        roleList &&
        roleList.filter((item) => item.role_name === roleId[i].role_name)[0]
          .role_id
      );
    }
    console.log("role id", array);

    setTrainingType(value);
    isTrainingTypeChosen = true;

    fetchcourseList({
      url: `${endpoints.sureLearning.courseListApi}?role_id=${array}&course_type=${value.id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: courseReportModuleId,
      },
    });
    // getCourse(e).then((data) => {
    //   console.log(data);
    //   setCourseList(data);
    // });

    setCourseId(null);
    // console.log(array)
  };

  const setCourse = (e) => {
    setCourseId(e.target.value);
    setCourseIdVal(e.target.value);
  };

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


  const isAllSelected =
    roleList?.length > 0 &&
    roleId?.length === roleList?.length;
  const handleChange = (event) => {
    const value = event.target.value;
    console.log(value, "handleChange");
    const roleeList = roleList.map((item) => item?.role_name);
    if (value[value.length - 1] === "all") {
      setRoleId(roleId?.length === roleList?.length ? [] : roleeList);

      return;
    }
    setRoleId(value);
  };

  const isAllCoursesSelected =
    courseList?.length > 0 && courseIdVal?.length === courseList?.length;

  console.log(
    isAllCoursesSelected,
    courseList?.length,
    courseIdVal?.length,
    "isAllCoursesSelected"
  );

  const handleCourseChange = (event, value) => {
    for (let i = 0; i < value.length; i++) {
      if (value[i]?.course_name === 'Select All') {
        const courses = [];
        courseFullList.map((item, index) => {
          courses.push(item);
        }
        )
        courses.splice(0, 1);
        setCourseIdVal(courses);
        setCourseId(courses);
        return;
      } else {
        setCourseIdVal(value);
        setCourseId(value);
      }
    }

  };

  function handleRoleChange(event, value) {
    for (let i = 0; i <= value.length; i++) {
      if (value[i]?.role_name === 'Select All') {
        const roles = [];
        roleList.map((item, index) => {
          roles.push(item);
        }
        )
        roles.splice(0, 1);
        setRoleId(roles);
        return;
      } else {
        setRoleId(value)
      }
    }

  }

  function handleBranchChange(e, value) {
    setBranch(value);
    setRoleId(null);
    setTrainingType("");
    setCourseIdVal(null);
    setStartDate(null);
    setEndDate(null);
  }

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Sure Learning'
        childComponentName='Course Wise User Report'
        isAcademicYearVisible={true}
      />
      <div style={{ margin: ' 5px 40px 5px 40px' }}>
        <div className={classes.tableMargin}>
          <Grid container spacing={2} alignItems="center">
            <Grid item md={3} xs={12}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={handleBranchChange}
                value={branch || ""}
                options={branchList || ''}
                getOptionLabel={(option) => option?.branch_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Select Branch'
                    placeholder='Select Branch'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                multiple
                style={{ width: '100%' }}
                size='small'
                limitTags={2}
                className='dropdownIcon'
                onChange={handleRoleChange}
                value={roleId || []}
                options={roleList || ''}
                getOptionLabel={(option) => option?.role_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Select Role'
                    placeholder='Select Role'
                  />
                )}
              />
            </Grid>

            <Grid item md={3} xs={12}>
              <Autocomplete
                // multiple
                style={{ width: '100%' }}
                size='small'
                onChange={(e, value) => trainingTypeChosen(value)}
                value={trainingType || ""}
                options={trainingTypeList || ''}
                getOptionLabel={(option) => option?.name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Select Training'
                    placeholder='Select Training'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Autocomplete
                multiple
                style={{ width: '100%' }}
                size='small'
                limitTags={2}
                className='dropdownIcon'
                onChange={handleCourseChange}
                value={courseIdVal || []}
                options={courseFullList || []}
                getOptionLabel={(option) => option?.course_name || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Select Course'
                    placeholder='Select Course'
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography>Start Date</Typography>
              <TextField
                className={classes.textField}
                margin="dense"
                required
                fullWidth
                onChange={(e) => handleStartDateChange(e.target.value)}
                type="date"
                value={startDate || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Typography>End Date</Typography>
              <TextField
                className={classes.textField}
                margin="dense"
                required
                fullWidth
                onChange={(e) => handleEndDateChange(e.target.value)}
                type="date"
                value={endDate || ""}
                variant="outlined"
              />
            </Grid>
            <Grid item md={1} xs={12}>
              <Button
                style={{ marginTop: "30px" }}
                // className={classes.updateButton}
                className={classes.button}
                color="primary"
                // size="small"
                variant="contained"
                fullWidth
                onClick={() => getReports()}
              >
                Search
              </Button>
              {/* </Grid>

              <Grid item md={1} xs={12}> */}
            </Grid>
            <Grid item md={1} xs={12}>
              {permission.can_export ? (
                <Button
                  style={{ marginTop: "30px" }}
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  fullWidth
                  href={bottomHRef && bottomHRef[0].csv}
                  disabled={
                    !(
                      roleId !== "" &&
                      roleId !== undefined &&
                      trainingType !== "" &&
                      trainingType !== undefined &&
                      courseId !== "" &&
                      courseId !== undefined &&
                      branch !== "" &&
                      branch !== undefined
                    )
                  }
                >
                  Download
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </div>
      </div>
      <>
        {levelList && levelList.length !== 0 && (
          <Paper className={classes.paper}>
            {levelList &&
              levelList?.courses?.map((courseItr, itr) => (
                <>
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="spanning table"
                    style={{ marginTop: "4%" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          colSpan="7"
                          style={{ fontWeight: "bold", fontSize: "120%" }}
                          align="left"
                        >
                          Courses:{" "}
                          {levelList &&
                            levelList.length !== 0 &&
                            levelList.courses[itr].course_name}{" "}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }} align="left">
                          S.No.
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} align="left">
                          Name{" "}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} align="left">
                          ERP{" "}
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} align="left">
                          Branch{" "}
                        </TableCell>
                        {/* <TableCell style={{ fontWeight: 'bold' }} align="left">
                      {console.log("hi",levelList.courses[itr].result[0].chapters.length)}
                    </TableCell> */}
                        {levelList &&
                          levelList.length !== 0 &&
                          levelList.courses[itr] &&
                          levelList.courses[itr].chapter_title &&
                          levelList.courses[itr].chapter_title.length > 0 &&
                          levelList.courses[itr].chapter_title.map(
                            (chapterTitle, i) => (
                              <TableCell
                                colSpan={
                                  levelList &&
                                    levelList.courses[itr].result[0] &&
                                    levelList.courses[itr].result[0].chapters[
                                    i
                                    ] !== undefined
                                    ? (Object.keys(
                                      Object.values(
                                        levelList.courses[itr].result[0]
                                          .chapters[i]
                                      )[0]
                                    ).length /
                                      3) *
                                    2
                                    : 1
                                }
                                key={i}
                                style={{ fontWeight: "bold" }}
                                align="center"
                              >
                                {chapterTitle !== ""
                                  ? chapterTitle
                                  : "No Chapter Name"}
                              </TableCell>
                            )
                          )}
                      </TableRow>
                      <TableRow>
                        <TableCell align="left" colSpan={4} />
                        {levelList &&
                          levelList.length !== 0 &&
                          levelList &&
                          levelList.courses[itr].result &&
                          levelList.courses[itr].result[0] &&
                          levelList.courses[itr].result[0].chapters.map(
                            (chapter) =>
                              Object.entries(chapter).map(([key, value], i) => (
                                <>
                                  {Object.entries(value).map(
                                    ([keyy, valuee]) => {
                                      if (keyy.toString().startsWith("title")) {
                                        return (
                                          <>
                                            <TableCell
                                              align="center"
                                              style={{ fontWeight: "bold" }}
                                            >
                                              {valuee.toString() !== ""
                                                ? `${valuee}`
                                                : `Quiz ${parseInt(
                                                  keyy.split("title")[1],
                                                  10
                                                ) + 1}`}
                                            </TableCell>
                                            <TableCell
                                              align="center"
                                              style={{ fontWeight: "bold" }}
                                            >
                                              Attempts
                                            </TableCell>
                                          </>
                                        );
                                      }
                                      return null;
                                    }
                                  )}
                                </>
                              ))
                          )}
                        {/* <TableCell>
                          {console.log(levelList.courses[0].result[0].chapters)}
                          hi
                        </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <>
                      <TableBody>
                        {levelList &&
                          levelList.length !== 0 &&
                          levelList &&
                          levelList.courses[itr].result &&
                          levelList.courses[itr].result.length === 0 ? (
                          <Typography
                            variant="h5"
                            style={{ textAlign: "center", color: "blue", width: '100%' }}
                          >
                            Records Not Found
                          </Typography>
                        ) : (
                          levelList &&
                          levelList.courses[itr].result &&
                          levelList.courses[itr].result.map((data, i) => (
                            <TableRow key={data.user_id}>
                              <TableCell align="left">{i + 1}</TableCell>
                              <TableCell align="left">{data.name}</TableCell>
                              <TableCell align="left">{data.erp}</TableCell>
                              <TableCell align="left">
                                {data.branch && data.branch.length !== 0
                                  ? data.branch.reduce(
                                    (accumulator, eachBranch) =>
                                      `${accumulator}, ${eachBranch}`
                                  )
                                  : null}
                              </TableCell>
                              {data.chapters &&
                                data.chapters.length > 0 &&
                                data.chapters.map((chapter) =>
                                  Object.entries(chapter).map(
                                    ([key, value]) => (
                                      <>
                                        {Object.entries(value).map(
                                          ([keyy, valuee]) => {
                                            if (
                                              !keyy
                                                .toString()
                                                .startsWith("title")
                                            ) {
                                              return (
                                                <TableCell align="center">
                                                  {valuee}
                                                </TableCell>
                                              );
                                            }
                                            return null;
                                          }
                                        )}
                                      </>
                                    )
                                  )
                                )}
                            </TableRow>
                          ))
                        )}
                        <TableRow></TableRow>
                      </TableBody>
                    </>
                  </Table>
                </>
              ))}
            <Table>
              {levelList !== "undefined" && ( //.result.length
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      labelDisplayedRows={() =>
                        `Page ${page + 1} of ${+levelList.total_pages}`
                      }
                      rowsPerPageOptions={[10, 20, 30]}
                      count={+levelList.count}
                      colSpan={3}
                      rowsPerPage={rowsPerPage || 10}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                    <TableCell>
                      <IconButton
                        onClick={firstPageChange}
                        disabled={page === 0 || page === 1}
                      >
                        <FirstPageIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          lastPageChange(levelList.total_pages - 1)
                        }
                        disabled={page === +levelList.total_pages - 1}
                      >
                        <LastPageIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </Paper>
        )}
      </>
      <div />
      {loader}
    </Layout>
  );
};

Report.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(Report);
