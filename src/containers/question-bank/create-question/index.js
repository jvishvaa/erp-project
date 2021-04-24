/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { useTheme, SvgIcon, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import hidefilter from '../../../assets/images/hidefilter.svg';
import showfilter from '../../../assets/images/showfilter.svg';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';
import TopFilters from './top-filters';
import QuestionTypeFilters from './question-type-filters';
import './create-question.css';
import axios from 'axios';
import { getSubDomainName } from '../../../utility-functions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '0px auto',
    boxShadow: 'none',
  },
}));
const domainName = getSubDomainName();
const CreateQuestion = () => {
  const classes = useStyles();
  const { qId } = useParams();
  const [editData, setEditData] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [isTopFilterOpen, setIsTopFilterOpen] = useState(true);
  const [isFilter, setIsFilter] = useState(false);
  const [filterDataDisplay, setFilterDataDisplay] = useState({
    grade: '',
    subject: '',
    chapter: '',
    topic: '',
  });

  useEffect(() => {
    if (qId) {
      axios
        .get(`${endpoints.baseURLCentral}/assessment/${qId}/retrieve_update_question/`, {
          headers: { 'x-api-key': 'vikash@12345#1231' },
        })
        .then((res) => {
          const { status_code, result, message, error_msg } = res?.data;
          if (status_code === 200) {
            setEditData(result);
            const {
              chapter,
              grade_subject_mapping: {
                id: gsMappingId,
                grade: { id: gradeId, grade_name },
                subject: { id: subjectId, subject_name },
              },
              topic,
            } = result;
            setFilterDataDisplay({
              grade: {
                id: gsMappingId,
                grade_name: grade_name,
                is_delete: false,
                created_by: null,
              },
              subject: {
                id: gsMappingId,
                grade: {
                  id: gradeId,
                  grade_name: grade_name,
                },
                subject: {
                  id: subjectId,
                  subject_name: subject_name,
                },
                is_delete: false,
                created_by: null,
              },
              chapter: chapter,
              topic: topic,
            });
            setIsFilter(true);
            setIsTopFilterOpen(false);
          } else {
            setEditData([]);
            setAlert('error', error_msg);
          }
        })
        .catch((error) => setAlert('error', error?.message));
    }
  }, []);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div className='breadCrumbFilterRow'>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Question Bank'
              childComponentName='Create Question'
            />
          </div>
          {!qId && (
            <div className='hideShowFilterIcon'>
              <div>
                <IconButton
                  disableRipple
                  onClick={() => setIsTopFilterOpen(!isTopFilterOpen)}
                >
                  <div>
                    {!isMobile && (
                      <div className='hideShowFilterText'>
                        {isTopFilterOpen ? 'Close Filter' : 'Expand Filter'}
                      </div>
                    )}
                  </div>
                  <div>
                    <SvgIcon
                      component={() => (
                        <img
                          style={{ height: '20px', width: '25px' }}
                          src={isTopFilterOpen ? hidefilter : showfilter}
                        />
                      )}
                    />
                  </div>
                </IconButton>
              </div>
            </div>
          )}
        </div>
        <div className={isTopFilterOpen ? 'showFiltersCreate' : 'hideFiltersCreate'}>
          <TopFilters
            editData={editData}
            setFilterDataDisplay={setFilterDataDisplay}
            setIsFilter={setIsFilter}
            setIsTopFilterOpen={setIsTopFilterOpen}
          />
        </div>
        {!isTopFilterOpen && <Divider style={{ width: '100%' }} />}
        {isFilter ? (
          <div>
            <Paper className={classes.root}>
              <div className='filterDataHeader'>
                <div className='divfilterData'>{filterDataDisplay.grade?.grade_name}</div>
                <div className='divfilterData'>
                  {filterDataDisplay.subject.subject?.subject_name}
                </div>
                <div className='divfilterData'>
                  {filterDataDisplay.chapter?.chapter_name}
                </div>
                <div className='divfilterData'>{filterDataDisplay.topic?.topic_name}</div>
              </div>
              <QuestionTypeFilters
                editData={editData}
                domainName={domainName}
                setEditData={setEditData}
                setLoading={setLoading}
                attributes={filterDataDisplay || {}}
                setIsTopFilterOpen={setIsTopFilterOpen}
                filterDataDisplay={filterDataDisplay}
              />
            </Paper>
          </div>
        ) : (
          <div className='periodDataUnavailable'>
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? { height: '100px', width: '200px' }
                      : { height: '160px', width: '290px' }
                  }
                  src={unfiltered}
                />
              )}
            />
            <SvgIcon
              component={() => (
                <img
                  style={
                    isMobile
                      ? { height: '20px', width: '250px' }
                      : { height: '50px', width: '400px', marginLeft: '5%' }
                  }
                  src={selectfilter}
                />
              )}
            />
          </div>
        )}
      </Layout>
    </>
  );
};

export default CreateQuestion;
