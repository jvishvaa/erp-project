import React, { useEffect, useState, useContext } from 'react';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  DialogContent,
  DialogTitle,
  Dialog,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Modal from "@material-ui/core/Modal";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import ConfirmModal from '../../../../src/containers/assessment-central/assesment-card/confirm-modal';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  container: {
    maxHeight: '70vh',
    width: '100%',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
    maxWidth: '200px',
    wordBreak: 'break-all',
  },
  buttonContainer: {
    width: '95%',
    margin: '0 auto',
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width : '50%',
    height : '50%'
  },
}));

const columns = [
  {
    id: 'subject_name',
    label: 'Curriculum Name',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'created_by',
    label: 'TERM',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'desc',
    label: 'Assessment Type',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  
  {
    id: 'priority',
    label: 'Priority',
    minWidth: 70,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'optional', 
    label: 'Marks/Metrics',
    minWidth: 70,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'desc',
    label: 'Curriculum Description',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 250,
    align: 'center',
    labelAlign: 'center',
  },
];
const moreDetailscolumns = [
  {
    id: 'test-name',
    label: 'Selected Test Name',
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
];


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ReportConfigTable = () => {
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState([]);

  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [selectedbranch, setSelectedbranch] = useState();
  console.log('new', selectedbranch);
  const [selectedGrade, setSelectedGrade] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [deleteId , setDeleteId ] = useState()
  const [openDetails, setopenDetails] = useState(false)
  const [detailsData , setDetailsData] = useState()
  const [tabValue , setTabValue] = useState(0)
  const [totalsub, settotalSub] = useState()
  const [totalTests , setTotalTests] = useState()
  const [table, setTable] = useState([])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    if (moduleId) getBranch();
  }, [moduleId]);

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'Assessment' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Report Card Config') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, [window.location.pathname]);

  const getBranch = () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          // const allBranchData = res?.data?.data?.results.map((item) => item.branch);
          setBranchList(res?.data?.data?.results);
        } else {
          // setBranchList([]);
        }
      });
  };

  const getGrade = (value) => {
    axiosInstance
      .get(
        // `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${value?.branch?.id}&module_id=${moduleId}`
        `${endpoints.reportCardConfig.branchAPI}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${value
          .map((branch) => branch?.branch?.id)
          .join(',')}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          // setGradeList(res?.data?.data);
          console.log('new', res?.data?.data);
          setGradeList(res?.data?.data);
        } else {
          // setBranchList([]);
        }
      });
  };

  const { setAlert } = useContext(AlertNotificationContext);
  const handleBranch = (e, value = {}) => {
    setSelectedbranch();
    setSelectedGrade();
    setGradeList([]);
    // const Ids = value.map((i)=>i.id)
    if (value) {
      setSelectedbranch(value);
      getGrade(value);
      // setSelectBranchId(Ids)
    } else {
      // setSelectBranchId([])
      setSelectedbranch();
      setSelectedGrade();
    }
  };

  const handleGrade = (e, value) => {
    if (value) {
      setSelectedGrade(value);
      // getGroupTypes()
      // getSection(value)
    } else {
      setSelectedGrade();
    }
  };

  const FilterData = () => {
    {
      if (selectedGrade?.grade_id) {
        setLoading(true);
        let url = `${
          endpoints.questionBank.reportConfig
        }?acad_session=${selectedbranch.map((branch) => branch?.id)}&grade=${
          selectedGrade?.grade_id
        }`;
        let params = {
          acad_session: selectedbranch?.session_year?.id,
          grade: selectedGrade?.grade_id,
        };
        console.log('run', params);
        axiosInstance
          .get(url)
          .then((res) => {
            if (res?.data) {
              setConfigData(res?.data?.result);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  };

  const DeleteData = () => {
    setLoading(true);
    let url = `${endpoints.questionBank.reportConfig}${deleteId}/`;

    axiosInstance
      .delete(url)
      .then((res) => {
        TotalData();

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handlePublish = (id,ispublish) => {
    setLoading(true);
    let url = `${endpoints.questionBank.reportConfig}${id}/`;

    axiosInstance
      .put(url,{
        is_publish : !ispublish
      })
      .then((res) => {
        TotalData();

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const TotalData = () => {
    setLoading(true);
    let url = `${endpoints.questionBank.reportConfig}`;
    axiosInstance
      .get(url)
      .then((res) => {
        if (res?.data) {
          setConfigData(res?.data?.result);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    TotalData();
  }, []);

  const handleCreate = () => {
    history.push('/report-config/create');
  };
  const handleClose = () => {
    setopenDetails(false)
    setTabValue(0)
  }

  const getTestsummary = () => {
    axiosInstance.get(`${endpoints.reportCardConfig.reportcardconfigsummary}`).then((res) => {
      let subjects = [];
      let branches = res?.data?.result?.map((data) => {
       let subject = data?.data?.map((subject) => subject?.subject?.subjects__subject_name)
       subjects.push(subject)
     return data?.branch?.branch_name
      })
      let totalSubjects = ["Branch/Subject"]
      subjects.forEach((item)=> {
        totalSubjects =  totalSubjects.concat(item)
      }
        )
        let subset = [...new Set(totalSubjects)]
     settotalSub(subset)

     let finalres = []
     let subjectList = [...subset]
     subjectList.shift()
    // let data =  subset.forEach((subject,i) => {
      let rr = res?.data?.result?.forEach((data) => {
        let emptyarr = new Array(subjectList.length).fill(0)
       let r = data?.data?.forEach((item) => {
            // if(item?.subject?.subjects__subject_name in subjectList){
              let index = subjectList.indexOf(item?.subject?.subjects__subject_name)
              if(index != -1){
                emptyarr[index] = item?.tests
              }
            // }
        })
        finalres.push(emptyarr)
      })
    // })

    setTotalTests(finalres)

      setTable(res.data.result)
    }).catch(err => {
      console.log(err)
    })
  }

  const handleOpenDetails = (data) => {
    getTestsummary()
    setopenDetails(true)
    setDetailsData(data)
  }

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Assessment'
              childComponentName='Report Card Config'
              //   childComponentNameNext={
              // addFlag && !tableFlag
              //   ? 'Add Category'
              //   : editFlag && !tableFlag
              //   ? 'Edit Category'
              //   : null
              //   }
            />
          </div>
        </div>

        <Grid container spacing={5} style={{ margin: '0px' }}>
          {/* <Grid item xs={12} sm={3} className={'addButtonPadding'}>
            <Autocomplete
              style={{ width: 350 }}
              // value={selectedCentralCategory}
              id='tags-outlined'
              options={'centralCategory'}
              getOptionLabel={(option) => option.category_name}
              filterSelectedOptions
              size='small'
              renderInput={(params) => (
                <TextField {...params} variant='outlined' label='Grade' />
              )}
              onChange={(e, value) => {
                // setSelectedCentralCategory(value);
              }}
              getOptionSelected={(option, value) => value && option.id == value.id}
            />
          </Grid>
        </Grid> */}
          <Grid item md={3} xs={12} style={{ marginLeft: '20px' }}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleBranch}
              id='branch_id'
              className='dropdownIcon'
              value={selectedbranch || []}
              options={branchList || []}
              getOptionLabel={(option) => option?.branch?.branch_name || ''}
              filterSelectedOptions
              multiple
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Branch'
                  placeholder='Branch'
                  required
                />
              )}
            />
          </Grid>

          <Grid item md={3} xs={12}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleGrade}
              id='branch_id'
              className='dropdownIcon'
              value={selectedGrade || ''}
              options={gradeList || []}
              // getOptionLabel={(option) => option?.grade__grade_name || ''}
              getOptionLabel={(option) => option?.grade_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grade'
                  placeholder='Grade'
                  required
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ margin: '0px' }}>
          <Grid item xs={3} sm={2} className={'addButtonPadding'}>
            <Button
              // startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              color='primary'
              size='medium'
              style={{ color: 'white', width: '120px', marginLeft: '20px' }}
              title='Filter'
              onClick={FilterData}
            >
              Filter
            </Button>
          </Grid>
          <Grid item xs={3} sm={3} className={'addButtonPadding'}>
            <Button
              startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              color='primary'
              size='medium'
              style={{ color: 'white' }}
              title='Create'
              onClick={handleCreate}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        <hr />
        <Paper className={`${classes.root} common-table`}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className='table-header-row'>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      className={classes.columnHeader}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {configData.map((data, index) => {
                  return (
                    <TableRow hover subject='checkbox' tabIndex={-1} key={index}>
                      <TableCell className={classes.tableCell}>
                        {data?.component_name}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {data?.sub_component_name}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {data?.column_text}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {data?.priority}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {data?.weightage === 0 ? 'NA' : data?.weightage}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {data?.component_description}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <Button
                          onClick={() => handleOpenDetails(data)}
                          color='primary'
                          variant='contained'
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => {
                            // setOpenModal(true);
                            // setDeleteId(data?.id)
                            handlePublish(data?.id, data?.is_publish);
                          }}
                          style={{ marginLeft: '5%' }}
                          color='primary'
                          variant='contained'
                        >
                          {/* {ispublished ? 'Publish' : 'Unpublish'} */}
                          {data?.is_publish ? 'Unpublish' : 'Publish'}
                        </Button>
                        <IconButton
                          onClick={() => {
                            setOpenModal(true);
                            setDeleteId(data?.id);
                          }}
                          title='Delete'
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>

                        {/* <IconButton
                          //   onClick={(e) => handleEditSubject(configData)}
                          title='Edit'
                        >
                          <EditOutlinedIcon />
                        </IconButton> */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <div className='paginateData'>
                  <TablePagination
                    component='div'
                    count={totalCount}
                    className='customPagination'
                    rowsPerPage={limit}
                    page={page - 1}
                    onChangePage={handleChangePage}
                    rowsPerPageOptions={false}
                  />
                </div> */}
        </Paper>
        {openModal && (
          <ConfirmModal
            submit={() => DeleteData()}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        )}
        {openDetails && (
          <Dialog
            open={openDetails}
            fullWidth
            onClose={handleClose}
            // aria-labelledby="simple-modal-title"
            // aria-describedby="simple-modal-description"
            // className={classes.modal}
          >
            <Grid>
              <Tabs
                indicatorColor='primary'
                textColor='primary'
                value={tabValue}
                onChange={handleTabChange}
                aria-label='simple tabs example'
              >
                <Tab label='TestWise' {...a11yProps(0)} />
                <Tab label='Branchwise' {...a11yProps(1)} />
              </Tabs>

            <TabPanel value={tabValue} index={0}>
              {/* <DialogContent> */}
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell component='th' scope='row'>
                        S.NO
                      </TableCell>
                      <TableCell component='th' scope='row'>
                        Test Name
                      </TableCell>
                      <TableCell component='th' scope='row'>
                        Subject Name
                      </TableCell>
                      {/* {detailsData?.map((data) =>
                          (
                            <>

                              {data?.test_details.map((row) =>
                                <TableCell component="th" scope="row">
                                  {row.test_name}
                                </TableCell>
                              )}
                            </>
                          ))} */}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {detailsData?.test_details.map((row, index) => (
                      <TableRow>
                        <TableCell component='th' scope='row'>
                          {index + 1}
                        </TableCell>
                        <TableCell component='th' scope='row'>
                          {row?.test_name}
                        </TableCell>
                        <TableCell component='th' scope='row'>
                          {row?.subjects__subject_name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            {/* </DialogContent>  */}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
              <div
                className={classes.paper}
                // style={{ width: "60%", height: "60%" }}
              >
                <div>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                            <>

                          {totalsub?.map((sub) => (
                            <TableCell align="right">{sub}</TableCell>
                            ) )}
                            </>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {table.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align="right">{row.branch.branch_name}&nbsp;(g)
                            </TableCell>
                              {totalTests[index].map((tests) => 
                               <TableCell align="right">
                                {tests}
                               </TableCell>)}
                          </TableRow>
                          ))

                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
              </TabPanel>
            </Grid>            
          </Dialog>
        )}
      </Layout>
    </>
  );
};

export default ReportConfigTable;
