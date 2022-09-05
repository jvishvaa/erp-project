import React, { useEffect, useState, useContext } from 'react';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
// import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import {
  Grid,
  TextField,
  Button,
  Modal,
  Paper
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import cuid from 'cuid';
import RemoveIcon from '@material-ui/icons/Remove';
import { useSelector } from 'react-redux';
import ComponentCard from './ComponentCard';
import { useHistory } from 'react-router';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';


function CreateReportConfig() {
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};


  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );

  const [components, setComponentDetails] = useState([])
  console.log('debugmain', components)

  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [moduleId, setModuleId] = useState('');
  const [selectedbranch, setSelectedbranch] = useState();
  const [selectedGrade, setSelectedGrade] = useState();

  const history = useHistory();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const createComponent = () => {
    const compnentUniqueId = cuid();
    setComponentDetails(prevState => [
      ...prevState,
      {
        // acad_session: selectedbranch?.session_year?.id,
        acad_session: selectedbranch ? selectedbranch.map(branch => branch.id) : [],
        grade: selectedGrade?.grade_id,
        id: compnentUniqueId,
        ComponentID: -1,
        subComponents: []
      },
    ]);
  }


  useEffect(() => {
    if (moduleId) getBranch()
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
        // `${endpoints.academics.grades}?session_year=${selectedAcademicYear?.id}&branch_id=${value.map(branch => branch?.branch?.id).join(',')}&module_id=${moduleId}`
        `${endpoints.reportCardConfig.branchAPI}?session_year=${selectedAcademicYear?.id}&branch_id=${value.map(branch => branch?.branch?.id).join(',')}&module_id=${moduleId}`
      )
      .then((res) => {
        if (res?.data?.status_code === 200) {
          setGradeList(res?.data?.data);
        } else {
          // setBranchList([]);
        }
      });
  };

  const { setAlert } = useContext(AlertNotificationContext);
  const handleBranch = (e, value = {}) => {
    setSelectedbranch()
    setSelectedGrade()
    setGradeList([])
    // const Ids = value.map((i)=>i.id)
    if (value) {
      setSelectedbranch(value)
      getGrade(value)
      // setSelectBranchId(Ids)	
    } else {
      // setSelectBranchId([])	
      setSelectedbranch()
      setSelectedGrade()
    }
  }

  const handleGrade = (e, value) => {
    if (value) {
      setSelectedGrade(value)
      // getGroupTypes()
      // getSection(value)
    } else {
      setSelectedGrade()
    }
  }

  const [ttrue, setTtrue] = useState(false)
  console.log(ttrue, 'setTtrue')
  const assessmentError = () => {
    setAlert('error', 'Please enter Assessment Type')
    handleClose()
    setTtrue(false)
  }
  // const assessmentunderError = () => {
  //   setAlert('error', 'Please do not enter Underscore')
  //   handleClose()
  //   setTtrue(false)
  // }
  const weightageError = () => {
    setAlert('error', 'Please enter Metrics/Marks')
    handleClose()
    setTtrue(false)
  }
  const selectedTestError = () => {
    setAlert('error', 'Please select the test ID')
    handleClose()
    setTtrue(false)
  }
  const logicError = () => {
    setAlert('error', 'Please enter the logic')
    handleClose()
    setTtrue(false)
  }
  const checkfunc = () => {

    // const checkdata = 
    components.map((item) => {
      item.subComponents.map((item) => item.columns.map((item) => {
        if (!item?.name) return assessmentError()
        // if (!item?.name.find(['_'])) return assessmentunderError()
        if (item?.selectedTest?.length === 0) return selectedTestError()
        if (!item?.weightage) return weightageError()
        if (item?.logic === 0) return logicError()
        else (setTtrue(true))
      }))
    })

    // return checkdata;
  }

  useEffect(() => {
    if (ttrue) {
      axiosInstance.post(`${endpoints.reportCardConfig.submitAPI}`, components)
        .then(result => {
          // if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          history.goBack()
          handleClose()
          // }
        }).catch((error) => {

          // setAlert('error', error?.response?.data?.description)
        })
    }

  }, [ttrue])

  const submitAllReportCardData = () => {
    checkfunc()
  }

  return (
    <>
      {/* {loading ? <Loading message='Loading...' /> : null} */}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Assessment'
              childComponentName='Report Card Config'
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
        <Grid container spacing={1} style={{ margin: '0px' }}>
          {selectedGrade?.grade_id &&
            <Grid item xs={12} sm={4} className={'addButtonPadding'}>
              <Button
                startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                variant='contained'
                color='primary'
                size='medium'
                style={{ color: 'white' }}
                title='Create'
                onClick={createComponent}
              >
                {/* Create Component */}
                Create Curriculum
              </Button>
            </Grid>}
          {components?.length !== 0 ? (
            <Grid item xs={12} sm={4} className={'addButtonPadding'}>
              <Button
                startIcon={<RemoveIcon style={{ fontSize: '30px' }} />}
                variant='contained'
                color='primary'
                size='medium'
                style={{ color: 'white' }}
                title='Remove'
                onClick={() => {
                  const prevState = [...components];
                  prevState.pop()
                  setComponentDetails(prevState)
                }}
              >
                {/* Remove Component
                 */}
                Remove Curriculum
              </Button>
            </Grid>
          ) : (
            <></>
          )}
          {components?.length > 0 && components?.map((component) => (
            <ComponentCard
              key={component.id}
              componentId={component.id}
              components={components}
              setComponentDetails={setComponentDetails}
            />
          ))}
          <Modal
            open={open}
            onClose={handleClose}
            // aria-labelledby="simple-modal-title"
            // aria-describedby="simple-modal-description"
            // className={classes.modal}
            style={{
              marginLeft: 500,
              margintop: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "400px", height: "500px",
              // position: 'absolute',
              // top: 0,
              // bottom: 0,
              // left: 0,
              // right: 0,
            }}
          >
            <div
            // className={classes.paper}
            // style={{ width: "200px", height: "300px" }}
            >
              <Paper elevation={2} style={{ padding: 30 }}>
                <h5 style={{ margin: 20 }}>Are you sure you want to submit?</h5>
                <div style={{ display: "flex", marginBottom: '30px' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ marginLeft: '20px' }}
                    onClick={() => {
                      submitAllReportCardData();
                    }}
                    title='Report Card Submitted'
                    className='btn reportcrd-btn'
                  >
                    Submit Report Card
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ marginLeft: '20px' }}
                    onClick={handleClose}
                    title='Report Card Submitted'
                    className='btn reportcrd-btn'
                  >
                    Cancel
                  </Button>
                </div>
              </Paper>
            </div>

          </Modal>

        </Grid>
        {components.length > 0 && components[0].subComponents.length > 0 && components[0].subComponents[0].columns.length > 0 &&
          <Button
            variant='contained'
            color='primary'
            style={{ marginLeft: '20px' }}
            onClick={handleOpen}
            title='Report Card Submitted'
            className='btn reportcrd-btn'
          >
            Submit Report Card
          </Button>}
      </Layout>
    </>
  );
}

export default CreateReportConfig;
