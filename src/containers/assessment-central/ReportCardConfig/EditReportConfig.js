import React, { useState, useEffect, useContext } from 'react';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
// import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import {
  Grid,
  TextField,
  Button,
  Modal,
  Paper,
  makeStyles,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Table,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import cuid from 'cuid';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import AssesmentSelection from './assessmentSelection';
import RemoveIcon from '@material-ui/icons/Remove';
import ConfirmModal from '../assesment-card/confirm-modal';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.primarylightest,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    margin: '20px',
    width: '95%',
    border: '1px solid #E2E2E2',
    marginRight: 0,
    paddingBottom: 20,
  },
  modalpaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    minWidth: 650,
  },
}));

const EditReportConfig = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { id: editId } = useParams();
  const {
    acad_session_id,
    grade_id,
    id,
    component_id: ComponentID,
    component_name: ComponentName,
    grading_system_id,
    is_publish,
    logic,
    priority: initialPriority,
    sub_component_name,
    test_details,
    weightage,
    column_text,
    test_ids,
    sub_component_id,
    branch: branchID,
  } = history.location.state;
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};

  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const questionLevelList = [
    { value: 1, Question_level: 'Best of All' },
    { value: 2, Question_level: 'Average' },
  ];

  const [components, setComponentDetails] = useState([
    {
      acad_session: [acad_session_id],
      grade: grade_id,
      id: cuid(),
      ComponentID: ComponentID,
      componentName: ComponentName,
      subComponents: [
        {
          columns: [
            {
              id: cuid(),
              logic: logic,
              name: column_text,
              priority: initialPriority,
              selectedTest: test_ids,
              weightage: weightage,
            },
          ],
          id: cuid(),
          subComponentsID: sub_component_id,
        },
      ],
      grading_system_id: grading_system_id,
      is_publish: is_publish,
    },
  ]);

  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [gradingList, setGradingList] = useState([]);
  const [curriculamTypeList, setCurriculamTypeList] = useState([]);
  const [curriculamNameList, setCurriculamNameList] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [selectedbranch, setSelectedbranch] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState();
  const [reportcardTermList, setReportCardTermList] = useState();
  const [priority, setPriority] = useState(initialPriority);
  const [assesmentType, setAssesmentType] = useState(column_text);
  const [marks, setMarks] = useState(weightage);
  const [selectedLogic, setSelectedLogic] = useState(
    questionLevelList?.find((item) => item?.value === +logic)
  );
  const [selectedLogicValue, setselectedLogicValue] = useState(logic);
  const [selectedCurriculamType, setSelectedCurriculamType] = useState('');
  const [selectedCurriculamName, setSelectedCurriculamName] = useState('');
  const [selectedGrading, setSelectedGrading] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [openAssesmentSelectModal, setOpenAssesmentSelectModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [testDetails, setTestDetails] = useState(test_details);
  const [testIds, setTestIds] = useState(test_ids);
  const [selectedTestId, setSelectedTestId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);

  const handleOpenAssesmentModal = () => {
    setOpenAssesmentSelectModal(true);
  };

  const handleCloseAssesmentModal = () => {
    setOpenAssesmentSelectModal(false);
  };

  const handleOpenSummaryModal = () => {
    setShowSummaryModal(true);
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
  };

  useEffect(() => {
    getCurriculumType();
    fetchgradingData();
    getreportcardTerm();
  }, []);

  useEffect(() => {
    if (moduleId) {
      getBranch();
    }
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

  const handleBranch = (e, value = []) => {
    setSelectedbranch();
    setSelectedGrade();
    setGradeList([]);
    // const Ids = value.map((i)=>i.id)
    if (value) {
      value =
        value.filter(({ id }) => id === 'all').length === 1
          ? [...branchList].filter(({ id }) => id !== 'all')
          : value;
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

  const getBranch = () => {
    axiosInstance
      .get(
        `${endpoints.academics.branches}?session_year=${selectedAcademicYear?.id}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          // const allBranchData = res?.data?.data?.results.map((item) => item.branch);
          let branches = res?.data?.data?.results;
          if (branches?.length > 1) {
            branches.unshift({
              branch: {
                id: 'all',
                branch_name: 'Select All',
                branch_code: 'all',
              },
              id: 'all',
            });
          }
          setBranchList(res?.data?.data?.results);
          if (branchID) {
            let newBranch = branches?.filter((item) => item?.branch?.id === branchID);
            setSelectedbranch(newBranch);
            getGrade(
              res?.data?.data?.results?.filter((item) => item?.branch?.id === branchID)
            );
          }
        } else {
          // setBranchList([]);
        }
      });
  };

  const getGrade = (value) => {
    axiosInstance
      .get(
        // `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${value.map(branch => branch?.branch?.id).join(',')}&module_id=${moduleId}`
        `${endpoints.reportCardConfig.branchAPI}?session_year=${
          selectedAcademicYear?.id
        }&branch_id=${value
          .map((branch) => branch?.branch?.id)
          .join(',')}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeList(res?.data?.data);
          if (grade_id) {
            setSelectedGrade(
              res?.data?.data?.find((item) => item?.grade_id === grade_id)
            );
          }
        } else {
          // setBranchList([]);
        }
      });
  };

  const fetchgradingData = () => {
    // setLoading(true);
    axiosInstance
      .get(`${endpoints.gradingSystem.GradingData}`)
      .then((res) => {
        // setLoading(false);
        setGradingList(res?.data?.result);
        let selectgrading = res?.data?.result?.find(
          (item) => item?.id === grading_system_id
        );
        setSelectedGrading(selectgrading);
      })
      .catch((error) => {
        // setLoading(false);
        console.log(error); // to give set Alert later
      });
  };

  const getCurriculumType = () => {
    axiosInstance
      .get(`${endpoints.reportCardConfig.reportcardcomponent}`)
      .then((res) => {
        setCurriculamTypeList(res?.data?.result);
        let selectedType = res?.data?.result?.find((item) => item?.id === ComponentID);
        setSelectedCurriculamType(selectedType);
        setSelectedCurriculamName(selectedType);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getreportcardTerm = () => {
    axiosInstance
      .get(`${endpoints.reportCardConfig.reportcardsubcomponent}`)
      .then((res) => {
        setReportCardTermList(res?.data?.result);
        let selectterm = res?.data?.result?.find((item) => item?.id === sub_component_id);
        setSelectedTerm(selectterm);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleColumnSelectedTestChange = (test, data) => {
    //new
    const newComponent = components[0];
    setComponentDetails(
      components.map((componentDetail) => {
        const newSubComponent = componentDetail.subComponents[0];
        const newTest = [...testIds, ...test];
        setTestIds([...new Set(newTest)]);
        newSubComponent.columns[0].selectedTest = [...new Set(newTest)];
        newComponent.subComponents[0] = newSubComponent;
        return newComponent;
      })
    );
    let allTest = [...testDetails, ...data];
    // let filteredTest = allTest.filter((item, index) => allTest.indexOf(item) === index);
    let filteredTest = [...new Map(allTest.map((obj) => [obj.id, obj])).values()];
    setTestDetails(filteredTest);
  };

  const removeTest = (id) => {
    let testids = testIds.filter((item) => item !== id);
    setTestIds(testids);
    let testdetails = testDetails.filter((item) => item?.id !== id);
    setTestDetails(testdetails);
    const newComponent = components[0];
    setComponentDetails(
      components.map((componentDetail) => {
        const newSubComponent = componentDetail.subComponents[0];
        newSubComponent.columns[0].selectedTest = testids;
        newComponent.subComponents[0] = newSubComponent;
        return newComponent;
      })
    );
  };

  const updateReportCardConfig = () => {
    if (!priority) {
      setAlert('error', 'Priority can not be empty');
      return;
    }
    if (!assesmentType) {
      setAlert('error', 'Assesment type can not be empty');
      return;
    }
    if (selectedCurriculamType?.component_name !== 'PTSD') {
      if (!marks) {
        setAlert('error', 'Marks can not be empty');
        return;
      }
      if (marks < 1) {
        setAlert('error', 'Marks can not be less than 1');
        return;
      }
    }

    let editedData = {
      column_text: assesmentType,
      weightage: parseInt(marks),
      test_ids: testIds,
      logic:
        selectedCurriculamType?.component_name !== 'PTSD'
          ? parseInt(selectedLogicValue)
          : null,
      priority: parseInt(priority),
    };
    axiosInstance
      .put(`${endpoints.reportCardConfig.submitAPI}${editId}/`, editedData)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result?.data?.message);
          history.goBack();
        } else if (result.data.status_code === 409) {
          setAlert('error', result?.data?.developer_msg);
        }
      })
      .catch((error) => {
        setAlert(
          'error',
          error?.response?.data?.message ||
            error?.response?.data?.message ||
            'Updation Failed'
        );
      });
  };

  return (
    <React.Fragment>
      <Layout>
        <div style={{ overflowX: 'hidden' }}>
          <div>
            <div style={{ width: '95%', margin: '20px auto' }}>
              <CommonBreadcrumbs
                componentName='Assessment'
                childComponentName='Edit Report Card Config'
              />
            </div>
          </div>
          <hr />
          <h5 style={{ marginLeft: 30 }}>Report Card</h5>
          <Grid container spacing={1} style={{ display: 'flex' }}>
            <Grid item md={3} xs={12} style={{ marginLeft: '20px' }}>
              <Autocomplete
                style={{ width: '100%' }}
                size='small'
                onChange={handleBranch}
                id='branch_id'
                limitTags={1}
                className='dropdownIcon'
                value={selectedbranch || []}
                options={branchList || []}
                getOptionLabel={(option) => option?.branch?.branch_name || ''}
                filterSelectedOptions
                multiple
                disabled
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
                value={selectedGrade ?? null}
                options={gradeList || []}
                getOptionLabel={(option) => option?.grade_name || ''}
                disabled
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

          <Paper elevation={2} className={classes.paper}>
            <Grid className='mt-3' container spacing={1} style={{ display: 'flex' }}>
              <Grid item xs={12} sm={6} md={3} style={{ marginLeft: 20 }}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  value={selectedCurriculamType ?? null}
                  onChange={(event, data) => {
                    setCurriculamNameList([]);
                    if (data) {
                      for (let val of curriculamTypeList) {
                        if (data?.component_name === val?.component_name) {
                          setCurriculamNameList((pre) => [...pre, val]);
                        }
                      }
                    } else {
                      setCurriculamNameList([]);
                    }
                  }}
                  id='curriculam_type'
                  className='dropdownIcon'
                  // value={ || {}}
                  // options={question_level_options || []}
                  options={curriculamTypeList || []}
                  getOptionLabel={(option) => option?.component_type_value || ''}
                  disabled
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='CURRICULUM TYPE'
                      placeholder='CURRICULUM TYPE'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  id='Question Level'
                  className='dropdownIcon'
                  // value={ || {}}
                  // options={question_level_options || []}
                  options={curriculamNameList || []}
                  value={selectedCurriculamName ?? null}
                  getOptionLabel={(option) => option?.component_name || ''}
                  disabled
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='CURRICULUM NAME'
                      placeholder='CURRICULUM NAME'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  style={{ width: '100%', marginLeft: '5px' }}
                  size='small'
                  id='Grading System'
                  className='dropdownIcon'
                  value={selectedGrading ?? null}
                  // options={question_level_options || []}
                  options={gradingList || []}
                  getOptionLabel={(option) => option?.grading_system_name || ''}
                  disabled
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Grading System'
                      placeholder='Grading System'
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid className='mt-3' container spacing={1} style={{ display: 'flex' }}>
              <Grid item xs={12} sm={6} md={3} style={{ marginLeft: 20 }}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  // onChange={handleQuestionLevel}
                  id='assesment_type'
                  className='dropdownIcon'
                  value={selectedTerm ?? null}
                  // options={question_level_options || []}
                  options={reportcardTermList || []}
                  getOptionLabel={(option) => option?.sub_component_name || ''}
                  disabled
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Term/Semester'
                      placeholder='Term/Semester'
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid className='mt-3' container spacing={1} style={{ display: 'flex' }}>
              <Grid item xs={12} sm={6} md={3} style={{ marginLeft: 20 }}>
                <TextField
                  style={{ width: '100%' }}
                  id='subname'
                  label='PRIORITY'
                  variant='outlined'
                  size='small'
                  type='number'
                  defaultValue={priority ?? null}
                  onChange={(e) => {
                    const newComponent = components[0];
                    setComponentDetails(
                      components.map((componentDetail) => {
                        const newSubComponent = componentDetail.subComponents[0];
                        newSubComponent.columns[0].priority = e.target.value;
                        newComponent.subComponents[0] = newSubComponent;
                        return newComponent;
                      })
                    );
                    setPriority(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  style={{ width: '100%' }}
                  id='subname'
                  // label="Column Name"
                  label='ASSESSMENT TYPE'
                  variant='outlined'
                  size='small'
                  defaultValue={assesmentType ?? null}
                  name='subname'
                  autoComplete='off'
                  onChange={(e) => {
                    const newComponent = components[0];
                    setComponentDetails(
                      components.map((componentDetail) => {
                        const newSubComponent = componentDetail.subComponents[0];
                        newSubComponent.columns[0].name = e.target.value;
                        newComponent.subComponents[0] = newSubComponent;
                        return newComponent;
                      })
                    );
                    setAssesmentType(e.target.value);
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ margin: '0px' }}>
              <Grid item xs={12} sm={3} className={'filterPadding'}>
                <Button
                  style={{ width: '100%' }}
                  variant='contained'
                  color='primary'
                  title='Test Selection'
                  onClick={handleOpenAssesmentModal}
                >
                  Test Selection
                </Button>

                <h6 style={{ marginTop: '8px' }}>
                  No of test selected={' '}
                  {components[0]?.subComponents[0]?.columns[0]?.selectedTest.length}
                </h6>
                <Modal
                  open={openAssesmentSelectModal}
                  aria-labelledby='simple-modal-title'
                  aria-describedby='simple-modal-description'
                  onClose={handleCloseAssesmentModal}
                  className={classes.modal}
                >
                  <div
                    className={classes.modalpaper}
                    style={{ width: '86%', height: '100%', overflow: 'scroll' }}
                  >
                    <AssesmentSelection
                      handleColumnSelectedTestChange={handleColumnSelectedTestChange}
                      handleClose={handleCloseAssesmentModal}
                    />
                  </div>
                </Modal>
              </Grid>
              <Grid item xs={12} sm={3} className={'filterPadding'}>
                <Button
                  style={{ width: '100%' }}
                  variant='contained'
                  color='primary'
                  title='Selected Test'
                  onClick={handleOpenSummaryModal}
                >
                  Summary
                </Button>
                <Modal
                  open={showSummaryModal}
                  onClose={handleCloseSummaryModal}
                  aria-labelledby='simple-modal-title'
                  aria-describedby='simple-modal-description'
                  className={classes.modal}
                >
                  <div
                    className={classes.modalpaper}
                    style={{ width: '60%', height: '60%', overflowY: 'scroll' }}
                  >
                    <div>
                      <TableContainer component={Paper}>
                        <Table aria-label='simple table'>
                          <TableHead>
                            <TableRow>
                              <TableCell>Test ID</TableCell>
                              <TableCell>Test Name</TableCell>
                              <TableCell>Subject</TableCell>
                              <TableCell>Remove</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {testDetails?.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item?.id}</TableCell>
                                <TableCell>{item?.test_name}</TableCell>
                                <TableCell>
                                  {item?.subjects__subject_name
                                    ? item?.subjects__subject_name
                                    : item?.subject_names}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    startIcon={
                                      <RemoveIcon style={{ fontSize: '30px' }} />
                                    }
                                    variant='contained'
                                    color='primary'
                                    size='small'
                                    style={{ color: 'white' }}
                                    title='Remove Individual Column'
                                    onClick={() => {
                                      setSelectedTestId(item?.id);
                                      setOpenModal(true);
                                    }}
                                  ></Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {openModal && (
                        <ConfirmModal
                          submit={() => removeTest(selectedTestId)}
                          openModal={openModal}
                          setOpenModal={setOpenModal}
                        />
                      )}
                    </div>
                  </div>
                </Modal>
              </Grid>
            </Grid>
            {components[0]?.componentName !== 'PTSD' && (
              <Grid className='mt-3' container spacing={1} style={{ display: 'flex' }}>
                <Grid item xs={12} sm={6} md={3} style={{ marginLeft: 20 }}>
                  <TextField
                    style={{ width: '100%' }}
                    id='subname'
                    label='METRICS/MARKS'
                    variant='outlined'
                    size='small'
                    name='subname'
                    type='number'
                    autoComplete='off'
                    defaultValue={marks ?? null}
                    onChange={(e) => {
                      const newComponent = components[0];
                      setComponentDetails(
                        components.map((componentDetail) => {
                          const newSubComponent = componentDetail.subComponents[0];
                          newSubComponent.columns[0].weightage = e.target.value;
                          newComponent.subComponents[0] = newSubComponent;
                          return newComponent;
                        })
                      );
                      setMarks(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={(e, value) => {
                      const newComponent = components[0];
                      setComponentDetails(
                        components.map((componentDetail) => {
                          const newSubComponent = componentDetail.subComponents[0];
                          newSubComponent.columns[0].logic = value;
                          newComponent.subComponents[0] = newSubComponent;
                          return newComponent;
                        })
                      );
                      setselectedLogicValue(value?.value);
                      setSelectedLogic(value);
                    }}
                    id='Question Level'
                    value={selectedLogic ?? null}
                    className='dropdownIcon'
                    options={questionLevelList || []}
                    getOptionLabel={(option) => option?.Question_level || ''}
                    getOptionSelected={(option, value) => option?.value === value?.value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant='outlined'
                        label='Logic'
                        placeholder='Select Logic'
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}
          </Paper>
          <Button
            variant='contained'
            color='primary'
            style={{ marginLeft: '20px' }}
            className='btn reportcrd-btn'
            onClick={() => updateReportCardConfig()}
          >
            Update Report Card config
          </Button>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default EditReportConfig;
