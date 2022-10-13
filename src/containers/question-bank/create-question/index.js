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
import BreadcrumbToggler from '../../../components/breadcrumb-toggler';
import unfiltered from '../../../assets/images/unfiltered.svg';
import selectfilter from '../../../assets/images/selectfilter.svg';
import TopFilters from './top-filters';
import QuestionTypeFilters from './question-type-filters';
import './create-question.css';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '0px auto',
    boxShadow: 'none',
  },
  filterDataHeader:{
    color: theme.palette.secondary.main,
  fontSize: "16px",
  width: "95%",
  display: "flex",
  margin: "0 auto",
  textTransform: "capitalize",
  padding: "30px 0 15px 5px",
  },
  // divfilterData:{
  //   '& :not':{
  //     '&::after':{
  //       content: " ",
  //       height: "6px",
  //       width: "6px",
  //       backgroundColor:theme.palette.secondary.main,
  //       borderRadius: "50%",
  //       display: "inline-block",
  //       margin: "0 10px",
  //       verticalAlign: "baseline",
  //     }
     
  //   }
  // }
}));

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
  const [chapterDisplay, setChapterDisplay] = useState('');
  const [topicDisplay, setTopicDisplay] = useState('');
  const [filterDataDisplay, setFilterDataDisplay] = useState({
    academic: '',
    branch: '',
    grade: '',
    subject: '',
    chapter: '',
    topic: '',
  });

  const getChapterName = (subjectId, chapterId) => {
    axiosInstance
      .get(`${endpoints.assessmentErp.chapterList}?subject=${subjectId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          const chapterList = result?.data?.result;
          const chapterSelected = chapterList.filter(({ id }) => id === chapterId);
          setChapterDisplay(chapterSelected?.[0]?.chapter_name);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => setAlert('error', error?.message));
  };

  const getTopicName = (chapterId, topicId, isCentral) => {
    if (isCentral) {
      axios
        .get(`${endpoints.createQuestionApis.topicList}?chapter=${chapterId}`, {
          headers: { 'x-api-key': 'vikash@12345#1231' },
        })
        .then((result) => {
          if (result?.data?.status_code === 200) {
            const topicList = result.data?.result;
            const topicSelected = topicList.filter(({ id }) => id === topicId);
            setTopicDisplay(topicSelected?.[0]?.topic_name);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => {
          setAlert('error', error?.message);
        });
    } else {
      axiosInstance
        .get(`${endpoints.assessmentErp.topicList}?chapter=${chapterId}`)
        .then((result) => {
          if (result?.data?.status_code === 200) {
            const topicList = result?.data?.result;
            const topicSelected = topicList.filter(({ id }) => id === topicId);
            setTopicDisplay(topicSelected?.[0]?.topic_name);
          } else {
            setAlert('error', result?.data?.message);
          }
        })
        .catch((error) => setAlert('error', error?.message));
    }
  };

  useEffect(() => {
    if (qId) {
      axiosInstance
        .get(`/assessment/${qId}/retrieve_update_question/`)
        .then((res) => {
          const {
            status_code = '',
            result = {},
            message = 'Error',
            error_msg = 'Error',
          } = res?.data || {};
          if (status_code === 200) {
            setEditData(result);
            const {
              academic_session: academicSession = {},
              grade: gradeDetails = {},
              subject: subjectDetails = {},
              chapter: chapterId = '',
              topic: topicId = '',
              is_central_chapter: isCentralChapter,
            } = result || {};
            const { id: gradeId = '', grade_name: gradeName = '' } = gradeDetails || {};
            const { id: subjectId = '', subject_name: subjectName = '' } =
              subjectDetails || {};
            const {
              branch: branchDetails = {},
              id: acadSessionId = '',
              session_year: academicYearDetails = {},
            } = academicSession || {};
            const { id: branchId, branch_name: branchName } = branchDetails || {};
            const { id: acadId, session_year: sessionYear } = academicYearDetails || {};

            setFilterDataDisplay({
              academic: {
                branch: null,
                created_by: null,
                id: acadId,
                is_delete: false,
                session_year: sessionYear,
              },
              branch: {
                branch: { id: branchId, branch_name: branchName },
                id: acadSessionId,
                sessionYear: { id: acadId, session_year: sessionYear },
              },
              grade: { grade_id: gradeId, grade__grade_name: gradeName },
              subject: { subject_id: subjectId, subject_name: subjectName },
              chapter: {
                chapter_name: '...',
                is_central: isCentralChapter,
                id: chapterId,
                subject: subjectId,
              },
              topic: {
                id: topicId,
                topic_name: '...',
              },
            });
            getChapterName(subjectId, chapterId);
            getTopicName(chapterId, topicId, isCentralChapter);
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

  useEffect(() => {
    if (chapterDisplay && topicDisplay && editData) {
      const { chapter, topic } = { ...filterDataDisplay };
      setFilterDataDisplay((prev) => ({
        ...prev,
        chapter: { ...chapter, chapter_name: chapterDisplay },
        topic: { ...topic, topic_name: topicDisplay },
      }));
    }
  }, [chapterDisplay, topicDisplay]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <BreadcrumbToggler isFilter={isTopFilterOpen} setIsFilter={setIsTopFilterOpen}>
          <CommonBreadcrumbs
            componentName='Question Bank'
            childComponentName='Create Question'
            isAcademicYearVisible={true}
          />
        </BreadcrumbToggler>

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
          <Paper className={classes.root}>
            <div className={classes.filterDataHeader}>
              {filterDataDisplay?.grade?.grade_name ? (
              <div className='divfilterData'>
                {filterDataDisplay?.grade?.grade__grade_name}
              </div>

              ) : ''}
              {filterDataDisplay?.subject?.subject_name ? (
              <div className='divfilterData'>
                {filterDataDisplay?.subject?.subject_name}
              </div>

              ) : ''}
              {filterDataDisplay?.chapter?.chapter_name ? (

              <div className='divfilterData'>
                {filterDataDisplay?.chapter?.chapter_name}
              </div>
              ) : ''}
              {filterDataDisplay?.topic?.topic_name ? (
                <div className='divfilterData'>{filterDataDisplay?.topic?.topic_name}</div>

              ): ''}
            </div>
            <QuestionTypeFilters
              editData={editData}
              setEditData={setEditData}
              setLoading={setLoading}
              attributes={filterDataDisplay || {}}
              setIsTopFilterOpen={setIsTopFilterOpen}
              filterDataDisplay={filterDataDisplay}
            />
          </Paper>
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
