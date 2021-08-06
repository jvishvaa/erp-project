import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Button, Typography, Grid } from '@material-ui/core';
import moment from 'moment';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CloseIcon from '@material-ui/icons/Close';
import CardContent from '@material-ui/core/CardContent';
import APIREQUEST from "../../../config/apiRequest";

const useStyles = makeStyles({
  root: {
    top: '50px',
    borderRadius: '10px',
    border: '1px solid #F9D474',
  },
  header: {
    padding: '20px',
    backgroundColor: '#F9D474',
    width: '400px',
  },
  headerTitle: {
    display: 'inline-block',
    color: '',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  closeDetailCard: {
    float: 'right',
    fontSize: '20px',
    color: '#014B7E',
  },
  joinClassDiv: {
    height: '400px',
    overflowY: 'scroll',
  },
  date: {
    display: 'inline-block',
    fontSize: '18px',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
  },
  resourceText: {
    color: '#ff6b6b',
    fontSize: '18px',
  },
  resourceClassDiv: {},
});

const StyledButton = withStyles({
  root: {
    borderRadius: '10px',
  },
})(Button);

const Resource = (props) => {
  const classes = useStyles({});
  const [isDownload, setIsDownload] = React.useState();
  const [isDown, setIsDown] = React.useState(0);
  const [hideButton, setHideButton] = React.useState(false);

  const msApiOnclsResource = ()=>{
    APIREQUEST("get", `/oncls/v1/oncls-resources/?online_class_id=${props.onlineClassId}&class_date=${moment(props.date).format('DD-MM-YYYY')}`)
    .then((res)=>{
      if (res.data.result.length > 0) {
        res.data.result.map((path) => {
          if (path.files !== null) {
            setHideButton(true);
          }
        });
      }
      setIsDownload(res.data.result);
      setIsDown(res.data.status_code);
    })
    .catch((error) => console.log(error));
  }

  React.useEffect(() => {
    setHideButton(false);
    if(JSON.parse(localStorage.getItem('isMsAPI'))){
      msApiOnclsResource();
      return;
    }
    axiosInstance
      .get(
        `${endpoints.onlineClass.resourceFile}?online_class_id=${
          props.onlineClassId
        }&class_date=${moment(props.date).format('DD-MM-YYYY')}`
      )
      .then((res) => {
        if (res.data.result.length > 0) {
          res.data.result.map((path) => {
            if (path.files !== null) {
              setHideButton(true);
            }
          });
        }
        setIsDownload(res.data.result);
        setIsDown(res.data.status_code);
      })
      .catch((error) => console.log(error));
  }, [props.date]);

  const handleDownload = (e) => {
    e.preventDefault();
    e.preventDefault();
    const download = (path) => {
      window.open(path, '_blank');
    };
    const downloadFilePath = (files) => {
      files.map((file) => download(`${endpoints.discussionForum.s3}/${file}`));
    };
    isDownload && isDownload.map((path) => downloadFilePath(path.files));
  };

  return (
    <Grid container style={{ padding: '10px 20px' }}>
      <Grid item xs={6}>
        <Typography className={classes.date}>
          {moment(props.date).format('DD-MM-YYYY')}
        </Typography>
      </Grid>
      <Grid item xs={6} className={classes.resourceClassDiv}>
        {hideButton && isDown === 200 ? (
          <StyledButton color='primary' onClick={handleDownload}>
            Download
          </StyledButton>
        ) : (
          <Typography className={classes.resourceText}>Not Available</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default function ResourceDialogComponent(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;
  const [periodsData, setPeriodsData] = React.useState([]);
  const startDate = new Date(props.startDate);
  const endDate = new Date(props.endDate);
  const Difference_In_Time = endDate.getTime() - startDate.getTime();
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  let periods;
  if (moment(startDate).format('ll') === moment(endDate).format('ll')) {
    periods = 0;
  } else {
    periods = Math.floor(Difference_In_Days + 1);
  }

  let dateArray = [];
  for (var i = 0; i <= periods; i++) {
    let day;
    if (i === 0) {
      day = startDate.setDate(startDate.getDate());
    } else {
      day = startDate.setDate(startDate.getDate() + 1);
    }
    dateArray.push(day);
  }
  const handleClose = () => {
    onClose(selectedValue);
  };
  
  const msApiStudentOnclsDetails = ()=>{
    APIREQUEST("get", `/oncls/v1/${props.resourceId}/student-oncls-details/`)
    .then((res)=>{
      setPeriodsData(res.data.data);
    })
    .catch((error) => console.log(error));
  }

  React.useEffect(() => {
    if(JSON.parse(localStorage.getItem('isMsAPI'))){
      msApiStudentOnclsDetails();
      return;
    }
    axiosInstance
      .get(`erp_user/${props.resourceId}/student-oc-details/`)
      .then((res) => {
        setPeriodsData(res.data.data);
      })
      .catch((error) => console.log(error));
  }, [props.resourceId]);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='simple-dialog-title'
      open={open}
      className={classes.root}
    >
      <CardContent className={classes.header}>
        <Typography className={classes.headerTitle}>{props.title}</Typography>
        <CloseIcon onClick={handleClose} className={classes.closeDetailCard} />
      </CardContent>
      <CardContent className={classes.joinClassDiv}>
        {periodsData &&
          periodsData.length > 0 &&
          periodsData.map((data) => (
            <Resource date={data.date} onlineClassId={props.onlineClassId} />
          ))}
      </CardContent>
    </Dialog>
  );
}

ResourceDialogComponent.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export const ResourceDialog = React.memo(ResourceDialogComponent);
