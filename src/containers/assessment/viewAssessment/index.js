import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../Layout';
import Loading from '../../../components/loader/loader';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import './viewAssessment.css';
import SidebarCounterPanel from './sidebarCounterPanel';
import McqQuestion from './mcqQuestion';

const ViewAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [listOfQuestions, setListOfQuestions] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);

  useEffect(() => {
    console.log('start assessment:: fetching all questions!');
    fetchAssessmentQuestions();
  }, []);
  const fetchAssessmentQuestions = () => {
    setLoading(true);
    axios
      .get(`${endpoints.assessment.viewQuestionList}`, {
        headers: {
          'x-api-key': 'vikash@12345#1231',
        },
      })
      .then((response) => {
        console.log('assessment result:', response);
        if (response.data.status_code === 200) {
          setListOfQuestions(response.data.result.result);
          //   setTotalCount(response.data.result.count);
          setLoading(false);
        } else {
          setLoading(false);
          setAlert('error', response.data.description);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  };
  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <Container>
          <CommonBreadcrumbs componentName='Assessment' childComponentName='English' />
          <Grid container spacing={2}>
            <Grid item md={9} xs={12}>
              <div className='main-question-panel'>
                <McqQuestion />
                {/* <Button className='submit-button'></Button> */}
              </div>
            </Grid>
            <Grid item md={3} xs={12}>
              <SidebarCounterPanel />
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </>
  );
};
export default withRouter(ViewAssessment);
