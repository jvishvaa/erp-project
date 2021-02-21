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
        //'&::-webkit-scrollbar': {
            // display: 'none',
         //},
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
        //maxHeight: '350px',
        //textAlign: 'center',
        //overflowY: 'scroll',
        //'&::-webkit-scrollbar': {
           // display: 'none',
        //},
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
    const [ hideButton, setHideButton ] = React.useState(false);

    React.useEffect(() => {
        setHideButton(false);
        axiosInstance.get(`${endpoints.onlineClass.resourceFile}?online_class_id=${props.onlineClassId}&class_date=${moment(props.date).format('DD-MM-YYYY')}`)
        .then((res) => {
            if(res.data.result.length > 0) {
                res.data.result.map((path) => {
                    if(path.files !== null) {
                        setHideButton(true);
                    }
                })
            }
            setIsDownload(res.data.result);
            setIsDown(res.data.status_code);
        })
        .catch((error) => console.log(error))
    },[props.date]);

    const handleDownload = (e) => {
        e.preventDefault();
        e.preventDefault();
        const download = (path) => {
            //console.log(path);
             //window.location.href=path;
            window.open(path, '_blank');
        }
        const downloadFilePath = (files) => {
            files.map((file) => download(`${endpoints.s3}/${file}`));
        }
        isDownload && isDownload.map((path) => downloadFilePath(path.files));
        /**
        isDownload && isDownload.map((path) => {
            path.files && path.files.map((file, i) => window.location.href=(`${endpoints.s3}/${file}`))
            //window.location.href=(`${endpoints.s3}/${path?.files[0]}`
        })
         */
    }

    return (
        <Grid container style={{padding: '10px 20px'}}>
            <Grid item xs={6}>
                <Typography className={classes.date}>{moment(props.date).format('DD-MM-YYYY')}</Typography>
            </Grid>
            <Grid item xs={6} className={classes.resourceClassDiv}>
                {hideButton && isDown === 200 ? (
                    <StyledButton
                        color="primary"
                        //href={`${endpoints.s3}/${isDownload ? isDownload[0]?.files[0] : ''}`}
                        onClick={handleDownload}
                    >
                        Download
                    </StyledButton>
                ) : (
                    <Typography className={classes.resourceText}>Not Available</Typography>
                )}
            </Grid>
        </Grid>
    )
}

export default function ResourceDialogComponent(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open } = props;
    const [ periodsData, setPeriodsData ] = React.useState([]);

    //Periods date start
    const startDate = new Date(props.startDate);
    const endDate = new Date(props.endDate);
    const Difference_In_Time = endDate.getTime() - startDate.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    let periods;
    if(moment(startDate).format('ll') === moment(endDate).format('ll')) {
        periods = 0;
    }
    else {
        periods = Math.floor(Difference_In_Days + 1);
    }

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
    }
    ////Periods date end

    const handleClose = () => {
        onClose(selectedValue);
    };
    React.useEffect(() => {
        axiosInstance.get(`erp_user/${props.resourceId}/student-oc-details/`)
        .then((res) => {
            console.log(res);
            setPeriodsData(res.data.data);
        })
        .catch((error) => console.log(error))
    },[props.resourceId]);


    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} className={classes.root}>
            <div className={classes.header}>
                <Typography className={classes.headerTitle}>{props.title}</Typography>
                <CloseIcon onClick={handleClose} className={classes.closeDetailCard}/>
            </div>
            <div className={classes.joinClassDiv}>
                {periodsData && periodsData.length > 0 && periodsData.map((data) => <Resource date={data.date} onlineClassId={props.onlineClassId}/>)}
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