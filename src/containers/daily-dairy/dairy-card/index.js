import React, { useContext, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { useLocation } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton, Divider, SvgIcon } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
import './dairy-card.css';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { useHistory } from 'react-router-dom';
import cardAttachment from '../../../assets/images/cardAttachment.svg';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Context } from '../context/context';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

const DailyDairy = ({
  lesson,
  period,
  setPeriodDataForView,
  setViewMoreData,
  setViewMore,
  setLoading,
  index,
  periodColor,
  setPeriodColor,
  setSelectedIndex,
  setEditData,
  handleDairyType,
  deleteFlag,
  setDeleteFlag,
}) => {
  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const history = useHistory();
  const [state, setState] = useContext(Context);
  const location = useLocation();
  const [deleteAlert, setDeleteAlert] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [deleteIndex, setDeleteIndex] = React.useState(null);
  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };
  const handleDeleteCancel = () => {
    setDeleteId(null);
    setDeleteIndex(null);
    setDeleteAlert(false);
  };
  const handleDeleteOpen = () => {
    // setDeleteId(null);
    // setDeleteIndex(null);
    setDeleteAlert(true);
  };
  const isTeacher = location.pathname === '/diary/teacher' ? true : false;

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };

  const handleViewMore = () => {
    setLoading(true);
    setLoading(false);
    setViewMore(true);
    setViewMoreData(lesson);
    setPeriodDataForView(lesson);
    setSelectedIndex(index);
    setPeriodColor(true);
    handleDairyType(2);
  };
  const handleDelete = (e, index) => {
    axiosInstance
      .delete(`${endpoints.dailyDairy.updateDelete}${e.id}/update-delete-dairy/`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAlert('success', result.data.message);
          setDeleteFlag(!deleteFlag);
          setDeleteId(e.id);
          setDeleteIndex(e);
          setDeleteAlert(true);
        } else {
          setAlert('errpr', 'ERROR!');
        }
      });
  };
  // const handleDelete = (e) => {

  //   setDeleteId(e.id);
  //   setDeleteIndex(e);
  //   setDeleteAlert(true);
  // };

  const handleEdit = (data) => {
    setState({ editData: data, isEdit: true });
    history.push('/create/daily-diary');
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
              noWrap
            >
              {lesson?.subject?.subject_name}
            </Typography>
          </Box>
          <Box mt={2}>
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
              noWrap
            >
              Daily Diary
            </Typography>
            <Divider className='divider' />
            <Typography
              className={classes.content}
              variant='p'
              component='p'
              color='secondary'
              noWrap
            >
              {lesson.teacher_report.homework}
            </Typography>
          </Box>
        </Grid>
        <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
          <DialogTitle id='draggable-dialog-title'>Delete Dairy</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete ?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={(e) => handleDelete(lesson)}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Grid item xs={4} className={classes.textRight}>
          <Box>
            <span
              className='period_card_menu'
              onClick={() => handlePeriodMenuOpen(index)}
              onMouseLeave={handlePeriodMenuClose}
            >
              {isTeacher ? (
                <IconButton
                  className='moreHorizIcon'
                  color='primary'
                  onClick={() => handlePeriodMenuOpen(index)}
                >
                  <MoreHorizIcon />
                </IconButton>
              ) : (
                ''
              )}
              {showPeriodIndex == index && showMenu ? (
                <div
                  // className='tooltip'
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>
                    <Button
                      className={classes.tooltip}
                      style={{ width: '120px' }}
                      onClick={handleDeleteOpen}
                    >
                      Delete
                    </Button>
                    <Button
                      className={classes.tooltip}
                      style={{ width: '120px' }}
                      onClick={(e) => handleEdit(lesson)}
                    >
                      {' '}
                      Edit
                    </Button>
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
              Created By -{' '}
              <p>
                {lesson.created_by.first_name} {lesson.created_at.substring(0, 10)}
              </p>
            </Typography>
          </Box>
          <div>
            <IconButton style={{ fontSize: '1rem', color: '#042955' }}>
              <SvgIcon
                component={() => (
                  <img
                    style={{ height: '21px', width: '21px', marginRight: '5px' }}
                    src={cardAttachment}
                    alt='attachment'
                  />
                )}
              />
              {lesson.documents ? lesson.documents.length : 0} Files
            </IconButton>
          </div>
        </Grid>

        <Grid item xs={6} className={classes.textRight}>
          {!periodColor && (
            <Button
              variant='contained'
              style={{ color: 'white', width: '100%' }}
              color='primary'
              size='small'
              onClick={handleViewMore}
            >
              VIEW MORE
            </Button>
          )}
          {/* } */}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DailyDairy;
