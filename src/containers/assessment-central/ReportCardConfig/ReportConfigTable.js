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
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
    minWidth: 100,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'optional', 
    label: 'Marks/Metrics',
    minWidth: 100,
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
    minWidth: 170,
    align: 'center',
    labelAlign: 'center',
  },
];

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
                          onClick={() => {
                            // setOpenModal(true);
                            // setDeleteId(data?.id)
                            handlePublish(data?.id,data?.is_publish)
                          }}
                          color='primary'
                          variant='contained'
                        >
                          {/* {ispublished ? 'Publish' : 'Unpublish'} */}
                          {data?.is_publish? "Unpublish" : "Publish"}
                        </Button>
                        <IconButton
                          onClick={() => {
                            setOpenModal(true);
                            setDeleteId(data?.id)
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
      </Layout>
    </>
  );
};

export default ReportConfigTable;
