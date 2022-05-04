import React, { useContext, useState, useEffect } from 'react';
import { Button, makeStyles, Typography, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import Layout from '../../Layout';
import './assessment_form.scss';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  FeedbackFormDialog: {
    marginLeft: '6px',
  },
  filters: {
    marginLeft: '15px',
  },
  root: theme.commonTableRoot,
  paperStyled: {
    minHeight: '80vh',
    height: '100%',
    padding: '50px',
    marginTop: '15px',
  },
  guidelinesText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fe6b6b',
    marginBottom: '30px',
    display: 'inline-block',
  },
  table: {
    minWidth: 650,
  },
  downloadExcel: {
    float: 'right',
    fontSize: '16px',
    // textDecoration: 'none',
    // backgroundColor: '#fe6b6b',
    // color: '#ffffff',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  guidelineval: {
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  guideline: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    padding: '10px',
  },
}));

const AssessmentForm = () => {
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const moduleData = udaanDetails?.role_permission?.modules;
  const [emailAddress, setEmailAddress] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const udaanToken = udaanDetails?.personal_info?.token;
  const [allCourses, setAllCourses] = useState([]);
  const [moduleId, setModuleId] = useState(null);
  const classes = useStyles({});

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        if (item.module_name === 'Assessment_Review') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId !== null) {
      getAllCoursesInformation();
    }
  }, [moduleId]);

  const getAllCoursesInformation = async () => {
    let tempInfo = [];
    axios
      .get(`${endpoints.sureLearning.getInstructureCourses}?course_type=self_driven`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        response.data.results.map((eachResult) => {
          tempInfo.push({
            course_category: eachResult.course.course_category,
            course_duration: eachResult.course.course_duration,
            course_image: eachResult.course.course_image,
            course_name: eachResult.course.course_name,
            id: eachResult.course.id,
          });
        });
        setAllCourses(tempInfo);
      })
      .catch((error) => {
        setAlert('error', 'Something went worng try again');
      });
  };

  const handleCourse = (e, row) => {
    setSelectedCourse(row);
  };

  const handleSubmit = () => {
    if (selectedCourse.length < 1) {
      setAlert('error', 'Please Select Course');
      return;
    } else if (emailAddress.length < 1) {
      setAlert('error', 'Please provide email address');
      return;
    }
    let courseId = [];
    selectedCourse.map((eachCourse) => {
      // console.log(eachCourse);
      courseId.push(eachCourse.id);
    });

    axios
      .get(
        `${endpoints.sureLearning.sendDataToMail}?course_id=${courseId}&email=${emailAddress}`,
        {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        }
      )
      .then((response) => {
        if (response.data.status_code !== 200) {
          setAlert('error', response.data.message);
        } else {
          setAlert('success', 'data submitted successfully');
        }
      })
      .catch((error) => {
        setAlert('error', 'something went wrong try again');
      });
  };

  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Assessment Scores'
          isAcademicYearVisible={true}
        />

        <div className='listcontainer'>
          <div className='filterStudent' style={{ marginLeft: '20px' }}></div>

          <div className='listcontainer'>
            <div className='filterStudent' style={{ width: '100%' }}>
              <Typography
                color='primary'
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                Assessment Scores
              </Typography>
            </div>
          </div>
          <div style={{ paddingLeft: '20%', paddingRight: '20%' }}>
            {/* <TextField
              onChange={(e) => setCoursTitle(e.target.value)}
              margin='dense'
              style={{ margin: '20px' }}
              fullWidth
              variant='outlined'
              label='Class Title'
            /> */}
            <Autocomplete
              multiple
              style={{ width: '100%', margin: '20px' }}
              size='small'
              onChange={handleCourse}
              id='branch_id'
              className='dropdownIcon'
              value={selectedCourse || ''}
              options={allCourses || ''}
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

            <TextField
              onChange={(e) => setEmailAddress(e.target.value)}
              style={{ margin: '20px' }}
              value={emailAddress}
              margin='dense'
              fullWidth
              variant='outlined'
              label='Email Address'
            />

            <Button
              onClick={() => handleSubmit()}
              style={{ width: '100%', margin: '20px' }}
              fullWidth
              className={classes.updateButton}
              color='primary'
              variant='contained'
            >
              Send assessment score
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentForm;
