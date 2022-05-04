/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useContext } from "react";
import {
  withStyles,
  Typography,
  Divider,
  Grid,
  Button,
  //   Table,
  //   TableBody,
  //   TableCell,
  //   TableHead,
  //   TableRow,
  Paper,
  //   Modal,
  //   Fade,
  //   Backdrop,
  //   IconButton,
  TextField,
  //   TableFooter,
  //   TablePagination,
  FormControl,
  ListItemIcon,
  MenuItem,
  Select,
  FormHelperText,
  CircularProgress,

} from "@material-ui/core";
import PropTypes from "prop-types";
// import FirstPageIcon from '@material-ui/icons/FirstPage';
// import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
// import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
// import LastPageIcon from '@material-ui/icons/LastPage';
import styles from "./consolidatedReport.style";
import useFetch from "../../hoc/useFetch";
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../../Layout';
import Backdrop from '@material-ui/core/Backdrop';
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

let status;
let link1;
let link2;
let link3;
let link4;
let finalUrl;
const ConsolidatedReport = ({ classes }) => {
  // const classes = useStyles();
  const [auth] = useState(JSON.parse(localStorage.getItem("udaanDetails")));
  const [checkLoader, setCheckLoader] = useState(false);
  //   const [open, setOpen] = React.useState(false);
  //   const [rowsPerPage, setRowsPerPage] = React.useState(null);
  //   const [page, setPage] = React.useState(0);

  const [role, setRole] = useState([]);
  const [branch, setBranch] = useState("");
  const [email, setEmail] = useState("");
  const { setAlert } = useContext(AlertNotificationContext);
  const [loader, setLoader] = useState(false);
  const [assessmentModuleId, setAssessmentModuleId] = useState(null);

  const [trainingType, setTrainingType] = useState("");
  const [trainingTypeList] = useState([
    {
      id: "1",
      name: "Induction Training",
    },
    {
      id: "2",
      name: "Self Training",
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
  // const verifyEmail = auth
  // && auth.academic_profile
  // && auth.academic_profile.user.email;

  // const verify=verifyEmail.includes("@orchids.edu.in")
  const loginData = JSON.parse(localStorage.getItem("udaanDetails"));
  var verify = loginData.role_permission.is_orchids;

  const {
    data: roleList,
    isLoading: roleListLoading,
    doFetch: fetchRoles,
  } = useFetch(null);

  const {
    data: branchList,
    isLoading: branchListLoading,
    doFetch: fetchBranches,
  } = useFetch(null);


  useEffect(() => {
    const data = auth.role_permission.modules.map((item) => {
      if (item.module_name === 'Consolidated_Report' && item.module_type === 'Reports') {
        setAssessmentModuleId(item.module);
        // getPermissonData(item.module);
      }
    })
  }, [])

  useEffect(() => {
    if (assessmentModuleId) {
      link1 = `${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=USER`;
      link2 = `${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=USER`;
      link3 = `${endpoints.sureLearning.getRoleRegistration}?search=orchids&user_type=ADMIN`;
      link4 = `${endpoints.sureLearning.getRoleRegistration}?search=other&user_type=ADMIN`;

      finalUrl =
        auth?.role_permission?.user_type === "USER"
          ? verify
            ? link1
            : link2
          : auth?.role_permission?.user_type === "ADMIN"
            ? verify
              ? link3
              : link4
            : null;
      fetchRoles({
        url: finalUrl,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assessmentModuleId,
        },
      });
      fetchBranches({
        url: endpoints.sureLearning.getBranchNamesApi,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.personal_info.token}`,
          module: assessmentModuleId,
        },
      });
    }

  }, [fetchRoles, fetchBranches, auth.personal_info.token, assessmentModuleId]);

  //   const handleClose = () => {
  //     setOpen(false);
  //   };

  const sendEmail = () => {
    if (!branch || branch.length === 0) {
      setAlert("warning", "Select Branch");
      return;
    }
    if (!role || role.length === 0) {
      setAlert("warning", "Select Role");
      return;
    }
    if (!trainingType) {
      setAlert("warning", "Select Training Type");
      return;
    }
    if (
      !email ||
      !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        email
      )
    ) {
      setAlert("warning", "Enter a valid email");
      return;
    }
    const roleArr = [];
    for (let i = 0; i < role.length; i += 1) {
      roleArr.push(
        roleList &&
        roleList?.response.filter((item) => item.role_name === role[i])[0]
          .role_id
      );
    }

    const branchArr = [];
    for (let i = 0; i < branch.length; i += 1) {
      branchArr.push(
        branchList &&
        branchList.filter((item) => item.branch_name === branch[i])[0].id
      );
    }

    async function loading() {
      setCheckLoader(true);

      const response = await fetch(
        `${endpoints.sureLearning.consolidatedReportSendMailApi}?branch=${[branchArr]}&role=${[
          roleArr,
        ]}&training_type=${trainingType}&email=${email}`,
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
    loading()
      .then(() => {
        // console.log("status",status)
        if (status === 200) {
          setCheckLoader(false);
          setAlert('success',`Your consolidated report has been sent to ${email}.`);
          // eslint-disable-next-line no-console
        }
        if (status === 404) {
          setCheckLoader(false);
          setAlert("warning", `Data not found on ${email}.`);
        }
        if (status === 400) {
          setCheckLoader(false);
          setAlert("warning", `Bad Request`);
        }
      })
      .catch((error) => {
        setCheckLoader(false);
        setAlert("warning", `Error:${error}`);
      });

    setBranch([]);
    setEmail("");
    setRole([]);
    setTrainingType("");
  };

  // let loader = null;
  // if (roleListLoading || branchListLoading || checkLoader) {
  //   loader = <Loader open />;
  // }

  const isAllSelected =
    roleList?.length > 0 && role?.length === roleList?.length;
  const handleChange = (event) => {
    const value = event.target.value;
    console.log(value[value.length - 1], "handleChange");
    const roleeList = roleList?.response.map((item) => item?.role_name);
    if (value[value.length - 1] === "all") {
      setRole(role?.length === roleList?.length ? [] : roleeList);
      return;
    }
    setRole(value);
  };

  const isAllBranchSelected =
    branchList?.length > 0 && branch?.length === branchList?.length;
  const handleBranchChange = (event) => {
    const value = event.target.value;
    // console.log(value[value.length - 1], "handleChange");
    const branchesList = branchList?.map((item) => item?.branch_name);
    if (value[value.length - 1] === "all") {
      setBranch(branch?.length === branchList?.length ? [] : branchesList);
      return;
    }
    setBranch(value);
  };

  return (
    <Layout>
      <div className={classes.root}>
        <div className={classes.tableMargin}>
          <CommonBreadcrumbs
            componentName='Sure Learning'
            childComponentName='Consolidated Report'
            isAcademicYearVisible={true}
          />
          {(loader || roleListLoading || branchListLoading || checkLoader) === true && (
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
                <Grid item md={6} xs={12}>
                  <Typography>
                    Select Branch
                    <b style={{ color: "red" }}>*</b>
                  </Typography>

                  <FormControl className={classes.formControl}>
                    <Select
                      margin="dense"
                      fullWidth
                      value={branch || []}
                      // onChange={(e) => setSchool(e.target.value)}
                      onChange={handleBranchChange}
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
                            checked={isAllBranchSelected}
                            indeterminate={
                              branch.length > 0 &&
                              branch.length < branchList.length
                            }
                          />
                        </ListItemIcon>
                        <ListItemText
                          classes={{ primary: classes.selectAllText }}
                          primary="Select All"
                        />
                      </MenuItem>
                      {branchList &&
                        branchList.length !== 0 &&
                        branchList.map((data) => (
                          <MenuItem
                            value={data?.branch_name}
                            key={data?.id}
                            name={data?.branch_name}
                          >
                            <Checkbox
                              checked={branch.indexOf(data?.branch_name) > -1}
                            />
                            <ListItemText primary={data?.branch_name} />
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  {/* <Typography>
                  Select Branch
                  <b style={{ color: "red" }}>*</b>
                </Typography>
                <Select
                  margin="dense"
                  fullWidth
                  value={branch || ""}
                  onChange={(e) => setBranch(e.target.value)}
                  className={classes.textField}
                  variant="outlined"
                  style={{ color: "black" }}
                >
                  {branchList &&
                    branchList.length !== 0 &&
                    branchList.map((data) => (
                      <MenuItem
                        value={data.id}
                        key={data.id}
                        name={data.branch_name}
                      >
                        {data.branch_name ? data.branch_name : ""}
                      </MenuItem>
                    ))}
                </Select> */}
                </Grid>

                {/* <Grid item md={6} xs={12}>
                <Typography>
                  Select Role
                  <b style={{ color: 'red' }}>*</b>
                </Typography>
                <Select
                  margin="dense"
                  fullWidth
                  single
                  value={role || []}
                  isRequired
                  onChange={(e) => setRole(e.target.value)}
                  className={classes.textField}
                  variant="outlined"
                  style={{ color: 'black' }}
                >
                  {roleList && roleList.length !== 0 && roleList.map((data) => (
                    <MenuItem
                      value={data.id}
                      key={data.id}
                      name={data.name}
                    >
                      {data.id ? data.name : ''}
                    </MenuItem>
                  ))}

                </Select>
              </Grid> */}
                <Grid item md={6} xs={12}>
                  <Typography>
                    Select Role
                    <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl className={classes.formControl}>
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
                              role?.length > 0 && role?.length < roleList?.length
                            }
                          />
                        </ListItemIcon>
                        <ListItemText
                          classes={{ primary: classes.selectAllText }}
                          primary="Select All"
                        />
                      </MenuItem>
                      {roleList &&
                        roleList?.length !== 0 &&
                        roleList?.response.map((data) => (
                          <MenuItem
                            value={data.role_name}
                            key={data.role_id}
                            name={data.role_name}
                          >
                            <Checkbox
                              checked={role.indexOf(data.role_name) > -1}
                            />
                            <ListItemText primary={data.role_name} />
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  {/* <Typography>
                  Select Role
                  <b style={{ color: "red" }}>*</b>
                </Typography>
                <Select
                  margin="dense"
                  labelId="demo-mutiple-checkbox-label"
                  id="demo-mutiple-checkbox"
                  fullWidth
                  multiple
                  value={role || []}
                  isRequired
                  onChange={(e) => setRole(e.target.value)}
                  className={classes.textField}
                  variant="outlined"
                  style={{ color: "black" }}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {roleList &&
                    roleList.length !== 0 &&
                    roleList.response.map((data) => (
                      <MenuItem
                        value={data.role_name}
                        key={data.role_id}
                        // name={data.name}
                      >
                        <Checkbox checked={role.indexOf(data.role_name) > -1} />
                        <ListItemText primary={data.role_name} />
                      </MenuItem>
                    ))}
                </Select> */}
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography>
                    Select Training
                    <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Select
                    margin="dense"
                    fullWidth
                    value={trainingType || ""}
                    onChange={(e) => setTrainingType(e.target.value)}
                    className={classes.textField}
                    variant="outlined"
                    style={{ color: "black" }}
                  >
                    {trainingTypeList &&
                      trainingTypeList.length !== 0 &&
                      trainingTypeList.map((data, i) =>
                        verify || data.id === "4" ? (
                          <MenuItem
                            value={data.id}
                            key={data.id}
                            name={data.name}
                          >
                            {data.id ? data.name : ""}
                          </MenuItem>
                        ) : (
                          ""
                        )
                      )}
                  </Select>
                </Grid>
                <Grid item md={6}/>
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
                <Grid item md={1} xs={12}>
                  <Button
                    style={{ marginTop: "36px" }}
                    className={classes.updateButton}
                    color="primary"
                    variant="contained"
                    onClick={() => sendEmail()}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </div>
        </div>
      </div>
      {loader}
    </Layout>
  );
};

ConsolidatedReport.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};

export default withStyles(styles)(ConsolidatedReport);
