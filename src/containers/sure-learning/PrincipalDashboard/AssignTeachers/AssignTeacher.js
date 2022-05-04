/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import { Grid, TablePagination, IconButton } from "@material-ui/core";
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import useFetch from "../../hoc/useFetch";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import endpoints from 'config/endpoints';
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 650,
    marginTop: "2rem",
  },
}));

function AssignTeacher() {
  const [auth] = useState(JSON.parse(localStorage.getItem("udaanDetails")));
  // const [branches, setBranches] = useState([]);
  // const [courses, setCourses] = useState([]);
  // console.log(auth.academic_profile.user.username)
  const [loader, setLoader] = useState(false);
  // const [isItemSelected, setItemSelected] = useState(false);
  const [selected, setSelected] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courseSelected, setCourseSelected] = useState("");
  const classes = useStyles();
  // const theme = useTheme();
  // const [personName, setPersonName] = useState([]);
  const [branchWiseTeachers, setBranchWiseTeachers] = useState([]);

  const [roleId, setRoleId] = useState("");
  const [roleList, setRoleList] = useState("");
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [rowsPerPage, setRowsPerPage] = useState(null);
  const [page, setPage] = useState(0);
  const [permission, setPermission] = useState([]);
  const [dopen, setDopen] = useState(false);
  const [erp, setErp] = useState(null);
  const [reducePendingtime, setReducePendingtime] = useState("");
  const { setAlert } = useContext(AlertNotificationContext);
  console.log(reducePendingtime);
  const [categoryId, setCategoryId] = useState("0");
  const [subCategoryId, setSubCategoryId] = useState("0");
  const [assignTraineeModuleId, setAssignTraineeModuleId] = useState(null);
  const {
    data: categoryList,
    isLoading: categoryListLoading,
    doFetch: fetchCategoryList,
  } = useFetch(null);
  const {
    data: subCategoryList,
    isLoading: subCategoryListLoading,
    doFetch: fetchSubCategoryList,
  } = useFetch(null);
  const {
    data: courses,
    isLoading: coursesListLoading,
    doFetch: fetchCoursesList,
  } = useFetch(null);
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

  // const handleDateChangeFunc = (date) => {
  //   setSelectedDate(date);
  // };

  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Assign_Trainee' && item.module_type === 'Self_Driven') {
        setAssignTraineeModuleId(item.module);
        getPermissonData(item.module);
      }
    })
  }, [])

  const assignTeachersSubmit = async () => {
    if (!selected || !startDate || !endDate || !courseSelected) {
      setAlert('warning', "Select all fields");
    } else {
      const data = {
        applicants_id: selected,
        start_date: startDate,
        end_date: endDate,
        course_id: courseSelected,
        role_id: roleId,
        type: 0,
      };
      setLoader(true);
      const response = await fetch(endpoints.sureLearning.assignTheTeachers, {
        method: "POST", // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assignTraineeModuleId,
        },
      })
        .then((response) => {
          setAlert('success', "Course Assigned Successfully");
          return response;
        })
        .catch((error) => {
          setAlert("error", "Something went wrong try again");
        });

      setBranchWiseTeachers([]);
      setStartDate("");
      setEndDate("");
      // setPersonName([]);
      setCourseSelected("");
      setLoader(false);
    }
    return 0;
  };

  // function getStyles(name, personNames, themes) {
  //   return {
  //     fontWeight:
  //       personNames.indexOf(name) === -1
  //         ? themes.typography.fontWeightRegular
  //         : themes.typography.fontWeightMedium,
  //   };
  // }

  const handleDateChange = (date, id) => {
    // let datePart = date.match(/\d+/g);
    // let year = datePart[0]; // get only two digits
    // let month = datePart[1];
    // let day = datePart[2];
    // let newDateFormat = day + "-" + month + "-" + year;
    // console.log(newDateFormat);
    if (id === "startdate") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  if (startDate && endDate && startDate > endDate) {
    console.log("error");
  } else {
    console.log("correct");
  }

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

  async function getData(url) {
    setLoader(true);
    const dataResult = fetch(url, {
      method: "GET",
      cache: "reload",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: assignTraineeModuleId,
      },
    });
    const response = await dataResult;
    const finalData = await response.json();
    // setLoader(false);
    return finalData;
  }

  const getCoursesBasedOnCategoryAndSubCategory = (subCatId, roleInfo) => {
    fetchCoursesList({
      url: `${endpoints.sureLearning.assignTeacherCoursesListAPI}?role=${roleInfo ||
        roleId}&category=${categoryId}${subCatId !== "0" ? `&sub_category=${subCatId}` : ""
        }`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.personal_info.token}`,
        module: assignTraineeModuleId,
      },
    });
  };
  useEffect(() => {
    // getData(endpoints.sureLearning.getBranchNamesApi).then((data) => {
    //   setBranches(data);
    // });
    if (assignTraineeModuleId) {
      getData(endpoints.sureLearning.assignTeacherRoleList)
        .then((data) => {
          setRoleList(data);
          setLoader(false);
        })
        .then(() => setLoader(false))
        .catch(() => setLoader(false));
      fetchCategoryList({
        url: endpoints.sureLearning.courseSubCategoryListApi,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assignTraineeModuleId,
        },
      });
    }

  }, [assignTraineeModuleId]);

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

  const getAllSubcats = (catId) => {
    if (!roleId) {
      setAlert('warning', "Role is required");
    } else {
      fetchCoursesList({
        url: `${endpoints.sureLearning.assignTeacherCoursesListAPI}?role=${roleId}&category=${catId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assignTraineeModuleId,
        },
      });
      fetchSubCategoryList({
        url: `${endpoints.sureLearning.courseSubCategoryListApi}?category=${catId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assignTraineeModuleId,
        },
      });
    }
  };
  // useEffect(() => {
  //   if (roleId) {
  //     getData(
  //       `${endpoints.sureLearning.principalCompletedViewCourseApi}?role_id=${roleId}`,
  //     ).then((data) => {
  //       setCourses(data);
  //       setLoader(false);
  //     })
  //       .then(() => setLoader(false))
  //       .catch(() => setLoader(false));
  //   }
  // }, [roleId]);

  const branchWiseTeachersChange = async (courseIds, RoleId, assignTraineeModuleId) => {
    setLoader(true);
    const response = await fetch(
      `${endpoints.sureLearning.branchWiseTeachers
      }?role_id=${RoleId}&course_id=${courseIds}&page_size=${rowsPerPage ||
      5}&page=${page + 1}`,
      {
        method: "GET", // or 'PUT'
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          "Content-Type": "Application/json",
          module: assignTraineeModuleId,
        },
      }
    );
    const getDataiNFO = await response.json();
    setLoader(false);
    return getDataiNFO;
  };

  // const handleChange = (event) => {
  //   setPersonName(event.target.value);
  // };

  const handleCourseChange = (event) => {
    setCourseSelected(event.target.value);
  };

  useEffect(() => {
    if (courseSelected && roleId && assignTraineeModuleId) {
      branchWiseTeachersChange(courseSelected, roleId, assignTraineeModuleId).then((data) => {
        setLoader(false);
        setBranchWiseTeachers(data);
      });
    }
  }, [page, rowsPerPage, courseSelected, dopen, roleId, assignTraineeModuleId]);

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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
  const handleEdit = (e, user) => {
    console.log("handle", user);
    setErp(user);
    setDopen(!dopen);
  };
  const handleReducePendingHours = () => {
    const data = {
      username: erp,
      // auth.academic_profile.user.username,
      duration: reducePendingtime,
    };
    // const response = fetch(endpoints.sureLearning.ReducePendingHours, {
    //   method: "PUT",
    //   body: JSON.stringify(data), // data can be `string` or {object}!
    //   headers: {
    //     "Content-Type": "Application/json",
    //     Authorization: `Bearer ${auth.personal_info.token}`,
    //     module: assignTraineeModuleId,
    //   },
    // })
    //   .then((response) => {
    //     console.log(response);
    //     setAlert('success',"Course Assigned Successfully");
    //     setDopen(!dopen);
    //     return response;
    //   })
    //   .catch((error) => {
    //     alert.erros("Something went wrong try again");
    //   });

    axios
      .put(`${endpoints.sureLearning.ReducePendingHours}`, data, {
        headers: {
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assignTraineeModuleId,
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        let res = result.data.message;
        let capitalizedResponse = res[0].toUpperCase() + res.slice(1);
        setAlert('success', capitalizedResponse);
        setDopen(!dopen);
        setReducePendingtime("");
      })
      .catch((error) => {
        console.log(error);
        // setAlert('warning',error.response.data.message);
      });
  };
  const handleClose = () => {
    setDopen(false);
    setReducePendingtime("");
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  function handelSelectAll() {
    if (
      branchWiseTeachers &&
      branchWiseTeachers.results &&
      branchWiseTeachers.results.length < 1
    ) {
      setAlert('warning', "No Data Found");
      return 0;
    }
    if (
      selected.length ===
      (branchWiseTeachers &&
        branchWiseTeachers.results &&
        branchWiseTeachers.results.length)
    ) {
      setSelected([]);
    } else {
      const array = [];
      const n = branchWiseTeachers && branchWiseTeachers.results.length;
      for (let i = 0; i < n; i += 1) {
        array.push(branchWiseTeachers.results[i].user.id);
      }
      setSelected(array);
    }
  }

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Sure Learning'
        childComponentName='Assign Trainee'
        isAcademicYearVisible={true}
      />
      {(loader ||
        categoryListLoading ||
        subCategoryListLoading ||
        coursesListLoading) === true && (
          <Backdrop className={classes.backdrop} open>
            <CircularProgress />
          </Backdrop>
        )}
      <div style={{ margin: ' 5px 40px 5px 40px' }}>
        {/* <h2 style={{ textAlign: "center", marginTop: "0.4rem" }}>
          Assign Trainee
        </h2>
        <br /> */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4 , 1fr)",
            gridGap: "1rem",
          }}
        >
          {/* <div
            style={{
              width: '100%',
            }}
          >
            <InputLabel
              id="demo-mutiple-name-label"
              style={{ fontWeight: 'bold', color: 'black' }}
            >
              Select Branch
            </InputLabel>
            <TextField
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              multiple
              value={personName}
              onChange={handleChange}
              input={<Input />}
              MenuProps={MenuProps}
              style={{ width: '100%', paddingBottom: '3px' }}
            >
              {branches
                && branches.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                    style={getStyles(item.branch_name, personName, theme)}
                  >
                    {item.branch_name}
                  </MenuItem>
                ))}
            </Select>
          </div> */}
          <div
            style={{
              width: "100%",
            }}
          >
            {/* <InputLabel
              id="demo-mutiple-name-label"
              style={{ fontWeight: "bold", color: "black" }}
            >
              Select Roles
            </InputLabel> */}
            <TextField
              margin="dense"
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              value={roleId}
              onChange={(e) => {
                setRoleId(e.target.value);
                setCategoryId("0");
                setSubCategoryId("0");
                getCoursesBasedOnCategoryAndSubCategory("0", e.target.value);
              }}
              input={<Input />}
              variant="outlined"
              label=" Select Role"
              select
              MenuProps={MenuProps}
              style={{ width: "100%", paddingBottom: "3px" }}
            >
              {roleList &&
                roleList.map(
                  (item) =>
                    item &&
                    item.assigned_positions &&
                    item.assigned_positions.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))
                )}
            </TextField>
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            {/* <InputLabel
              id="demo-mutiple-name-label"
              style={{ fontWeight: "bold", color: "black" }}
            >
              Select Category
            </InputLabel> */}
            <TextField
              margin="dense"
              value={categoryId || ""}
              onChange={(e) => {
                setCategoryId(e.target.value);
                getAllSubcats(e.target.value);
              }}
              variant="outlined"
              input={<Input />}
              MenuProps={MenuProps}
              style={{ width: "100%", paddingBottom: "3px" }}
              label="Select Category"
              select
            >
              <MenuItem value="0" key="0" id="0">
                Select All
              </MenuItem>
              {categoryList &&
                categoryList.length !== 0 &&
                categoryList.map((data) => (
                  <MenuItem
                    value={data.id}
                    key={data.id}
                    name={data.category_name}
                  >
                    {data.id ? data.category_name : ""}
                  </MenuItem>
                ))}
            </TextField>
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            {/* <InputLabel
              id="demo-mutiple-name-label"
              style={{ fontWeight: "bold", color: "black" }}
            >
              Select Sub Category
            </InputLabel> */}
            <TextField
              margin="dense"
              value={subCategoryId || ""}
              onChange={(e) => {
                setSubCategoryId(e.target.value);
                getCoursesBasedOnCategoryAndSubCategory(e.target.value);
              }}
              variant="outlined"
              input={<Input />}
              MenuProps={MenuProps}
              style={{ width: "100%", paddingBottom: "3px" }}
              label="Select Sub Category"
              select
            >
              <MenuItem value="0" key="0" id="0">
                Select All
              </MenuItem>
              {subCategoryList &&
                subCategoryList.length !== 0 &&
                subCategoryList.map((data) => (
                  <MenuItem
                    value={data.course_sub_category.id}
                    key={data.course_sub_category.id}
                    name={data.course_sub_category.sub_category_name}
                  >
                    {data.course_sub_category && data.course_sub_category.id
                      ? data.course_sub_category.sub_category_name
                      : ""}
                  </MenuItem>
                ))}
            </TextField>
          </div>
          <div
            style={{
              width: "100%",
            }}
          >
            {/* <InputLabel
              id="demo-mutiple-name-label"
              style={{
                fontWeight: "bold",
                color: "black",
              }}
            >
              Select Courses
            </InputLabel> */}
            <TextField
              margin="dense"
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              value={courseSelected}
              onChange={handleCourseChange}
              input={<Input />}
              MenuProps={MenuProps}
              style={{ width: "100%", paddingBottom: "4px" }}
              variant="outlined"
              label="Select Courses"
              select
            >
              {courses && courses.length !== 0 ? (
                courses.map((item) => (
                  <MenuItem key={item.course.id} value={item.course.id}>
                    {item.course.course_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem key={0} value={0}>
                  No courses Found
                </MenuItem>
              )}
            </TextField>
          </div>
          {branchWiseTeachers &&
            branchWiseTeachers.results &&
            branchWiseTeachers.results.length !== 0 && (
              <>
                <div>
                  {/* <InputLabel
                    id="demo-mutiple-name-label"
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "1rem",
                    }}
                  >
                    Start Date
                  </InputLabel> */}
                  <TextField
                    type="date"
                    id="startdate"
                    style={{ width: "100%", paddingBottom: "4px" }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    label="Start Date"
                    margin = 'dense'
                    onChange={(e) =>
                      handleDateChange(e.target.value, e.target.id)
                    }
                  />
                </div>
                <div>
                  {/* <InputLabel
                    id="demo-mutiple-name-label"
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "1rem",
                    }}
                  >
                    End Date
                  </InputLabel> */}
                  <TextField
                    type="date"
                    id="enddate"
                    style={{ width: "100%", paddingBottom: "4px" }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    label="End Date"
                    margin = 'dense'
                    onChange={(e) =>
                      handleDateChange(e.target.value, e.target.id)
                    }
                  />
                </div>
              </>
            )}
        </div>
      </div>
      {/* <TableContainer component={Paper}> */}
      <div style={{ margin: ' 5px 40px 5px 40px' }}>
        {branchWiseTeachers && branchWiseTeachers.results && (
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Designation</TableCell>
                <TableCell align="center">Mobile No.</TableCell>
                <TableCell align="center">ERP No.</TableCell>
                <TableCell align="center">Branch</TableCell>
                <TableCell align="center">Allotted Hours</TableCell>
                <TableCell align="center">Pending Hours</TableCell>
                {/* <TableCell align="center">Upadate Pending Hours</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                hover
                onClick={() => handelSelectAll()}
                role="checkbox"
                tabIndex={-1}
                key="100000"
                selected={
                  selected.length ===
                  (branchWiseTeachers &&
                    branchWiseTeachers.results &&
                    branchWiseTeachers.results.length)
                }
              >
                <TableCell align="center">
                  <Checkbox
                    checked={
                      selected.length !== 0 &&
                      selected.length ===
                      (branchWiseTeachers &&
                        branchWiseTeachers.results &&
                        branchWiseTeachers.results.length)
                    }
                    onClick={() => handelSelectAll()}
                  />
                </TableCell>
                <TableCell align="center">Select All</TableCell>
              </TableRow>
              {branchWiseTeachers &&
                branchWiseTeachers.results &&
                branchWiseTeachers.results.map((item) => {
                  const isItemSelectedId = isSelected(item?.user?.id);
                  return (
                    <TableRow
                      role="checkbox"
                      tabIndex={-1}
                      key={item?.user?.id}
                      selected={isItemSelectedId}
                    >
                      <TableCell
                        align="center"
                        onClick={(event) => handleClick(event, item.user.id)}
                      >
                        {" "}
                        <Checkbox
                          checked={isItemSelectedId}
                          id={item?.user?.first_name + item?.user?.id}
                          key={item?.user?.first_name + item?.user?.id}
                        // inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {item && item?.user && item?.user?.first_name}
                      </TableCell>
                      <TableCell align="center">{item?.user?.email}</TableCell>
                      <TableCell align="center">
                        {item && item?.role_category && item?.role_category.name}
                      </TableCell>
                      <TableCell align="center">{item?.phone_number}</TableCell>
                      <TableCell align="center">{item?.erp || null}</TableCell>
                      <TableCell align="center">
                        {item?.branch[0]?.branch_name}
                      </TableCell>
                      <TableCell align="center">
                        {item?.duration?.total_duration}
                      </TableCell>
                      <TableCell align="center">
                        {item?.duration?.pending_duration}
                        {/* <EditIcon
                        style={{ cursor: "pointer" }}
                        onClick={(event) => handleEdit(event, item.erp)}
                      /> */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              <Dialog
                open={dopen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Reduce time in minutes
                </DialogTitle>
                <DialogContent>
                  <TextField
                    id="outlined-basic"
                    onChange={(e) => setReducePendingtime(e.target.value)}
                    label="Enter time in minutes"
                    variant="outlined"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} variant="default" color="primary">
                    cancel
                  </Button>
                  <Button
                    onClick={()=>handleReducePendingHours()}
                    variant="contained"
                    color="primary"
                    autoFocus
                    disabled={reducePendingtime === ""}
                  >
                    save
                  </Button>
                </DialogActions>
              </Dialog>
            </TableBody>
          </Table>
        )}
        {branchWiseTeachers &&
          branchWiseTeachers.results &&
          branchWiseTeachers.results.length !== 0 && (
            <Grid item md={12} xs={12}>
              <Paper style={{ backgroundColor: "white", marginTop: "10px" }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TablePagination
                        colSpan={6}
                        labelDisplayedRows={() =>
                          `Page ${page + 1} of ${+branchWiseTeachers.total_pages}`
                        }
                        rowsPerPageOptions={[5, 20, 30]}
                        count={+branchWiseTeachers.count}
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
                            lastPageChange(branchWiseTeachers.total_pages - 1)
                          }
                          disabled={page === +branchWiseTeachers.total_pages - 1}
                        >
                          <LastPageIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          )}
        {permission.can_add ? (
          <>
            {branchWiseTeachers && branchWiseTeachers.results && (
              <Button
                type="submit"
                style={{
                  // backgroundColor: "royalblue",
                  // padding: "0.5rem 1rem",
                  // color: "white",
                  // cursor: "pointer",
                  // border: "1px solid transparent",
                  // borderRadius: "4px",
                  marginTop: "1rem",
                }}
                variant="contained"
                color="primary"
                onClick={assignTeachersSubmit}
              >
                Assign The Teachers
              </Button>
            )}
          </>
        ) : null}
      </div>
      {/* </TableContainer> */}
    </Layout>
  );
}

export default AssignTeacher;
