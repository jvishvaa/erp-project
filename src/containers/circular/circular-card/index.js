import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, useTheme, IconButton } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Box from '@material-ui/core/Box';
import useStyles from './useStyles';
import './circular-card.css'
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Context } from '../context/CircularStore'
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import cardAttachment from '../../../assets/images/cardAttachment.svg'
import { SvgIcon, Divider } from '@material-ui/core';
const CircularCard = ({ lesson, period, setPeriodDataForView, setViewMoreData, setViewMore, setLoading, index, periodColor, setPeriodColor, setSelectedIndex, setEditData, deleteFlag, setDeleteFlag }) => {

  const themeContext = useTheme();
  const { setAlert } = useContext(AlertNotificationContext);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();

  const [showMenu, setShowMenu] = useState(false);
  const [showPeriodIndex, setShowPeriodIndex] = useState();
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  //context
  const [state, setState] = useContext(Context)
  const history = useHistory()

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setDeleteIndex(null);
    setDeleteAlert(false);
  };
  const handleDeleteConfirm = async () => {

    try {

      const statusChange = await axiosInstance.put(`${endpoints.circular.deleteCircular}`,
        {
          'circular_id': deleteId,
          'id_delete': true

        })


      if (statusChange.status === 200) {

        setAlert('success', statusChange.data.message)
        setDeleteAlert(false);

        setDeleteFlag(!deleteFlag)

      }
      else {
        console.log('error', statusChange.data.message);
      }
    }

    catch (error) {
      console.log('error', error.message);
    }
  }


  const handleDelete = (e) => {
    setDeleteId(e.id);
    setDeleteIndex(e);
    setDeleteAlert(true);
  };



  const handlePeriodMenuOpen = (index, id) => {
    setShowMenu(true);
    setShowPeriodIndex(index);
  };

  const handlePeriodMenuClose = (index) => {
    setShowMenu(false);
    setShowPeriodIndex();
  };

  const handleViewMore = () => {
    setLoading(true)
    axiosInstance.get(`${endpoints.circular.viewMoreCircularData}?circular_id=${period.id}`)
      .then(result => {
        if (result.data.status_code === 200) {
          setLoading(false);
          setViewMore(true);
          setViewMoreData(result?.data?.result);
          setPeriodDataForView(lesson);
          setSelectedIndex(index);
          setPeriodColor(true);
        } else {
          setLoading(false);
          setViewMore(false);
          setViewMoreData({});
          setAlert('error', result?.data?.message);
          setPeriodDataForView();
          setSelectedIndex(-1);
          setPeriodColor(true);
        }
      })
      .catch((error) => {
        setViewMore(false);
        setViewMoreData({});
        setAlert('error', error.message);
        setPeriodDataForView();
        setSelectedIndex(-1);
        setPeriodColor(true);
      })
  }

  // const handleDelete=(e,index)=>{
  //   // console.log(e,index,'event')
  //   axiosInstance.put(`${endpoints.circular.deleteCircular}`,
  //   {
  //    'circular_id': e.id,
  //    'id_delete':true

  //   }).then((result)=>{

  //     if(result.data.status_code===200){
  //       setAlert('success',result.data.message)
  //       setDeleteFlag(!deleteFlag)
  //     }else{
  //       setAlert('errpr', 'ERROR!')
  //     }

  //   })


  // }
  const handleEdit = (data) => {
    setState({ editData: data, isEdit: true });
    history.push(`/create-circular/${data?.id}`)
  }

  return (
    <Paper className={periodColor ? classes.selectedRoot : classes.root} style={isMobile ? { margin: '0rem auto' } : { margin: '0rem auto -1.1rem auto' }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='primary'
            >
              <strong>{period?.circular_name}</strong>
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
              Circular
            </Typography>
            <Divider className='divider' />
          </Box>
        </Grid>

        <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
          <DialogTitle
            id='draggable-dialog-title'
          >
            Delete Circular
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this circular ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleDeleteConfirm}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        {window.location.pathname === '/teacher-circular' && <Grid item xs={4} className={classes.textRight}>
          <Box>
            <span
              className='period_card_menu'
              onClick={() => handlePeriodMenuOpen(index)}
              onMouseLeave={handlePeriodMenuClose}
            >
              <IconButton
                className="moreHorizIcon"
                color='primary'
              >
                <MoreHorizIcon />
              </IconButton>
              {(showPeriodIndex === index &&
                showMenu) ? (
                <div className="tooltip" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className={` ${classes.tooltiptext} tooltiptext`} style={{ width: "150px" }}>
                    <Button className={classes.tooltip} onClick={e => handleDelete(period)}>Delete</Button>
                    <Button className={classes.tooltip} onClick={e => handleEdit(period)}> Edit</Button>
                  </span>
                </div>
              ) : null}
            </span>
          </Box>
        </Grid>}
        <Grid item xs={12} sm={12} />
        <Grid item xs={6}>
          <Box>
            <Typography
              className={classes.title}
              variant='p'
              component='p'
              color='secondary'
            >
              Created By - {period?.uploaded_by?.first_name}
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
                )} />
              {period.media ? period.media.length : 0} Files
            </IconButton>
          </div>
        </Grid>
        <Grid item xs={6} className={classes.textRight}>
          {!periodColor &&
            <Button
              variant='contained'
              style={{ color: 'white', width: '100%' }}
              color="primary"
              size='small'
              onClick={handleViewMore}
            >
              VIEW MORE
            </Button>}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CircularCard;
