/* eslint-disable no-console */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  Button,
  Typography,
  SvgIcon,
  Dialog,
  Slide,
  IconButton,
  Popover,
  Paper,
  MenuItem,
  MenuList,
  AppBar,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import IbookPdf from './IbookPDF';
// import EditIbook from './EditIbook';
// import ConfirmDialog from '../components/confirm-dialog';
import noimg from '../../assets/images/no-img.jpg';
import unfiltered from '../../assets/images/unfiltered.svg';
import { Close } from '@material-ui/icons';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginLeft: -30,
  },
  card: {
    textAlign: 'center',
    margin: theme.spacing(1),
    backgroundPosition: 'center',
    backgroundSize: 'auto',
  },
  textEffect: {
    overflow: 'hidden',
    display: '-webkit-box',
    maxWidth: '100%',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    margin: '0%',
    padding: '0%',
    height: '65px !important',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
}));
function Transition(props) {
  return <Slide direction='up' {...props} />;
}

function GridList(props) {
  const { setAlert } = useContext(AlertNotificationContext);
  const [openPopOver, setOpenPopOver] = React.useState(false);
  const classes = useStyles();
  const { data, totalEbooks, callBack, tabValue } = props;
  const [loading, setLoading] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [editData, setEditData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [conFirmDelete, setConFirmDelete] = useState(false);
  const opnePop = Boolean(openPopOver);
  const chapterImage = 'https://erp-revamp.s3.ap-south-1.amazonaws.com/dev/ibooks/';

  const handleMenuOpen = (event, item) => {
    setOpenPopOver(event.currentTarget);
    setEditData(item);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenPopOver(false);
    }
  }

  const handleClickOpen = (data) => {
    setSelectedItem(data);
    const ebookName = data.book_name;
    const necrtUrl = data.ebook_link;
    const url = data.ebook_file_type;
    if (ebookName && ebookName.includes('NCERT')) {
      window.open(necrtUrl);
    } else {
      setPdfUrl(url && url);
      setLoading(true);
      setOpen(true);
      axiosInstance
        .get(`${endpoints.ebook.EbookUser}?ebook_id=${data.id}`)
        .then(({ data }) => {
          console.log(data);
          setLoading(false);
          setPageNumber(data.page_number);
          setTimeSpent(data.time_spent);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedItem('');
  };

  function handleClosePopOver() {
    setOpenPopOver(null);
    // setEditData({});
  }

  function handleEdit(item, index) {
    console.log(item, 'itemmmm');
    setOpenEdit(true);
    setOpenPopOver(null);
    setEditData({ item });
  }

  function handleCloseEditModel(data) {
    setOpenEdit(false);
    // setEditData({});
    if (data === 'success') {
      callBack();
    }
  }

  function handleDelete() {
    axiosInstance
      .delete(`${endpoints.ebook.ebook}?ebook_id=${editData.id}`)
      .then((result) => {
        if (result.status === 200) {
          setLoading(false);
          setAlert('success', 'SUCCESSFULLY DELETED EBOOK');
          setConFirmDelete(false);
          callBack();
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  function handleUndo() {
    axiosInstance
      .get(`${endpoints.ebook.undoEbookApi}?ebook_id=${editData.id}`)
      .then((result) => {
        if (result.status === 200) {
          setLoading(false);
          setAlert('success', 'SUCCESSFULLY UNDOED');
          setConFirmDelete(false);
          callBack();
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
  }

  function handleButton(name) {
    return (
      <Button
        size='small'
        style={{
          backgroundColor: '#F9F9F9',
          color: '#ff6b6b',
          border: '1px solid #ff6b6b',
          borderRadius: '10px',
        }}
      >
        {name}
      </Button>
    );
  }

  return (
    <div className={classes.root}>
      {console.log(data, 'data')}
      {data.length !== 0 ? (
        <Grid container spacing={2}>
          {data &&
            data.map((item, index) => {
              return (
                <Grid item md={4} xs={12} key={item.id}>
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <Card
                        style={{
                          width: '100%',
                          height: '160px',
                          borderRadius: 10,
                          padding: '5px',
                          backgroundColor: item?.ebook_type === '2' ? '#fefbe8' : '',
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item md={5} xs={6}>
                            {console.log(
                              'chapterImage',
                              `${chapterImage}${item.chapter_image}`
                            )}
                            <img
                              src={`${chapterImage}${item.chapter_image}`}
                              alt='crash'
                              width='100%'
                              height='150px'
                              style={{
                                borderRadius: '8px',
                                border: '1px solid lightgray',
                              }}
                            />
                          </Grid>
                          <Grid item md={7} xs={6} style={{ textAlign: 'left' }}>
                            <Grid container spacing={1}>
                              <Grid
                                item
                                md={12}
                                xs={12}
                                style={{
                                  padding: '0px 10px',
                                  margin: '0px',
                                  textAlign: 'right',
                                }}
                              >
                                <IconButton
                                  size='small'
                                  type='text'
                                  onClick={(event) => handleMenuOpen(event, item)}
                                  disabled={true}
                                  style={{ visibility: 'hidden' }}
                                >
                                  <MoreHorizIcon
                                    style={{
                                      fontSize: '25px',
                                      color: '#FF6B6B',
                                      fontWeight: 'bold',
                                    }}
                                  />
                                </IconButton>
                                <Popover
                                  id=''
                                  open={opnePop}
                                  anchorEl={openPopOver}
                                  onClose={handleClosePopOver}
                                  anchorOrigin={{
                                    vertical: 'center',
                                    horizontal: 'center',
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                  }}
                                >
                                  <Paper>
                                    <MenuList
                                      autoFocusItem={openPopOver}
                                      id={`menu-list-grow+${index}`}
                                      onKeyDown={handleListKeyDown}
                                    >
                                      <MenuItem
                                        onClick={() => handleEdit(item, index)}
                                        style={{
                                          display: tabValue !== 2 ? '' : 'none',
                                        }}
                                      >
                                        {handleButton('Edit Ibook')}
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          setConFirmDelete(true);
                                          setOpenPopOver(null);
                                        }}
                                        style={{
                                          display: tabValue !== 2 ? '' : 'none',
                                        }}
                                      >
                                        {handleButton('Delete Ibook')}
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          handleUndo();
                                          setOpenPopOver(null);
                                        }}
                                        style={{
                                          display: tabValue === 2 ? '' : 'none',
                                        }}
                                      >
                                        {handleButton('Undo Ebook')}
                                      </MenuItem>
                                    </MenuList>
                                  </Paper>
                                </Popover>
                              </Grid>
                              <Grid item md={12} xs={12}>
                                <Typography
                                  title='wings'
                                  className={classes.textEffect}
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#014B7E',
                                    marginTop: '-15px',
                                  }}
                                >
                                  wings
                                </Typography>
                              </Grid>
                              {/* <Grid item md={12} xs={12}>
                                <Typography
                                  title={item && item.ebook_author}
                                  className={classes.textEffect}
                                  style={{ fontSize: '10px', color: '#042955' }}
                                >
                                  Author :&nbsp;
                                  {item && item.ebook_author}
                                </Typography>
                              </Grid> */}
                              <Grid item md={12} xs={12}>
                                <Typography
                                  // title={
                                  //   item &&
                                  //   new Date(
                                  //     item?.school_mapping?.updated_at
                                  //   ).toLocaleDateString()
                                  // }
                                  // className={classes.textEffect}
                                  style={{ fontSize: '10px', color: '#042955' }}
                                >
                                  Publication on&nbsp; 23 june 2021
                                  {/* {item &&
                                    new Date(
                                      item?.school_mapping?.updated_at
                                    ).toLocaleDateString()} */}
                                </Typography>
                              </Grid>
                              <Grid item md={12} xs={12}>
                                <Button
                                  size='small'
                                  color='primary'
                                  variant='contained'
                                  style={{
                                    width: '100px',
                                    height: '25px',
                                    fontSize: '15px',
                                    borderRadius: '6px',
                                  }}
                                  onClick={() => handleClickOpen(item)}
                                >
                                  Read
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
      ) : (
        ''
      )}
      {data.length === 0 ? (
        <Grid container spacing={2}>
          <Grid item md={12} xs={12}>
            <div className={classes.periodDataUnavailable}>
              <SvgIcon component={() => <img src={unfiltered} alt='crash' />} />
              <Typography variant='h6' color='secondary'>
                NO DATA FOUND
              </Typography>
            </div>
          </Grid>
        </Grid>
      ) : (
        ''
      )}
      <Dialog
        fullScreen
        open={open}
        // onClose={handleClose}
        style={{ zIndex: '10000' }}
        TransitionComponent={Transition}
      >
        {/* <Grid>
          <IbookPdf
            pageNumber={pageNumber}
            timeStore={timeSpent}
            id={selectedItem?.id}
            url={`${pdfUrl && pdfUrl}`}
            passLoad={loading}
            goBackFunction={handleClose}
            name={selectedItem?.ebook_name}
          />
        </Grid> */}
        <Grid container>
          <Grid item sm={12}>
            <AppBar>
              <div className={classes.root}>
                <Grid container spacing={2}>
                  <Grid item xs={4} sm={4} md={4} style={{ paddingLeft: 30 }}>
                    <IconButton
                      color='inherit'
                      aria-label='Close'
                      style={{ color: 'white' }}
                    >
                      <Close onClick={handleClose} /> &nbsp;{' '}
                      <span onClick={handleClose} style={{ fontSize: '17px' }}>
                        Close
                      </span>
                    </IconButton>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <div className='subject-name'>
                      <h2 style={{ 'text-transform': 'capitalize' }}>{props.name}</h2>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </AppBar>

            <iframe
              // src={`http://35.154.221.179:3000/1602923626_13_13_82/index.html#/reader/chapter/11`}
              src={`https://photography.kotobee.com/#/reader`}
              id='bookReader'
              className='bookReader'
              style={{ width: '100%', height: '625px', margin: 'auto', paddingTop: 50 }}
              title='Tutorials'
            ></iframe>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}

export default withRouter(GridList);
