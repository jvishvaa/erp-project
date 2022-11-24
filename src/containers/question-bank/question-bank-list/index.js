import React, { useContext, useRef, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { Grid, useTheme, SvgIcon, IconButton, FormGroup,FormControlLabel, Checkbox} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { connect } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import BreadcrumbToggler from '../../../components/breadcrumb-toggler';
import './question-bank.css';
import Loading from '../../../components/loader/loader';
import QuestionBankCard from './question-bank-card';
import QuestionBankFilters from './question-bank-filter';
import ViewMoreCard from './view-more-card';
import TabPanel from './tab-panel';
import NoFilterData from 'components/noFilteredData/noFilterData';
import hidefilter from '../../../assets/images/hidefilter.svg';
import showfilter from '../../../assets/images/showfilter.svg';
import { addQuestionToSection } from '../../../redux/actions';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import axios from 'axios';
import { Breadcrumb, Button, Switch } from 'antd';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '-10px auto',
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
  },
}));

const QuestionBankList = ({ sections, initAddQuestionToSection }) => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = useState(1);
  const [periodData, setPeriodData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [viewMoreData, setViewMoreData] = useState({});
  const [periodDataForView, setPeriodDataForView] = useState([]);
  const [filterDataDown, setFilterDataDown] = useState({});
  const limit = 21;
  const history = useHistory();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const [isFilter, setIsFilter] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [tabMapId, setTabMapId] = useState('');
  const [tabQueLevel, setTabQueLevel] = useState('');
  const [tabQueTypeId, setTabQueTypeId] = useState('');
  const [tabQueCatId, setTabQueCatId] = useState('');
  const [tabTopicId, setTabTopicId] = useState('');
  const [tabYearId, setTabYearId] = useState('');
  const [tabGradeId, setTabGradeId] = useState('');
  const [tabChapterId, setTabChapterId] = useState('');
  const [tabIsErpCentral, setTabIsErpCentral] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const questionId = query.get('question');
  const section = query.get('section');
  const isEdit = query.get('isedit');
  const filterRef = useRef(null);
  const [clearFlag, setClearFlag] = useState(false);
  const [callFlag, setCallFlag] = useState(false);
  const [ is_Filter , setFilter ] = useState(false)
  const [selectedId,setSelectedId] = useState([])
  const [isChecked, setIsChecked] = useState(false);
  const [questionStatus,setQuestionStatus] = useState('');
  const [publishedQuestion, setPublishedQuestion] = useState([])
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isSelectAllQuestion, setIsSelectAllQuestion] = useState(false);
  const [selectedIdQuestion,setSelectedIdQuestion] = useState([])
  const [selectedQuestion , setSelectedQuestion ] = useState([])
  const [redFlag,setRedflag] = useState(false);
  const [isVisible,setIsVisible] = useState([])
  const [checkbox,setCheckbox] = useState(false);
  const [erpCategory , setErpCategory] = useState()
  const filtersDetails = location?.state?.params

  const addQuestionToPaper = (question, questionId, section) => {
    initAddQuestionToSection(question, questionId, section);
    setAlert('success', 'Question added successfully!');
    filterRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  const handleAddQuestionToQuestionPaper = (question) => {
    console.log(question);
    const questionIds = [];
    const centralQuestionIds = [];
    sections.forEach((q) => {
      q.sections[0].questions.forEach(({ id = '', is_central = false }) => {
        if (is_central) {
          centralQuestionIds.push(id);
        } else {
          questionIds.push(id);
        }
      });
    });
    if (!question?.is_central) {
      if (!questionIds.includes(question?.id)) {
        addQuestionToPaper(question, questionId, section);
      } else setAlert('error', 'Question already added!');
    } else {
      if (!centralQuestionIds.includes(question?.id)) {
        addQuestionToPaper(question, questionId, section);
      } else setAlert('error', 'Question already added!');
    }
  };

  const handlePagination = (event, page) => {
    setPage(page);
    setSelectedIndex(-1);
  };

  const handlePeriodList = (
    quesTypeId,
    quesCatId = '',
    subjMapId,
    quesLevel,
    topicId = '',
    yearId,
    gradeId,
    chapterObj,
    isErpCentral = false,
    newValue = 0,
    erp_category,
  ) => {
    setLoading(true);
    setPeriodData([]);
    setTabQueTypeId(quesTypeId);
    setTabQueCatId(quesCatId);
    setTabTopicId(topicId);
    setTabMapId(subjMapId);
    setTabQueLevel(quesLevel);
    setTabYearId(yearId);
    setTabGradeId(gradeId);
    setTabChapterId(chapterObj);
    setTabIsErpCentral(isErpCentral);
    setTabValue(newValue);
    setErpCategory(erp_category)
    let requestUrl = `${endpoints.questionBank.erpQuestionList}?academic_session=${yearId}&grade=${gradeId}&page_size=${limit}&page=${page}`;
    requestUrl += `&request_type=${tabIsErpCentral? 2 : 1}`;  
    if (subjMapId) {
      requestUrl += `&subject=${subjMapId}`;
    }
    if (newValue) {
      requestUrl += `&question_status=${newValue}`;
    }
    if(chapterObj){
      requestUrl += `&chapter=${chapterObj}`;
    }
    if(quesLevel){
      requestUrl += `&question_level=${quesLevel}`;
    }
    if(quesTypeId){
      requestUrl += `&question_type=${quesTypeId}`;
    }
    if (quesCatId) {
      requestUrl += `&question_categories=${quesCatId}`;
    }
    if (topicId) {
      requestUrl += `&topic=${topicId}`;
    }
    if (erp_category) {
      requestUrl += `&category=${erp_category}`;
    }
    setFilter(false)
    axiosInstance
      .get(requestUrl)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          let tempArray = result?.data?.result?.results?.map((items)=>{
            items["checked"] = false;
          })
          if(result?.data?.result?.count == 0){
            setAlert('error', 'Data Not Available')
          }
          setTotalCount(result?.data?.result?.count);
          setLoading(false);
          setPeriodData(result?.data?.result?.results);
          var isVisible =result?.data?.result?.results.map((question) => question?.question_status === "3").filter((ques)=> ques === true)
          setIsVisible(isVisible)
          setViewMore(false);
          setViewMoreData({});
          setSelectedIndex(-1);
        } else {
          setLoading(false);
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error',  error?.response?.data?.message ||
        error?.response?.data?.msg);
      });
  };

useEffect(() => {
if(filtersDetails){
  setTabChapterId(filtersDetails?.chapter)
  setTabGradeId(filtersDetails?.grade)
  setTabYearId(filtersDetails?.academic_session)
  setTabTopicId(filtersDetails?.topic)
  handlePeriodList(
    tabQueTypeId,
    tabQueCatId,
    tabMapId,
    tabQueLevel,
    filtersDetails?.topic,
    filtersDetails?.academic_session,
    filtersDetails?.grade,
    filtersDetails?.chapter,
    tabIsErpCentral,
    tabValue,
    erpCategory
  )
}

},[filtersDetails])


  useEffect(() => {
    if (
      // tabMapId &&
      tabYearId &&
      tabGradeId && page
    ) {
      setIsSelectAll(false)
      setIsSelectAllQuestion(false)
      setSelectedId([])
      setSelectedIndex(-1);
      handlePeriodList(
        tabQueTypeId,
        tabQueCatId,
        tabMapId,
        tabQueLevel,
        tabTopicId,
        tabYearId,
        tabGradeId,
        tabChapterId,
        tabIsErpCentral,
        tabValue,
        erpCategory
      );
    }
  }, [page, tabValue, callFlag, tabIsErpCentral ]);

  useEffect(() => {
    if(clearFlag === true){
      setTabMapId('');
      setTabQueLevel('');
      setTabQueTypeId('');
      setTabQueCatId('');
      setTabTopicId('');
      setTabGradeId('');
      setTabChapterId('');
      setTabIsErpCentral(false);
      setSelectedId([])
      setIsSelectAll(false)
      setClearFlag(false)
    }
    
  }, [clearFlag]);

  const toggleComplete= (e, question, index) => {
    console.log("hit");
    const {name,checked} = e.target;
    console.log(name , checked);
    if(name === "allSelect"){
      if(checked === true){
        setIsSelectAll(true)
        setRedflag(true)
        let tempData = [...periodData]
        let tempArr = tempData.map((item)=>{ return {...item, checked}})
        let temQuestionId = tempArr.filter((item) => item?.question_status === "3").map((ques) => ques?.id)
        setSelectedId(temQuestionId)
        setPeriodData(tempArr)
        // setLoading(false)

      } else{
        setIsSelectAll(false)
        setRedflag(false)
        let tempData = [...periodData]
        let tempArr = tempData.map((item)=>{ return {...item, checked}})
        setSelectedId([])
        setPeriodData(tempArr)
        // setLoading(false)
      }

    }else{

      // for child component ->
      setIsSelectAll(false)
      let tempAllData =   [...periodData];
      let newData = {...periodData[index], checked}
      console.log("checking12",periodData[index],newData);
      tempAllData.splice(index, 1, newData);
      setPeriodData(tempAllData);
      if(selectedId.includes(question?.id) === false){
          setSelectedId([...selectedId,question?.id])
          setLoading(false)
      }else{
        let tempArr=[]
        tempArr=selectedId.filter((el) => el !== question?.id)
        setSelectedId(tempArr)
        setIsSelectAll(false)
      }

    }

  }

  const changequestionFrom = (e) => {
setTabIsErpCentral((prev) => !prev)
  }

  const handleGoBack = () => {
    if(questionId && section){
      history.push({
        pathname:  `/question-chapter-wise`, //?question=${questionId}&section=${section}&isedit=${isEdit}
        state : {
         filters : filtersDetails
        }
         
         })
    }else{
      history.push({
        pathname:  `/question-chapter-wise`,
        state : {
         filters : filtersDetails
        }
         
         })
    }
  }

  const handlePublish = () => {
    if(selectedId.length < 0){
      setAlert('error',"Please Select Question to Publish")
      return

    }else{
      
      if (publishedQuestion?.is_central) {
        axios
          .put(
            `${endpoints.questionBank.deleteQuestion}`,
            {
              question_status: 2,
              question: selectedId.toString(),
            },
            {
              headers: { 'x-api-key': 'vikash@12345#1231' },
            }
          )
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setSelectedIndex(-1);
              setCallFlag((prev) => !prev);
              setAlert('success', result?.data?.message);
              setIsSelectAll(false)
            } else {
              setAlert('error', 'ERROR!');
            }
          })
          .catch((error) => setAlert('error', error?.message));
      }
      if (!publishedQuestion?.is_central) {
        axiosInstance
          .put(`${endpoints.questionBank.erpQuestionNewPublishing}`, {
            question_status: 2,
            question: selectedId.toString(),
          })
          .then((result) => {
            if (result?.data?.status_code === 200) {
              setSelectedIndex(-1);
              setCallFlag((prev) => !prev);
              setAlert('success', result?.data?.message);
            } else {
              setAlert('error', 'ERROR!');
            }
          })
          .catch((error) => setAlert('error', error?.message));
      }
    }
  };

  const toggleCompleteQuestion = (e, question, index) => {
    const {name,checked} = e.target;
    console.log(name , checked);
    console.log(question ,'hit');
    if(name === "allSelect"){
      if(checked === true){
        setIsSelectAllQuestion(true)
        setRedflag(true)
        let tempData = [...periodData]
        let tempArr = tempData.map((item)=>{ return {...item, checked}})
        let temQuestionId = tempArr.filter((item) => item?.question_status === "2").map((ques) => ques?.id)
        let tempQues = tempArr.filter((item) => item?.question_status === "2").map((ques) => ques)
        setSelectedIdQuestion(temQuestionId)
        setSelectedQuestion(tempQues)
        setPeriodData(tempArr)
        // setLoading(false)

      } else{
        setIsSelectAllQuestion(false)
        setRedflag(false)
        let tempData = [...periodData]
        let tempArr = tempData.map((item)=>{ return {...item, checked}})
        setSelectedIdQuestion([])
        setSelectedQuestion([])
        setPeriodData(tempArr)
        // setLoading(false)
      }

    }else{

      // for child component ->
      setIsSelectAllQuestion(false)
      let tempAllData =   [...periodData];
      let newData = {...periodData[index], checked}
      console.log("checking12",periodData[index],newData);
      tempAllData.splice(index, 1, newData);
      setPeriodData(tempAllData);
      if(selectedIdQuestion.includes(question?.id) === false){
        setSelectedIdQuestion([...selectedIdQuestion,question?.id])
        setSelectedQuestion([...selectedQuestion,question])
          setLoading(false)
      }else{
        let tempArr=[]
        let tempQues = []
        tempArr=selectedIdQuestion.filter((el) => el !== question?.id)
        tempQues = selectedQuestion.filter((el) => el?.id !== question?.id)
        console.log(tempQues);
        setSelectedIdQuestion(tempArr)
        setSelectedQuestion(tempQues)
        setIsSelectAllQuestion(false)
        console.log(tempArr);
      }

    }
    console.log(selectedQuestion);
  }

  const handleAdd = () => {
    let callRedux = selectedQuestion?.map((item , index) => {
      handleAddQuestionToQuestionPaper(item)
    })
  }

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div
          className='question-bank-scroll'
          style={{
            height: '90vh',
            overflowX: 'scroll',
            overflowY: 'scroll',
          }}
        >
          {/* <BreadcrumbToggler isFilter={isFilter} setIsFilter={setIsFilter}> */}
          <div className='row col-6'>
            <div className='col-md-6 th-bg-grey' style={{ zIndex: 2 }}>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item className='th-black-1 th-18'>Assessment</Breadcrumb.Item>
                <Breadcrumb.Item className='th-black-1 th-18'>
                  Question Bank
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          <div style={{background:'white'}}>
          {/* </BreadcrumbToggler> */}
          <div className='col-12 mt-5 ml-1 mb-2 th-bg-white'>
            <div className='row align-items-center d-flex p-2 ml-2'>
              <div className='col-md-2 col-6 pl-0'>
                Grade : {filtersDetails?.gradeName}
              </div>
              <div className='col-md-2 col-6 pl-0'>
                Subject : {filtersDetails?.subjectName}
              </div>
              <div className='col-md-2 col-6 pl-0'>
                {/* Borad : {filtersDetails?.boardName} */}
              </div>
              <div className='col-md-3 col-6 pl-0'></div>
              <div className='col-md-2 col-6 pl-0 d-flex justify-content-end'>
                <Button
                  type='primary'
                  size='default'
                  shape='round'
                  color='primary'
                  variant='contained'
                  onClick={handleGoBack}
                  style={{ width: '70%' }}
                >
                  Back
                </Button>
              </div>
              <div className='hideShowFilterIcon'>
                <IconButton onClick={() => setIsFilter(!isFilter)}>
                  {/* {!isMobile && (
            <div className='togglerTag'>
              {isFilter ? 'Close Filter' : 'Expand Filter'}
            </div>
          )} */}
                  <SvgIcon
                    component={() => (
                      <img
                        style={{ height: '20px', width: '25px' }}
                        src={isFilter ? hidefilter : showfilter}
                      />
                    )}
                  />
                </IconButton>
              </div>
            </div>

            <div className={isFilter ? 'showFilters' : 'hideFilters'} ref={filterRef}>
              <QuestionBankFilters
                setClearFlag={setClearFlag}
                questionId={questionId}
                section={section}
                isEdit={isEdit}
                handlePeriodList={handlePeriodList}
                setPeriodData={setPeriodData}
                setViewMore={setViewMore}
                setViewMoreData={setViewMoreData}
                setFilterDataDown={setFilterDataDown}
                setSelectedIndex={setSelectedIndex}
                setFilter={setFilter}
                setPage={setPage}
                FilteredData={filtersDetails}
                tabIsErpCentral={tabIsErpCentral}
              />
            </div>
          </div>
          <Grid
            container
            style={
              isMobile
                ? { width: '95%', margin: '20px auto', background:'white' }
                : { width: '100%', margin: '20px auto' , background:'white' }

            }
            spacing={5}
          >
            {/* <TabPanel setTabValue={setTabValue} tabValue={tabValue} setPage={setPage} /> */}
            <div className='row ml-2'>
              <div className='col-md-1 col-6'>
                <Button
                  className={`${
                    tabValue == 0 ? 'th-button-active' : 'th-button'
                  } th-width-100 th-br-6 mt-2`}
                  onClick={() => setTabValue(0)}
                >
                  All
                </Button>
              </div>
              <div className='col-md-2 col-6'>
                <Button
                  className={`${
                    tabValue == 1 ? 'th-button-active' : 'th-button'
                  } th-width-100 th-br-6 mt-2`}
                  onClick={() => setTabValue(1)}
                >
                  Draft
                </Button>
              </div>
              <div className='col-md-2 col-6'>
                <Button
                  className={`${
                    tabValue == 2 ? 'th-button-active' : 'th-button'
                  } th-width-100 th-br-6 mt-2`}
                  onClick={() => setTabValue(2)}
                >
                  Published
                </Button>
              </div>
              <div className='col-md-2 col-6'>
                <Button
                  className={`${
                    tabValue == 3 ? 'th-button-active' : 'th-button'
                  } th-width-100 th-br-6 mt-2`}
                  onClick={() => setTabValue(3)}
                >
                  For Review
                </Button>
              </div>
              <div className='col-md-1 col-6'></div>
              <div className='col-md-2 col-6'>
                <Button
                  className={`${ tabIsErpCentral ? 'highlightbtn th-button-active' : 'nonHighlightbtn'
                  } th-width-100 th-br-6 mt-2`}
                  style={{boxShadow : tabIsErpCentral ? 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px' : 'none' }}
                  onClick={() => changequestionFrom('edu')}
                >
                  Eduvate Question
                </Button>
                </div>
                {/* <div className='d-flex align-items-center'> 
                <Switch onChange={changequestionFrom} checked={tabIsErpCentral}/>
                </div> */}
                <div className='col-md-2 col-6'> 
                <Button
                  className={`${
                    !tabIsErpCentral ? 'highlightbtn th-button-active' : 'nonHighlightbtn'}
                     th-width-100 th-br-6 mt-2`}
                  onClick={() => changequestionFrom('school')}
                  style={{boxShadow : !tabIsErpCentral ? 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px' : 'none'}}
                >
                  School Question
                </Button>
                </div>
            </div>
            {isVisible?.length > 0 && !questionId ?  (
              <Grid item xs={12} sm={12}>
                <Grid container spacing={3} style={{ alignItems: 'center' }}>
                  <Grid item xs={3}>
                    <Button
                      style={{ margin: '0.5rem', width: '100%' }}
                      className='th-button'
                      onClick={(e) => handlePublish()}
                      color='primary'
                      disabled={selectedId.length === 0 ? true : false}
                      variant='contained'
                      size='medium'
                      startIcon={<DoneAllIcon />}
                    >
                      BULK PUBLISH
                    </Button>
                  </Grid>

                  <Grid item xs={3}>
                    <FormControlLabel
                      style={{ minWidth: '150px' }}
                      control={
                        <Checkbox
                          checked={isSelectAll}
                          onChange={(e) => toggleComplete(e, periodData)}
                          name='allSelect'
                        />
                      }
                      label='Select All'
                    />
                  </Grid>
                  <div className='col-md-1 col-4'></div>
                </Grid>
                
              </Grid>
            ) : ''} {questionId ? (
              <Grid item xs={12} sm={12} 
              >
                <Grid container spacing={3} style={{alignItems:"center"}}>
                   <Grid item xs={3}>
                <Button
                  style={{ margin: '0.5rem', color: 'white', width:'100%'}}
                  onClick={(e) => handleAdd()}
                  className='th-button'
                  color='primary'
                  disabled={selectedIdQuestion.length === 0 ? true : false }
                  variant='contained'
                  size='medium'
                  startIcon={<DoneAllIcon/>}
                >
                  ADD QUESTIONS
                </Button> 
    
                </Grid>
    
                <Grid item xs={3}>
                <FormControlLabel
                    style={{minWidth:"150px"}}
                    control={<Checkbox 
                    checked={isSelectAllQuestion}
                    onChange={(e) => toggleCompleteQuestion(e,periodData)} 
                    name="allSelect" />}
                    label="Select All"
                  />
                </Grid>
                
                </Grid>
             
              </Grid>
    
              ): ''}
    
          </Grid>
          <Grid
            container
            style={
              isMobile
                ? { width: '95%', margin: '20px auto' }
                : { width: '100%', margin: '20px auto' }
            }
            spacing={5}
          ></Grid>
          <Paper className={classes.root}>
            {periodData?.length > 0 ? (
              <Grid
                container
                style={
                  isMobile
                    ? { width: '95%', margin: '20px auto' }
                    : { width: '100%', margin: '20px auto' }
                }
                spacing={5}
              >
                <Grid item xs={12} sm={viewMore ? 7 : 12}>
                  <Grid container spacing={isMobile ? 3 : 5}>
                    {periodData.map((period, i) => (
                      <Grid
                        item
                        xs={12}
                        style={isMobile ? { marginLeft: '-8px' } : null}
                        sm={viewMore ? 6 : 4}
                      >
                        <QuestionBankCard
                          index={i}
                          filterDataDown={filterDataDown}
                          period={period}
                          setSelectedIndex={setSelectedIndex}
                          periodColor={selectedIndex === i}
                          viewMore={viewMore}
                          setLoading={setLoading}
                          setViewMore={setViewMore}
                          setViewMoreData={setViewMoreData}
                          setPeriodDataForView={setPeriodDataForView}
                          setCallFlag={setCallFlag}
                          onClick={
                            questionId && section
                              ? handleAddQuestionToQuestionPaper
                              : null
                          }
                          showAddToQuestionPaper={questionId && section}
                          toggleComplete={toggleComplete}
                          isSelectAll={isSelectAll}
                          redFlag={redFlag}
                          checkbox={checkbox}
                          periodData={periodData}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                {viewMore && (
                  <Grid item xs={12} sm={5} style={{ width: '100%' }}>
                    <ViewMoreCard
                      setSelectedIndex={setSelectedIndex}
                      viewMoreData={viewMoreData}
                      setViewMore={setViewMore}
                      filterDataDown={filterDataDown}
                      periodDataForView={periodDataForView}
                      setCallFlag={setCallFlag}
                    />
                  </Grid>
                )}
              </Grid>
            ) : (
              <div className='periodDataUnavailable'>
                <NoFilterData selectfilter={true} />
              </div>
            )}

            {periodData?.length > 0 && (
              <div className='paginateData paginateMobileMargin'>
                <Pagination
                  onChange={handlePagination}
                  style={{ marginTop: 25 }}
                  count={Math.ceil(totalCount / limit)}
                  color='primary'
                  page={page}
                />
              </div>
            )}
          </Paper>
          </div>
        </div>
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => ({
  sections: state.createQuestionPaper.questions,
});

const mapDispatchToProps = (dispatch) => ({
  initAddQuestionToSection: (question, questionId, section) => {
    dispatch(addQuestionToSection(question, questionId, section));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionBankList);
