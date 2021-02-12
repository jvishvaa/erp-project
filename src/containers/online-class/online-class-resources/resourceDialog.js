import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import { Button, Typography, Grid } from '@material-ui/core';
import moment from 'moment';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
    root: {
        borderRadius: '10px',
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
    resourceClassDiv: {
        maxHeight: '350px',
        textAlign: 'center',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
});

const StyledButton = withStyles({
    root: {
        borderRadius: '10px',
    }
})(Button);

const Resource = (props) => {
    const classes = useStyles({});
    const [ isDownload, setIsDownload ] = React.useState();
    const [ isDown, setIsDown] = React.useState(0);

    React.useEffect(() => {
        axiosInstance.get(`${endpoints.onlineClass.resourceFile}?online_class_id=${props.resourceId}&class_date=${moment(props.date).format('DD-MM-YYYY')}`)
        .then((res) => {
            setIsDownload(res.data.result);
            setIsDown(res.data.status_code);
        })
        .catch((error) => console.log(error))
    },[props.date]);

    return (
        <Grid container style={{padding: '10px 20px'}}>
            <Grid item xs={6}>
                <Typography className={classes.date}>{moment(props.date).format('DD-MM-YYYY')}</Typography>
            </Grid>
            <Grid item xs={6} className={classes.resourceClassDiv}>
                {isDown === 200 ? (
                    <StyledButton
                        color="primary"
                        href={`${endpoints.s3}/${isDownload ? isDownload[0]?.files[0] : ''}`}
                    >
                        Download
                    </StyledButton>
                ) : (
                    <Typography className={classes.resourceText}>Resource NOT Available</Typography>
                )}
            </Grid>
        </Grid>
    )
}

export default function ResourceDialogComponent(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  console.log(props.startDate +" === "+ props.endDate);

  //Periods date start
  const startDate = new Date(props.startDate);
  const endDate = new Date(props.endDate);
  const Difference_In_Time = endDate.getTime() - startDate.getTime();
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log(Difference_In_Days);
  let periods;
  if(moment(startDate).format('ll') === moment(endDate).format('ll')) {
      periods = 0;
  }
  else {
      periods = Math.floor(Difference_In_Days + 1);
  }
  //console.log(startDate.setDate(startDate.getDate() + 1));

  let dateArray = [];
  for(var i = 0; i <= periods; i++){
      let day;
      if(i === 0) {
          day = startDate.setDate(startDate.getDate());
      }
      else {
          day = startDate.setDate(startDate.getDate() + 1);
      }
      dateArray.push(day);
      //console.log(moment(day).format('ll'));
  }
  ////Periods date end

  const handleClose = () => {
    onClose(selectedValue);
  };


  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} className={classes.root}>
        <div className={classes.header}>
            <Typography className={classes.headerTitle}>{props.title}</Typography>
            <CloseIcon onClick={handleClose} style={{float: 'right'}}/>
        </div>
        <div >
            {dateArray.length > 0 && dateArray.map((date) => <Resource date={date} resourceId={props.resourceId}/>)}
        </div>
    </Dialog>
  );
}

ResourceDialogComponent.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export const ResourceDialog = React.memo(ResourceDialogComponent);