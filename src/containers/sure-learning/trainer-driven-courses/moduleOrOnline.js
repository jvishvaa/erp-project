import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  SvgIcon,
  withStyles,
  useTheme,
  Box,
  Input,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import endpoints from 'config/endpoints';
import FeedbackFormDialog from '../components/feedbackForm/feedback_form';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import NoFilterData from 'components/noFilteredData/noFilterData';
import './modulOnlineClass.css';

const useStyles = makeStyles((theme) => ({}));

function ModuleOrOnline() {
  const history = useHistory();
  const [moduleId, setModuleId] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const classes = useStyles({});

  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails.personal_info.token;
  const moduleData = udaanDetails.role_permission.modules;

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Trainer_Driven') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(endpoints.sureLearning.branch, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res, 'academic');
          //   setGradeList(res.data.course_type);
          // setSubjectList(res.data.course_sub_type)
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId]);
  const handelOnlineClass = () => {
    if (
      udaanDetails &&
      udaanDetails.personal_info &&
      (udaanDetails.personal_info.role === 'Teacher' ||
        udaanDetails.personal_info.role === 'Deputy Zonal Head' ||
        udaanDetails.personal_info.role === 'Business Development Manager' ||
        udaanDetails.personal_info.role === 'Assistant Business Development Manager' ||
        udaanDetails.personal_info.role === 'Zonal Head- Inbound Marketing' ||
        udaanDetails.personal_info.role === 'Cluster Counselor' ||
        udaanDetails.personal_info.role === 'Counselor' ||
        udaanDetails.personal_info.role === 'Digital marketing head' ||
        udaanDetails.personal_info.role === 'MarketingHead' ||
        udaanDetails.personal_info.role === 'SEO head' ||
        udaanDetails.personal_info.role === 'Digital marketing specialist' ||
        udaanDetails.personal_info.role === 'Digital Marketing Executive' ||
        udaanDetails.personal_info.role === 'Associate Content and Management Lead' ||
        udaanDetails.personal_info.role === 'EA' ||
        udaanDetails.personal_info.role === 'FOE' ||
        udaanDetails.personal_info.role === 'Deputy Zonal Head' ||
        udaanDetails.personal_info.role === 'LeadTeacher')
    ) {
    //   window.location = '/online_Class_Start';
      history.push({
        pathname: '/online_Class_Start',
      })
      sessionStorage.setItem('online_Class_Start',moduleId)
    }
  };
  const handleModules = () => {
    if (
      udaanDetails &&
      udaanDetails.personal_info &&
      (udaanDetails.personal_info.role === 'Teacher' ||
        udaanDetails.personal_info.role === 'Deputy Zonal Head' ||
        udaanDetails.personal_info.role === 'Business Development Manager' ||
        udaanDetails.personal_info.role === 'Assistant Business Development Manager' ||
        udaanDetails.personal_info.role === 'Zonal Head- Inbound Marketing' ||
        udaanDetails.personal_info.role === 'Cluster Counselor' ||
        udaanDetails.personal_info.role === 'Counselor' ||
        udaanDetails.personal_info.role === 'Digital marketing head' ||
        udaanDetails.personal_info.role === 'MarketingHead' ||
        udaanDetails.personal_info.role === 'SEO head' ||
        udaanDetails.personal_info.role === 'Digital marketing specialist' ||
        udaanDetails.personal_info.role === 'Digital Marketing Executive' ||
        udaanDetails.personal_info.role === 'Associate Content and Management Lead' ||
        udaanDetails.personal_info.role === 'EA' ||
        udaanDetails.personal_info.role === 'FOE' ||
        udaanDetails.personal_info.role === 'Deputy Zonal Head' ||
        udaanDetails.personal_info.role === 'LeadTeacher')
    ) {
      localStorage.setItem('principalCourseType', 'trainer_driven');
      localStorage.setItem('coursesType', 'trainer_driven');
      window.location = '/modules';
    } else {
    //   console.log('Modules', udaanDetails.personal_info.role);
    //   window.location = '/modules';
    }
   
  };
  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Trainer Driven Courses'
          isAcademicYearVisible={true}
        />
        {udaanDetails.personal_info.role === 'Principal' ? (
          <Grid id='cardAreaSubject' style={{ margin: '20px 20px' }}>
            <Typography>principal_Login</Typography>
          </Grid>
        ) : (
          <div className='listcontainer'>
            <div className='filterStudent'>
              <Grid
                item
                md={6}
                xs={12}
                className='responsive'
                style={{ textAlign: 'center', backgroundColor: 'lightsteelblue' }}
              >
                <Button
                  className='arcButton'
                  style={{
                    padding: '4rem 0.2rem',
                    marginRight: '1rem',
                    color: 'white ',
                    cursor: 'pointer',
                    fontSize: '55px',
                    fontWeight: '800',
                    fontFamily: 'caviarDreams',
                    backgroundColor: 'transparent',
                  }}
                  onClick={handleModules}
                >
                  <div className='arcBtn'>Modules</div>
                </Button>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
                className='responsive'
                style={{ textAlign: 'center', backgroundColor: '#5d81877a' }}
              >
                <Button
                  className='arcButton'
                  style={{
                    padding: '4.83rem 0.2rem',
                    marginRight: '1rem',
                    color: 'white ',
                    cursor: 'pointer',
                    fontSize: '40px',
                    fontWeight: '800',
                    fontFamily: 'caviarDreams',
                    backgroundColor: 'transparent',
                  }}
                  onClick={handelOnlineClass}
                >
                  <div className='arcBtn'>Online Training</div>
                </Button>
              </Grid>
            </div>
          </div>
          //   <div className={classes.periodDataUnavailable}>
          //     <SvgIcon
          //       component={() => <img style={{ paddingLeft: '380px' }} src={unfiltered} />}
          //     />
          //     <p style={{ paddingLeft: '440px' }}>NO DATA FOUND </p>
          //   </div>
        )}
      </div>
    </Layout>
  );
}
ModuleOrOnline.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
};
export default ModuleOrOnline;
