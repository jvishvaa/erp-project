import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  Dialog,
  CardContent,
  CardMedia,
  CardActions,
  Card,
  Typography,
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ReactHtmlParser from 'react-html-parser';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import Vedio from '../components/VideoModule/videoViewer';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import { connect, useSelector } from 'react-redux';
import { Divider, TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import endpoints from 'config/endpoints';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from 'axios';
import FileSaver from 'file-saver';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { Link, useHistory } from 'react-router-dom';
import axiosInstance from '../../../config/axios';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
function MyNotes() {
  const { setAlert } = useContext(AlertNotificationContext);
  const [totalGenre, setTotalGenre] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [moduleId, setModuleId] = useState('');
  const limit = 8;
  const [data, setData] = useState([]);
  const [updatedDate, setUpdatedDate] = useState([]);
  const [totalViewsCount, setTotalViewsCount] = useState([]);
  const useStyles = makeStyles((theme) => ({
    root: theme.commonTableRoot,
    paperStyled: {
      minHeight: '80vh',
      height: '100%',
      padding: '50px',
      marginTop: '15px',
    },
    guidelinesText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: theme.palette.secondary.main,
    },
    errorText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fe6b6b',
      marginBottom: '30px',
      display: 'inline-block',
    },
    cards: {
      minWidth: 275,
    },
    table: {
      minWidth: 650,
    },
    downloadExcel: {
      float: 'right',
      fontSize: '16px',
    },
    columnHeader: {
      color: `${theme.palette.secondary.main} !important`,
      fontWeight: 600,
      fontSize: '1rem',
      backgroundColor: `#ffffff !important`,
    },
    tableCell: {
      color: theme.palette.secondary.main,
    },
    tablePaginationSpacer: {
      flex: 0,
    },
    tablePaginationToolbar: {
      justifyContent: 'center',
    },
    cardsContainer: {
      width: '95%',
      margin: '0 auto',
    },
    tablePaginationCaption: {
      fontWeight: '600 !important',
    },
    tablePaginationSpacer: {
      flex: 0,
    },
    tablePaginationToolbar: {
      justifyContent: 'center',
    },
    guidelineval: {
      color: theme.palette.primary.main,
      fontWeight: '600',
    },
    guideline: {
      color: theme.palette.secondary.main,
      fontSize: '16px',
      padding: '10px',
    },
  }));
  const classes = useStyles({});
  const history = useHistory();
  const handleBack = () => {
    history.push('/subjectTrain');
  };
  function downloadFunction() {
    // eslint-disable-next-line no-alert
    window.alert('Download Feature will be enabled at next release');
  }
  const handleViewMore = (id) => {
    history.push('/tressureVedios');
    sessionStorage.setItem('tressureBoxid', id);
  };
  // const limit = 8;
  const getCardColor = (index) => {
    const colors = [
      '#54688c',
      '#f47a62',
      '#4a66da',
      '#75cba8',
      // "#f2bf5e"
    ];
    const diffColors = index % 4;
    return colors[diffColors];
  };

  const [open, setOpen] = React.useState(false);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  console.log(moduleData, 'module');
  const handlePagination = (event, page) => {
    setPageNumber(page);
  };
  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        console.log(item.module, 'module Ids');
        if (item.module_name === 'Learning_Notes') {
          setModuleId(item.module);
        }
      });
    }
  }, []);
  useEffect(() => {
    console.log(udaanToken, moduleId, 'token');
    if (udaanToken && moduleId) {
      axios
        .get(endpoints.sureLearning.MyNotes + `?page_size=${limit}&page=${pageNumber}`, {
          headers: {
            Authorization: `Bearer ${udaanToken}`,
            module: moduleId,
          },
        })
        .then((res) => {
          console.log(res.data.results, 'pagination');
          setTotalGenre(res.data.total_pages);
          setData(res.data.results);
        })
        .catch((error) => {
          setAlert('error', 'Something Wrong!');
        });
    }
  }, [moduleId, pageNumber]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = (item) => {
    let vedio = item.learning_module.video;
    let text = item.learning_module.text;
    console.log('item', vedio);
    console.log('item', text);
    sessionStorage.setItem('itemVedio', vedio);
    sessionStorage.setItem('itemText', text);
    setUpdatedDate(item);
    setOpen(true);
  };
  const DialogTitle = withStyles(useStyles)((props) => {
    //   console.log(props.DialogTitle,'propsp');
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disablTypography className={classes.root} {...other}>
        <Grid container direction='row'>
          <Grid item md={7}>
            <strong>{props.DialogTitle}</strong>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={1}>
            {onClose ? (
              <IconButton
                aria-label='close'
                // className={classes.closeButton}
                onClick={props.handleClose}
              >
                <CloseIcon style={{ padding: '-500px' }} />
              </IconButton>
            ) : null}
          </Grid>
        </Grid>
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(1),
    },
  }))(MuiDialogContent);

  return (
    <Layout>
      <div>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='My Notes'
          isAcademicYearVisible={true}
        />
        <Grid container direction='row' style={{ paddingTop: '20px' }}>
          {data.map((item, index) => {
            const text = item.learning_module.text;
            const vedio = item.learning_module.video;
            console.log(text, 'ttt');
            return (
              <Grid item xs={12} sm={6} md={3}>
                <Grid
                  item
                  md={12}
                  xs={12}
                  style={{ margin: '10px 10px', height: '100%' }}
                >
                  <Card
                    sx={{ maxWidth: 345 }}
                    style={{ backgroundColor: getCardColor(index) }}
                  >
                    <CardMedia
                      style={{ height: 140, width: '100%', backgroundColor: 'white' }}
                    >
                      <video
                        id='background-video'
                        controls
                        controlsList='nodownload'
                        alt='video file is crashed'
                        height='100%'
                        width='100%'
                        className={classes.video}
                      >
                        <source src={`${endpoints.s3UDAAN_BUCKET}${item.learning_module.video.substring(31)}`} type='video/mp4' />
                        <track
                          src={`${endpoints.s3UDAAN_BUCKET}${item.learning_module.video.substring(31)}`}
                          kind='captions'
                          srcLang='en'
                          label='english_captions'
                        />
                      </video>
                    </CardMedia>
                    <CardContent justify='center' style={{ padding: '20px' }}>
                      <Typography style={{ color: 'white' }}>
                        <strong>{item.learning_module.title}</strong>
                      </Typography>
                    </CardContent>
                    <CardActions style={{ justify: 'center', paddingBottom: '20px' }}>
                      <Grid item md={6} xs={12}>
                        <Typography
                          onClick={() => handleClickOpen(item)}
                          color='primary'
                          style={{
                            fontWeight: 'bold',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          <VisibilityIcon style={{ fontSize: '18px', color: 'white' }} />{' '}
                          Notes
                        </Typography>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Typography
                          onClick={() => downloadFunction()}
                          color='primary'
                          style={{
                            fontWeight: 'bold',
                            color: 'white',

                            cursor: 'pointer',
                          }}
                        >
                          <CloudDownloadIcon
                            style={{ fontSize: '18px', color: 'white' }}
                          />
                          Download
                        </Typography>
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
                <Dialog
                  onClose={handleClose}
                  aria-labelledby='customized-dialog-title'
                  open={open}
                  style={{ height: '90%', marginTop: '65px' }}
                  fullWidth
                  maxWidth='md'
                >
                  <DialogTitle
                    DialogTitle={updatedDate?.learning_module?.title}
                    id='customized-dialog-title'
                    onClose={handleClose}
                    handleClose={handleClose}
                  ></DialogTitle>
                  <DialogContent dividers>
                    {updatedDate.notes &&
                      updatedDate.notes.length !== 0 &&
                      updatedDate.notes.map((noteItem) => {
                        console.log(noteItem[index], 'iii');
                        const Newdate = new Date(
                          noteItem.updated_at && noteItem.updated_at
                        );
                        return (
                          <div>
                            <Accordion>
                              <AccordionSummary
                                key={index}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                              >
                                {' '}
                                <Grid container>
                                  <Grid item md={10} xs={6} style={{ marginTop: '15px' }}>
                                    <Typography>
                                      Updated Date &nbsp;{' '}
                                      <b style={{ marginTop: '5px' }}>
                                        {(noteItem.updated_at &&
                                          noteItem.updated_at &&
                                          Newdate.toString().split('G')[0]) ||
                                          ''}
                                      </b>
                                    </Typography>
                                  </Grid>
                                  <Grid item md={2} xs={6}>
                                    {/* //  href={`${urls.downloadNotesApi}?notes_id=${item.id}`} */}
                                    <Button
                                      variant='contained'
                                      color='primary'
                                      startIcon={<CloudDownloadIcon />}
                                      onClick={() => downloadFunction()}
                                    >
                                      Download
                                    </Button>
                                    {/* <Button
                                      variant='outlined'
                                      //   color="primary"
                                      style={{ fontSize: '18px', color: 'white' }}
                                      onClick={() => downloadFunction()}
                                    >
                                      Download&nbsp;
                                      <CloudDownloadIcon
                                        style={{ fontSize: '18px', color: 'white' }}
                                      />
                                    </Button> */}
                                  </Grid>
                                </Grid>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography>{ReactHtmlParser(noteItem.notes)}</Typography>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        );
                      })}
                    <Grid container>
                      <Grid
                        item
                        md={7}
                        sm={7}
                        xs={12}
                        style={{ border: '1px solid lightgray' }}
                      > don
                        <video
                          src={sessionStorage.getItem('itemVedio')}
                          width='100%'
                          height='400'
                          controls
                          controlsList='nodownload'
                        >
                          <source
                            src={sessionStorage.getItem('itemVedio')}
                            type='video/mp4'
                            height='300'
                            width='100%'
                          />
                          <track
                            src={sessionStorage.getItem('itemVedio')}
                            kind='captions'
                            srcLang='en'
                            label='english_captions'
                          />
                        </video>
                      </Grid>
                      <Grid
                        item
                        md={5}
                        sm={5}
                        xs={12}
                        style={{ border: '1px solid lightgray' }}
                      >
                        <Paper
                          className={classes.textBox}
                          style={{ width: '100%', height: '100%', padding: '10px' }}
                        >
                          <Typography variant='h5'>About Video :</Typography>
                          <Divider className={classes.divider} />
                          &nbsp;&nbsp;{' '}
                          <b>{ReactHtmlParser(sessionStorage.getItem('itemText'))}</b>
                        </Paper>
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Dialog>
              </Grid>
            );
          })}
          <Grid container justify='center'>
            {/* {pageNumber > 1 && ( */}
            <Pagination
              onChange={handlePagination}
              count={totalGenre}
              color='primary'
              page={pageNumber}
            />
            {/* )} */}
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}

export default MyNotes;
