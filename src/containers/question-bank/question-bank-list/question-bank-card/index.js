import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, SvgIcon } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import useStyles from './useStyles';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import axios from 'axios'
// import '../../lesson-plan.css';
import downloadAll from '../../../../assets/images/downloadAll.svg';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import { Context } from '../../context/QuestionStore';

const QuestionBankCard = ({
  period,
  setPeriodDataForView,
  setViewMoreData,
  setViewMore,
  viewMore,
  filterDataDown,
  handlePeriodList,
  tabQueTypeId,
  tabQueCatId,
  tabMapId,
  tabQueLevel,
  setLoading,
  index,
  periodColor,
  setPeriodColor,
  setSelectedIndex,
  onClick,
  showAddToQuestionPaper,
}) => {
  const themeContext = useTheme();
  // context data
  // const [state,setState] = useContext(Context)
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();

  const [questionName, setQuestionName] = useState(period.question_answer);

  // console.log(period, 'xxxxx');
  // console.log(state,'contextttttt')
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
    axios.get(`${endpoints.questionBank.viewMoreData}?question=${period?.id}`,{
      headers: { 'x-api-key': 'vikash@12345#1231' },
    })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setLoading(false);
          setViewMore(true);
          setViewMoreData(result?.data?.result);
          // setState({editData:result.data.result})
          setPeriodDataForView(period);
          setSelectedIndex(index);
          setPeriodColor(true);
        } else {
          setLoading(false);
          setViewMore(false);
          setViewMoreData({});
          setPeriodDataForView([]);
          setAlert('error', result?.data?.message);
          setSelectedIndex(-1);
          setPeriodColor(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setViewMore(false);
        setViewMoreData({});
        setPeriodDataForView([]);
        setAlert('error', error?.message);
        setSelectedIndex(-1);
        setPeriodColor(true);
      });
  };

  // console.log(
  //   period,
  //   'PPPPP',

  // );
  const questionType = (type) => {
    switch (type) {
      case 1:
        return 'MCQ SINGLE CHOICE';
      case 2:
        return 'MCQ_MULTIPLE_CHOICE';
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
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }
  const handleDelete = (obj) => {
    axiosInstance
      .put(`${endpoints.questionBank.deleteQuestion}`, {
        question: obj.id,
        is_delete: true,
      })
      .then((result) => {
        if (result.data.status_code === 200) {
          handlePeriodList(tabQueTypeId, tabQueCatId, tabMapId, tabQueLevel);
          setAlert('success', 'Question Deleted Successfully');
        } else {
          setAlert('error', 'ERROR!');
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  };
  return (
    <Paper
      className={periodColor ? classes.selectedRoot : classes.root}
      style={isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' }}
    >
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='primary'
            >
              {questionType(period?.question_type)}
            </Typography>
          </Box>
          <Box>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
              noWrap
            >
              {period?.question_status === '1' ? 'Draft' : null}
              {period?.question_status === '2' ? 'Published' : null}
              {period?.question_status === '3' ? 'Review' : null}
            </Typography>
          </Box>
          {period.question_type === 7 ? (
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                noWrap
              >
                {extractContent(questionName[0]?.question)}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography
                className={classes.content}
                variant='p'
                component='p'
                color='secondary'
                noWrap
              >
                Question: {extractContent(questionName[0]?.question)}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={4} className={classes.textRight}>
          <Box>
            <span
              className='period_card_menu'
              onClick={() => handlePeriodMenuOpen(index)}
              onMouseLeave={handlePeriodMenuClose}
            >
              <IconButton className='moreHorizIcon' color='primary'>
                <MoreHorizIcon />
              </IconButton>
              {showPeriodIndex === index && showMenu ? (
                <div className='tooltipContainer'>
                  <span className='tooltiptext'>
                    {/* Edit */}
                    {/* <IconButton onClick={handleBulkDownload} className="bulkDownloadIconPeriodCard">
                        <SvgIcon
                          component={() => (
                            <img
                              style={{ height: '21px', width: '21px' }}
                              src={downloadAll}
                              alt='downloadAll'
                            />
                          )}
                        />
                      </IconButton> */}
                  </span>
                  <span className='tooltiptext'>
                    <div onClick={(e) => handleDelete(period)}>Delete</div>

                    {/* <Button>Delete</Button>
                    <Button>Edit</Button> */}
                  </span>
                </div>
              ) : null}
            </span>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} />
        <Grid item xs={6}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='secondary'
            >
              Created By: {period?.created_by?.first_name}
            </Typography>
          </Box>
          <Box>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
            >
              {/* {period.updated_at.substring(0, 10)}s */}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} className={classes.textRight}>
          {!periodColor && (
            <Button
              variant='contained'
              style={{ color: 'white', borderRadius: '10px' }}
              color='primary'
              className='custom_button_master'
              size='small'
              onClick={handleViewMore}
            >
              VIEW MORE
            </Button>
          )}
          {showAddToQuestionPaper && period?.question_status === '2' ? (
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              className='custom_button_master'
              size='small'
              onClick={() => onClick(period)}
              style={{ margin: '15px 0', borderRadius: '10px' }}
            >
              ADD TO QUESTION PAPER
            </Button>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QuestionBankCard;
