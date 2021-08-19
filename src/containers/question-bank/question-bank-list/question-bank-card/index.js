import React, { useState, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, SvgIcon } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import useStyles from './useStyles';
import endpoints from '../../../../config/endpoints';
import axiosInstance from '../../../../config/axios';
import axios from 'axios';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';

const QuestionBankCard = ({
  period,
  setPeriodDataForView,
  setViewMoreData,
  setViewMore,
  setLoading,
  index,
  setSelectedIndex,
  setCallFlag,
  onClick,
  showAddToQuestionPaper,
  periodColor,
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [questionName, setQuestionName] = useState(period.question_answer);

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
    if (period?.is_central) {
      axios
        .get(`${endpoints.questionBank.viewMoreData}?question=${period?.id}`, {
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
    if (!period.is_central) {
      axiosInstance
        .get(`${endpoints.questionBank.erpViewMoreData}?question=${period?.id}`)
        .then((result) => {
          if (result?.data?.status_code === 200) {
            setLoading(false);
            setViewMore(true);
            setViewMoreData(result?.data?.result);
            // setState({editData:result.data.result})
            setPeriodDataForView(period);
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
  return (
    <Paper
      className={periodColor ? classes.selectedRoot : classes.root}
      style={
        isMobile
          ? { margin: '0rem auto' }
          : {
              margin: '0rem auto -1.1rem auto',
              background: period?.question_status === '2' ? '#FCEEEE ' : '',
              border: period?.question_status === '2' ? '1px solid red ' : '',
            }
        // ? { margin: '0rem auto', height: '165px' }
        // : { margin: '0rem auto -1.1rem auto', height: '165px' }
      }
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
        {!period.is_central && (
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
                    <span className={` ${classes.tooltiptext} tooltiptext`}>
                      <div onClick={handleDelete}>Delete</div>
                      <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
                        <DialogTitle id='draggable-dialog-title'>
                          Delete Question
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete ?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleDeleteCancel}
                            className='labelColor cancelButton'
                          >
                            Cancel
                          </Button>
                          <Button
                            color='primary'
                            variant='contained'
                            style={{ color: 'white' }}
                            onClick={(e) => handleDeleteConfirm(period)}
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                      {/* <Dialog
                        open={Diaopen}
                        onClose={DiaClose}
                        // style={{ backgroundColor: 'transparent', opacity: '0.4' }}
                        aria-labelledby='alert-dialog-title'
                        aria-describedby='alert-dialog-description'
                      >
                        <DialogTitle id='alert-dialog-title'>
                          {'Confirmation For Delete'}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id='alert-dialog-description'>
                            Are You Sure to Delete ??.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={(e) => handleDelete(period)} color='primary'>
                            yes
                          </Button>
                          <Button onClick={DiaClose} color='primary' autoFocus>
                            No
                          </Button>
                        </DialogActions>
                      </Dialog> */}
                    </span>
                  </div>
                ) : null}
              </span>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sm={12} />
        <Grid item xs={6}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='secondary'
            >
              {/* Created By: {period?.created_by?.first_name} */}
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
          {!periodColor ? (
            <Button
              variant='contained'
              style={{ color: 'white', width: '100%' }}
              color='primary'
              size='small'
              onClick={handleViewMore}
            >
              VIEW MORE
            </Button>
          ) : (
            <Button
              variant='contained'
              style={{ color: 'white', width: '100%', visibility: 'hidden' }}
              color='primary'
              size='small'
              onClick={handleViewMore}
            >
              VIEW MORE
            </Button>
          )}
          {showAddToQuestionPaper && period?.question_status === '2' ? (
            <Button
              variant='contained'
              style={{ margin: '15px 0', color: 'white', width: '100%' }}
              color='primary'
              size='small'
              onClick={() => onClick(period)}
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
