import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, IconButton, SvgIcon } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
// import useStyles from './useStyles';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import moment from 'moment';
import axios from 'axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Button, Checkbox, Drawer, Input, Typography } from 'antd';
import ViewMoreCard from 'containers/question-bank/question-bank-list/view-more-card';

const QuestionBankCard = ({
//   period,
  setPeriodDataForView,
  setViewMoreData,
  setViewMore,
  setLoading,
  index,
  setSelectedIndex,
  setCallFlag,
  toggleCompleteQuestion,
  handleMarks,
  questionPaperWise,
//   onClick,
//   showAddToQuestionPaper,
//   periodColor,
//   toggleComplete,
//   toggleCompleteQuestion,
//   isSelectAll,
//   redFlag,
//   checkbox,
//   periodData,
//   questionId
question
}) => {
    console.log(question,'!!')
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
//   const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [questionName, setQuestionName] = useState(question?.question_answer);
  const [isChecked,setIsChecked]= useState(false);
  const [selectedPublished, setSelectedPublished] = useState([]);
//   const [viewMore,setViewMore] = useState(false)
//   const [viewMoreData , setViewMoreData] = useState([])
//   const  [periodDataForView ,setPeriodDataForView] = useState([])
//   const [loading , setLoading] = useState(false)
//   const [callFlag, setCallFlag] = useState(false)
//   const [selectedIndex, setSelectedIndex] = useState(-1)

console.log(questionName,'questionName')

  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };
  const handleViewMore = () => {
    setLoading(true);
    // axiosInstance
    //   .get(`${endpoints.questionBank.viewMoreData}?question=${period.id}`)
    if (question?.is_central) {
      axios
        .get(`${endpoints.questionBank.viewMoreData}?question=${question?.id}`, {
          headers: { 'x-api-key': 'vikash@12345#1231' },
        })
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false);
            setViewMore(true);
            setViewMoreData(result?.data?.result);
            // setState({editData:result.data.result})
            setPeriodDataForView(question);
            setSelectedIndex(index);
          } else {
            setLoading(false);
            setViewMore(false);
            setViewMoreData({});
            setPeriodDataForView([]);
            setAlert('error', result?.data?.message);
            setSelectedIndex(-1);
          }
        })
        .catch((error) => {
          setLoading(false);
          setViewMore(false);
          setViewMoreData({});
          setPeriodDataForView([]);
          setAlert('error', error?.message);
          setSelectedIndex(-1);
        });
    }
    if (!question.is_central) {
      axiosInstance
        .get(`${endpoints.questionBank.erpViewMoreData}?question=${question?.id}`)
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false);
            setViewMore(true);
            setViewMoreData(result?.data?.result);
            // setState({editData:result.data.result})
            setPeriodDataForView(question);
            setSelectedIndex(index);
          } else {
            setLoading(false);
            setViewMore(false);
            setViewMoreData({});
            setPeriodDataForView([]);
            setAlert('error', result?.data?.message);
            setSelectedIndex(-1);
          }
        })
        .catch((error) => {
          setLoading(false);
          setViewMore(false);
          setViewMoreData({});
          setPeriodDataForView([]);
          setAlert('error', error?.message);
          setSelectedIndex(-1);
        });
    }
  };


  const getquestionLevel = (type) => {
    switch (type) {
      case 1:
        return 'Easy';
      case 2:
        return 'Average';
      case 3:
        return 'Difficult';
      default :
        return '--'
    }
  };

  const questionType = (type) => {
    switch (type) {
      case 1:
        return 'MCQ Single Choice';
      case 2:
        return 'MCQ Multiple Choice';
      case 3:
        return 'Match the Following';
      case 4:
        return 'Video Question';
      case 5:
        return 'PPT Question';
      case 6:
        return 'Matrix Questions';
      case 7:
        return 'Comprehension Questions';
      case 8:
        return 'True False';
      case 9:
        return 'Fill In The Blanks';
      case 10:
        return 'Descriptive';
      default:
        return '--';
    }
  };
  function extractContent(s) {
    console.log(s,'quesname')
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }
  // const DiaClickOpen = () => {
  //   setdiaOpen(true);
  // };

  // const DiaClose = () => {
  //   setdiaOpen(false);
  // };
  const handleDelete = () => {
    setDeleteAlert(true);
  };
  const handleDeleteConfirm = (obj) => {
    axiosInstance
      .put(`${endpoints.questionBank.erpQuestionPublishing}`, {
        question: obj?.id,
        is_delete: true,
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setCallFlag((prev) => !prev);
          setAlert('success', 'Question Deleted Successfully');
          setDeleteAlert(false);
        } else {
          setAlert('error', 'ERROR!');
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };
  const handleDeleteCancel = () => {
    setDeleteAlert(false);
  };
  //..........................................-------------------------------------------------------------------------
  const [enableMarks , setEnableMarks] = useState(false)

  const setMarksEnable = (e) =>{
    setEnableMarks(e.target.checked)
  }

  return (
    <>
    <div className='row my-2'>
        {/* <div>
            a
        </div> */}
        <div className='col-md-11 ml-3 mt-2' style={{border:'1px solid',borderRadius:'6px',background : '#f8f8f8'}}>
        <div className='row col-md-12 mt-1'>
            <div className='col-md-6 pl-0'><Checkbox checked={question?.checked} onChange={(e) =>
             {toggleCompleteQuestion(e,question,index)
              setEnableMarks(e.target.checked)
          }    

            } /> Select Question To Paper</div>
            {/* <div className='col-md-2'></div> */}
            {!questionPaperWise && <div className='col-md-6 d-flex justify-content-end pr-0'>
            <div className='mr-2' style={{color : '#00c040'}}>Assign Marks</div>
              <Input disabled={!question?.checked} type='number' maxLength={3} onChange={(e) => handleMarks(e,question,index)} style={{width:'52px', height:'24px',background: enableMarks ? 'white' : ''}} /></div>
            }
        </div>
        <hr className='mt-1' />
        <div className='row'>
        Question: {extractContent(question?.question_answer[0]?.question).length > 70 ? extractContent(question?.question_answer[0]?.question).substring(0,70) + '...' : extractContent(question?.question_answer[0]?.question)}
        </div>
        <div className='row col-md-12 my-2'>
            <div className='d-flex col-md-2 align-items-center justify-content-center pl-0' style={{fontSize : '13px',background:'#00be91' ,color:'white', borderRadius:'6px',height:'20px'}}>
                {getquestionLevel(parseInt(question?.question_level))}
                </div>
            <div className='d-flex col-md-3 align-items-center justify-content-center ml-2' style={{fontSize : '13px' , background:'#01b8d8' , color:'white',borderRadius:'6px',height:'20px'}}>
                {questionType(question?.question_type)}</div>
            <div className='d-flex col-md-5 align-items-center ml-2' style={{height:'20px'}}>
                <Typography style={{fontSize:'13px'}}>
                Created on : {moment(question?.created_at).format('L')}
                </Typography>                
            </div>
            <div className='pr-0 ml-2'>
                <Button size='small' onClick={handleViewMore} className='th-button-active' style={{fontSize:'13px'}}>
                    View
                </Button>
            </div>
        </div>
        </div>
    </div>
    {/* {viewMore && <ViewMoreCard
                      setSelectedIndex={setSelectedIndex}
                      viewMoreData={viewMoreData}
                      setViewMore={setViewMore}
                    //   filterDataDown={filterDataDown}
                      periodDataForView={periodDataForView}
                      setCallFlag={setCallFlag}
                    />} */}
    </>
  );
};

export default QuestionBankCard;
