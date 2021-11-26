import React, { useEffect, useState, useContext } from 'react';
import Layout from 'containers/Layout';
import {
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
// import { Pagination } from '@material-ui/lab';
import clsx from 'clsx';
import endpoints from 'config/endpoints';
import axiosInstance from 'config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Loader from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { getModuleInfo } from '../../../utility-functions';
import { useLocation } from 'react-router-dom';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const useStyles = makeStyles((theme) => ({
  filterContainer: {
    padding: '10px 0 20px',
  },
  studentCountReportContainer: {
    padding: '10px',
  },
  tableContainer: {
    maxHeight: '420px',
    '&::-webkit-scrollbar': {
      width: '5px',
      height: '5px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.10)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.10)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.2)',
      outline: '1px solid slategrey',
      borderRadius: 7,
    },
  },
  tableHead: {
    // backgroundColor: '#4a90e2',
    backgroundColor: '#4a90e2',
    position: 'sticky',
    left: 0,
    top: 0,
    zIndex: 30,
  },
  tabelBody: {
    zIndex: 20,
  },
  sticky: {
    position: 'sticky',
    left: 0,
    backgroundColor: 'white',
    boxShadow: '5px 2px 5px grey',
    // zIndex: 20,
  },
  stickyHead: {
    // position: 'sticky',
    // left: 0,
    backgroundColor: '#4a90e2 !important',
    // boxShadow: '5px 2px 5px grey',
    // zIndex: 20,
  },
  stickyBody: {
    position: 'sticky',
    left: 0,
    background: 'white',
    boxShadow: '5px 2px 5px grey',
    zIndex: 20,
  },
  tableHeadCell: {
    backgroundColor: '#4a90e2',
    color: 'white',
  },
}));

const StudentCountReport = () => {
  const [studentCountData, setStudentCountData] = useState(null);
  const [tableHead, setTableHead] = useState(null);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const location = useLocation();
  const classes = useStyles();
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  //   const [paginationData, setPaginationData] = useState({
  //     totalPages: 10,
  //     currentPage: 1,
  //   });

  useEffect(() => {
    // getStudentCountReportData();
    // setAlert('error', 'Select Acadminc year & branch');
    callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
  }, []);
  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || [], 'checking');
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || [], 'checking');
            setBranchList(result?.data?.data?.results || []);
          }

          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }
  // useEffect(() => {
  //   callApi(`${endpoints.userManagement.academicYear}`, 'academicYearList');
  // }, []);

  function getModuleId() {
    const tempObj = {
      '/student-strength/': 'View School Strength',
      default: 'View School Strength',
    };
    const moduleName = tempObj[location.pathname] || tempObj['default'];
    return getModuleInfo(moduleName).id;
  }
  const filterData = () => {
    console.log(selectedAcademicYear);
    console.log(selectedBranch);
    if (!selectedAcademicYear) {
      setAlert('error', 'Select Acadminc year');
      return;
    }
    if (!selectedBranch) {
      setAlert('error', 'Select Branch');
      return;
    }
    getStudentCountReportData(selectedAcademicYear?.id, selectedBranch?.branch?.id);
  };

  const handleClearFilter = () => {
    setSelectedAcadmeicYear('');
    setSelectedBranch('');
    setStudentCountData(null);
  };

  const exportTo = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data.slice(1));
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataX = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataX, fileName + fileExtension);
  };

  const getStudentCountReportData = (acadYear, branch) => {
    if (acadYear !== undefined && branch !== undefined)
      axiosInstance
        .get(
          `${endpoints.academics.getStudentCountReportData}?session_year=${
            acadYear !== undefined ? acadYear : ''
          }&branch_id=${branch !== undefined ? branch : ''}`
        )
        .then((res) => {
          console.log(res);
          setStudentCountData(res.data);
          setTableHead(Object.keys(res.data[0]));
        })
        .catch((err) => {
          console.log(err);
        });
  };
  //   const createHead = () => {
  //     let arr = Object.keys(studentCountData[0]);
  //     console.log(arr);
  //   };
  //   const handlePagination = (event, page) => {
  //     event.preventDefault();
  //     setPaginationData({
  //       ...paginationData,
  //       currentPage: page,
  //     });
  //   };
  return (
    <Layout>
      <div className={classes.studentCountReportContainer}>
        <div className={classes.filterContainer}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Student Count Report</Typography>
            </Grid>
            <Grid item md={4} sm={6} xs={12} style={{ margin: 'auto 0' }}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedAcadmeicYear(value);
                  if (value) {
                    callApi(
                      `${endpoints.communication.branches}?session_year=${
                        value?.id
                      }&module_id=${getModuleId()}`,
                      'branchList'
                    );
                  }
                  // setSelectedBranch([]);
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedAcademicYear || ''}
                options={academicYear || ''}
                getOptionLabel={(option) => option?.session_year || ''}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    placeholder='Academic Year'
                    required
                  />
                )}
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12} style={{ margin: 'auto 0' }}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={(event, value) => {
                  setSelectedBranch([]);
                  if (value) {
                    const selectedId = value.branch.id;
                    setSelectedBranch(value);
                    // callApi(
                    //   `${endpoints.academics.grades}?session_year=${selectedAcademicYear.id
                    //   }&branch_id=${selectedId.toString()}&module_id=${getModuleId()}`,
                    //   'gradeList'
                    // );
                  }
                }}
                id='branch_id'
                className='dropdownIcon'
                value={selectedBranch || ''}
                options={branchList || ''}
                getOptionLabel={(option) => option?.branch?.branch_name || ''}
                filterSelectedOptions
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
            <Grid item container spacing={2} md={4} sm={12} xs={12} alignItems='center'>
              <Grid item xs={3}>
                <Button
                  variant='contained'
                  color='primary'
                  fullWidth
                  onClick={() => filterData()}
                >
                  Filter
                </Button>
              </Grid>
              <Grid item xs={4} sm={5}>
                <Button variant='contained' fullWidth onClick={() => handleClearFilter()}>
                  Clear all
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant='contained'
                  disabled={studentCountData === null ? true : false}
                  fullWidth
                  onClick={() => exportTo(studentCountData, 'StudentCountData')}
                >
                  Download
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>

        {/* <button onClick={() => createHead()}>hello</button> */}
        {studentCountData && (
          <Paper style={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer className={classes.tableContainer}>
              <Table>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    {tableHead &&
                      tableHead.map((each, index) => (
                        <TableCell
                          key={index}
                          className={clsx(classes.tableHeadCell, {
                            [classes.sticky]: index === 0,
                            [classes.stickyHead]: index === 0,
                          })}
                        >
                          {studentCountData && studentCountData[0][each]}
                        </TableCell>
                      ))}
                    {/* <TableCell>Total</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody className={classes.tabelBody}>
                  {studentCountData &&
                    studentCountData
                      .filter((item, index) => index !== 0)
                      .map((eachStudent, index) => {
                        return (
                          <TableRow key={index}>
                            {tableHead &&
                              tableHead.map((each, i) => (
                                <TableCell
                                  key={i}
                                  className={clsx({
                                    [classes.sticky]: i === 0,
                                  })}
                                >
                                  {eachStudent[each]}
                                </TableCell>
                              ))}
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        {/* <Pagination
        //   style={{ textAlign: 'center', display: 'inline-flex' }}
          onChange={handlePagination}
          count={paginationData.totalPages}
          color='primary'
          page={paginationData.currentPage}
        /> */}
      </div>
    </Layout>
  );
};

export default StudentCountReport;
