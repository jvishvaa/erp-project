import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import {
  Divider,
  Grid,
  Select,
  Typography,
  withStyles,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  TextField,
  Button,
  ListItemIcon,
  ListItemText,
  Checkbox,
  CircularProgress,
} from "@material-ui/core";
import styles from "./weeklyReport.style";
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import useFetch from "../../hoc/useFetch";
import endpoints from 'config/endpoints';
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import Backdrop from '@material-ui/core/Backdrop';

let link1;
let link2;
let link3;
let link4;
let finalUrl;
const WeeklyReport = ({ classes }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem("udaanDetails")));
  const [branch, setBranch] = useState([]);
  const [role, setRole] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndtDate] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const { setAlert } = useContext(AlertNotificationContext);
  const [bottomHRef, setButtonRef] = useState("");
  const [SelectedAll, setSelectedAll] = useState(false);
  const [assessmentModuleId, setAssessmentModuleId] = useState(null);
  const [loader, setLoader] = useState(false);


  // const verifyEmail = auth
  //   && auth.academic_profile
  //   && auth.academic_profile.user.email;

  //   let verify=verifyEmail.includes("@orchids.edu.in")
  // if(auth.personal_info.role==="Admin")   verify=true

  const loginData = JSON.parse(localStorage.getItem("udaanDetails"));
  var verify = loginData.role_permission.is_orchids;

  function handleBranches() {
    const array = [];
    if (
      auth &&
      auth.personal_info.role &&
      auth.personal_info.role === "Principal" &&
      auth &&
      auth.academic_profile &&
      auth.academic_profile.branch.length !== 0
    ) {
      for (let i = 0; i < auth.academic_profile.branch.length; i += 1) {
        array.push(auth.academic_profile.branch[i].id);
      }
      return array;
    }
    return array;
  }

  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Weekly_Report' && item.module_type === 'Reports') {
        setAssessmentModuleId(item.module);
        // getPermissonData(item.module);
      }
    })
  }, [])

  useEffect(() => {
    const roleArr = [];
    for (let i = 0; i < role.length; i += 1) {
      roleArr.push(
        roleList &&
        roleList?.response.filter((item) => item.role_name === role[i])[0]
          .role_id
      );
    }
    setButtonRef([
      {
        csv: `${endpoints.sureLearning.weeklyReportDownloadApi
          }?role=${roleArr}&training_type=${trainingType}&branch=${branch.length !== 0 ? branch : handleBranches()
          }&start_date=${startDate}&end_date=${endDate}&Authorization=${`Bearer ${auth.personal_info.token}`}&module=${assessmentModuleId}&export_type=csv`,
      },
    ]);
  }, [branch, role, startDate, endDate, trainingType]);

  const trainingTypeList = [
    { id: 1, value: "Induction Training" },
    { id: 2, value: "Self Driven" },
    { id: 3, value: "Trainer Driven" },
    { id: 4, value: "Subject Training" },
  ];

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

  const {
    data: BranchList,
    isLoading: gettingBranchList,
    doFetch: fetchBranchList,
  } = useFetch([]);

  const {
    data: roleList,
    isLoading: gettingRoleList,
    doFetch: fetchRoleList,
  } = useFetch([]);

  const {
    data: modulePermission,
    isLoading: modulePermissionLoading,
    doFetch: fetchModulePermission,
  } = useFetch(null);

  // let loader = null;
  // if (gettingBranchList || gettingRoleList || modulePermissionLoading) {
  //   loader = <Loader open />;
  // }

  useEffect(() => {
    if (assessmentModuleId) {
      fetchModulePermission({
        url: `${endpoints.sureLearning.getPermissons}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assessmentModuleId,
        },
      });
    }
  }, [assessmentModuleId]);

  function handleDownloadReport() {
    if (
      auth &&
      auth.personal_info.role &&
      auth.personal_info.role !== "Principal" &&
      branch.length === 0
    ) {
      setAlert("warning", "Select Branch");
      return;
    }
    if (!role) {
      setAlert("warning", "Select Role");
      return;
    }
    if (!trainingType) {
      setAlert("warning", "Select Training type");
      return;
    }
    if (!startDate) {
      setAlert("warning", "Select Start Date");
      return;
    }
    if (!endDate) {
      setAlert("warning", "Select End Date");
      return;
    }
    document.getElementById("downloadButton").click();
  }
  function handleSelectALl(e) {
    if (
      SelectedAll === true &&
      e.target.value.length - 1 === BranchList.length
    ) {
      setSelectedAll(false);
      setBranch([]);
      return;
    }
    if (e.target.value.length !== 0) {
      if (
        e.target.value.filter((data) => data === "0").length === 1 &&
        SelectedAll === false
      ) {
        const setarray = [];
        for (let i = 0; i < BranchList.length; i += 1) {
          setarray.push(BranchList[i].id);
        }
        setSelectedAll(true);
        // setselectedBranch(setarray);
        setBranch(setarray);
      } else {
        // setselectedBranch(e.target.value);
        setBranch(e.target.value);
        setSelectedAll(false);
      }
    } else {
      // setselectedBranch([]);
      setBranch(e.target.value);
      setSelectedAll(false);
    }
  }
  useEffect(() => {
    if (auth && assessmentModuleId) {
      fetchBranchList({
        url: endpoints.sureLearning.branchApi,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assessmentModuleId,
        },
      });
      // console.log("verify",verify)

      //kept for future use
      // link1=`${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=USER`
      // link2=`${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=USER`
      // link3=`${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=ADMIN`
      // link4=`${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=ADMIN`

      finalUrl =
        localStorage.getItem("userType") === "USER"
          ? verify
            ? link1
            : link2
          : localStorage.getItem("userType") === "ADMIN"
            ? verify
              ? link3
              : link4
            : null;
      fetchRoleList({
        // url: auth && auth.personal_info.role && auth.personal_info.role === 'Principal' ? endpoints.sureLearning.assignTeacherRoleList : endpoints.sureLearning.courseRoleApi,
        url: `${endpoints.sureLearning.getRoleRegistration}?user_type=USER`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assessmentModuleId,
        },
      });
    }
  }, [auth, assessmentModuleId]);

  const isAllSelected =
    roleList?.length > 0 && role?.length === roleList?.length;
  const handleChange = (event) => {
    const value = event.target.value;
    const roleeList = roleList?.response.map((item) => item.role_name);
    if (value[value.length - 1] === "all") {
      console.log(value[value.length - 1], "handleChange");
      setRole(role?.length === roleList?.length ? [] : roleeList);
      return;
    } else {
      setRole(value);
    }

  };

  return (
    <Layout>
      <CommonBreadcrumbs
        componentName='Sure Learning'
        childComponentName='Weekly Report'
        isAcademicYearVisible={true}
      />
      {(loader || gettingBranchList || gettingRoleList || modulePermissionLoading) === true && (
        <Backdrop
          className={classes.backdrop}
          open
        >
          <CircularProgress />
        </Backdrop>
      )}
      <div style={{ margin: ' 5px 40px 5px 40px' }}>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            {auth &&
              auth.personal_info.role &&
              auth.personal_info.role !== "Principal" && (
                <Grid item md={4} xs={12}>
                  <Typography>
                    Select branches
                    <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl className={classes.formControl} fullWidth>
                    {/* <InputLabel id="demo-controlled-open-select-label">
                      Select branches
                    </InputLabel> */}
                    <Select
                      multiple
                      fullWidth
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      value={branch || []}
                      style={{ minWidth: 120, maxWidth: 550 }}
                      onChange={(e) => handleSelectALl(e)}
                      className={classes.normal}
                      MenuProps={MenuProps}
                    >
                      <MenuItem disabled>Select Branch</MenuItem>
                      <MenuItem key="0" value="0">
                        Select All
                      </MenuItem>
                      {BranchList &&
                        BranchList.length !== 0 &&
                        BranchList.map((dropItem) => (
                          <MenuItem
                            style={{
                              color:
                                branch &&
                                  branch.filter(
                                    (gradeData) => gradeData === dropItem.id
                                  ).length === 1
                                  ? "white"
                                  : "",
                              backgroundColor:
                                branch &&
                                  branch.filter(
                                    (gradeData) => gradeData === dropItem.id
                                  ).length === 1
                                  ? "darkslateblue"
                                  : "",
                            }}
                            value={dropItem.id}
                            key={dropItem.id}
                          >
                            {((auth &&
                              auth.personal_info.role &&
                              auth.personal_info.role !== "Principal"
                              ? dropItem.branch_name
                              : dropItem.name) &&
                              (auth &&
                                auth.personal_info.role &&
                                auth.personal_info.role !== "Principal"
                                ? dropItem.branch_name
                                : dropItem.name)) ||
                              ""}
                            {/* {dropItem.branch_name ? dropItem.branch_name : ''} */}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            <Grid item md={4} xs={12}>
              <Typography>
                Select Role
                <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl className={classes.formControl} fullWidth>
                {/* <InputLabel id="demo-controlled-open-select-label">
                  Select Role
                </InputLabel> */}
                <Select
                  margin="dense"
                  fullWidth
                  value={role || []}
                  // onChange={(e) => setSchool(e.target.value)}
                  onChange={handleChange}
                  // onChange={(e) => handleSelectALlSchool(e)}
                  multiple
                  className={classes.textField}
                  variant="outlined"
                  style={{ color: "black" }}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  <MenuItem key="all" value="all">
                    <ListItemIcon>
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={
                          role.length > 0 && role.length < roleList.length
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      classes={{ primary: classes.selectAllText }}
                      primary="Select All"
                    />
                  </MenuItem>
                  {roleList &&
                    roleList.length !== 0 &&
                    roleList.response.map((data) => (
                      <MenuItem
                        value={data.role_name}
                        key={data.role_id}
                        name={data.role_name}
                      >
                        <Checkbox checked={role.indexOf(data.role_name) > -1} />
                        <ListItemText primary={data.role_name} />
                      </MenuItem>
                    ))}
                  {/* <Select
                margin="dense"
                fullWidth
                multiple
                value={role || []}
                onChange={(e) => { setRole(e.target.value); }}
                className={classes.textField}
              >
                { roleList && roleList.length !== 0 && roleList.response.map((data) => (
                  <MenuItem
                    value={data.role_id}
                    key={data.role_id}
                    name={data.role_name}
                  >
                    {data.role_name ? data.role_name : ''}
                  </MenuItem>
                ))} */}
                  {/* {(auth && auth.personal_info.role && auth.personal_info.role === 'Principal') && roleList && roleList.respone.map((item) => (
                  item.assigned_positions.map((data) => (
                    <MenuItem
                      key={data.role_id}
                      value={data.role_id}
                    >
                      {data.role_name}
                    </MenuItem>
                  ))
                ))} */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <Typography>
                Select Training Type
                <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl className={classes.formControl} fullWidth>
                {/* <InputLabel id="demo-controlled-open-select-label">
                  Select Training Type
                </InputLabel> */}
                <Select
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  value={trainingType || ""}
                  onChange={(e) => setTrainingType(e.target.value)}
                  className={classes.textField}
                >
                  {trainingTypeList &&
                    trainingTypeList.length !== 0 &&
                    trainingTypeList.map((data) =>
                      verify || data.id === 4 ? (
                        <MenuItem value={data.id} key={data.id} name={data.value}>
                          {data.value ? data.value : ""}
                        </MenuItem>
                      ) : (
                        ""
                      )
                    )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4}/>
            <Grid item md={4} xs={12}>
              <TextField
                variant="outlined"
                margin="dense"
                fullWidth
                helperText="Enter Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                variant="outlined"
                margin="dense"
                fullWidth
                helperText="Enter End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndtDate(e.target.value)}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              {modulePermission && modulePermission.response.can_export ? (
                <Button
                  color="primary"
                  variant="contained"
                  style={{ marginTop: "8px" }}
                  onClick={() => handleDownloadReport()}
                >
                  Download Report
                </Button>
              ) : null}
              <Button
                style={{ display: "none" }}
                href={bottomHRef && bottomHRef[0].csv}
                id="downloadButton"
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
      {loader}
    </Layout>
  );
};

WeeklyReport.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(WeeklyReport);
