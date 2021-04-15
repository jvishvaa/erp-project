/* eslint-disable no-console */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  Button,
  Typography,
  // Divider,
  SvgIcon,
  Dialog,
  Slide,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
// import IconButton from '@material-ui/core/IconButton';
// import Face from '@material-ui/icons/Face';
// import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
// import moment from 'moment';
// import axios from '../../config/axios';

import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
// import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import EbookPdf from './EbookPDF';

import unfiltered from '../../assets/images/unfiltered.svg';

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
    '-webkit-line-clamp': '2',
    '-webkit-box-orient': 'vertical',
    textOverflow: 'ellipsis',
    margin: '0%',
    padding: '0%',
    height: '25px !important',
  },
}));
function Transition(props) {
  return <Slide direction='up' {...props} />;
}

function GridList(props) {
  const classes = useStyles();
  const { data, totalEbooks } = props;
  // const { tabValue } = props.tabValue;
  // const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  // const themeContext = useTheme();
  // const canvasRef = useRef(null);
  // const [data, setData] = useState([])
  // const [loading, setLoading] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  // const [ebookNum, setEbookNum] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  // const [click, setClick] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  // const classes = useStyles()

  const handleClickOpen = (data) => {
    setSelectedItem(data);
    const ebookName = data.ebook_name;
    const necrtUrl = data.ebook_link;
    const url = data.ebook_file_type;
    if (ebookName && ebookName.includes('NCERT')) {
      window.open(necrtUrl);
    } else {
      setPdfUrl(url && url);
      setLoading(true);
      // setEbookNum(data.id);
      setOpen(true);
      // setClick(true);
      axiosInstance
        .get(
          `${endpoints.ebook.EbookUser}?ebook_id=${data.id}`
          // , {
          // headers: {
          //   Authorization: 'Bearer ' + props.user
          // }
          // }
        )
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

  return (
    <div className={classes.root}>
      {data.length !== 0 ? (
        <Grid container spacing={2}>
          {data &&
            data.map((item) => (
              <Grid item md={3} xs={12} key={item.id}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12}>
                  <Card
                      style={{
                        width: '100%',
                        height: '160px',
                        borderRadius: 10,
                        padding: '5px',
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item md={6} xs={6}>
                          <img
                            src={item && item.ebook_thumbnail}
                            alt='crash'
                            width='100%'
                            height='150px'
                            style={{ borderRadius: '8px', border: '1px solid lightgray' }}
                          />
                        </Grid>
                        <Grid item md={6} xs={6} style={{ textAlign: 'left' }}>
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
                              <MoreHorizIcon
                                style={{
                                  fontSize: '25px',
                                  color: '#FF6B6B',
                                  fontWeight: 'bold',
                                }}
                              />
                            </Grid>
                            <Grid item md={12} xs={12}>
                              <Typography
                                title={item && item.ebook_name}
                                className={classes.textEffect}
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color: '#014B7E',
                                  marginTop: '-15px',
                                }}
                              >
                                {item && item.ebook_name}
                              </Typography>
                            </Grid>
                            <Grid item md={12} xs={12}>
                              <Typography
                                title={item && item.ebook_author}
                                className={classes.textEffect}
                                style={{ fontSize: '10px', color: '#042955' }}
                              >
                                Author :&nbsp;
                                {item && item.ebook_author}
                              </Typography>
                            </Grid>
                            <Grid item md={12} xs={12}>
                              <Typography
                                title={
                                  item &&
                                  item.updated_at &&
                                  new Date(item.updated_at).toLocaleDateString()
                                }
                                className={classes.textEffect}
                                style={{ fontSize: '10px', color: '#042955' }}
                              >
                                Publication on&nbsp;
                                {item &&
                                  item.updated_at &&
                                  new Date(item.updated_at).toLocaleDateString()}
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
                                  color:'white',
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
                    {/* <Card
                      className={classes.card}
                      style={{
                        width: '100%',
                        height: '160px',
                        backgroundSize: '100px 120px',
                        backgroundImage: `url(${item && item.ebook_thumbnail})`,
                        display: data.length >= 1 ? 'flex' : 'none',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: 10,
                        backgroundPositionX: '15px',
                      }}
                    >
                      <CardHeader
                        subheader={
                          <Typography
                            variant='body2'
                            align='right'
                            component='p'
                            style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              marginRight: '48px',
                              color: '#014b7e',
                            }}
                          >
                            {item && item.ebook_name}
                          </Typography>
                        }
                      />
                      <CardActionArea>
                        <CardContent style={{ padding: '5px' }}>
                          <Typography
                            style={{
                              marginTop: '-35px',
                              marginLeft: '130px',
                              fontSize: '12px',
                            }}
                            color='textSecondary'
                            component='p'
                          >
                            {item && item.ebook_author}
                          </Typography>
                          <Button
                            size='small'
                            color='primary'
                            variant='contained'
                            style={{
                              width: '100px',
                              float: 'right',
                              marginTop: '15px',
                              height: '30px',
                              marginBottom: '10px',
                              marginRight: '20px',
                              color: 'white',
                            }}
                            onClick={() => handleClickOpen(item)}
                          >
                            Read
                          </Button>
                        </CardContent>
                      </CardActionArea>
                    </Card> */}
                  </Grid>
                </Grid>
              </Grid>
            ))}
        </Grid>
      ) : (
        ''
      )}
      {data.length === 0 || totalEbooks === 0 ? (
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
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <Grid>
          <EbookPdf
            pageNumber={pageNumber}
            timeStore={timeSpent}
            id={selectedItem?.id}
            url={`${pdfUrl && pdfUrl}`}
            passLoad={loading}
            goBackFunction={handleClose}
            name={selectedItem?.ebook_name}
          />
        </Grid>
      </Dialog>
    </div>
  );
}

export default withRouter(GridList);
