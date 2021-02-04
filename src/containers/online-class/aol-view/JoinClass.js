import React from 'react';
import moment from 'moment';
import { makeStyles, withStyles, Typography, Button } from '@material-ui/core';
import axiosInstance from '../../../config/axios';

const useStyles = makeStyles({
    classDetailsDescription: {
        display: 'inline-block',
        height: '50px',
        color: '#014B7E',
        fontSize: '16px',
        fontFamily: 'Poppins',
        lineHeight: '25px',
        overflow: 'hidden',
    },
    buttonDiv: {
        display: 'inline-block',
        float: 'right',
    },
    rejectText: {
        color: 'red',
        fontSize: '16px',
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        lineHeight: '25px',
        display: 'inline-block',
        float: 'right',
        marginRight: '30px',
    }
})

const StyledJoinButton = withStyles({
    root: {
        height: '26px',
        width: '112px',
        fontSize: '15px',
        fontFamily: 'Open Sans',
        color: '#FFFFFF',
        backgroundColor: '#344ADE',
        borderRadius: '5px',
        float: 'right',
    }
})(Button);

const StyledRejectButton = withStyles({
    root: {
        height: '26px',
        width: '60px',
        padding: '0',
        fontSize: '10px',
        fontFamily: 'Open Sans',
        color: '#FFFFFF',
        backgroundColor: '#FFAF71',
        borderRadius: '5px',
        letterSpacing: 0,
        marginLeft: '5px',
    }
})(Button);

const StyledAcceptButton = withStyles({
    root: {
        height: '26px',
        width: '60px',
        padding: '0',
        fontSize: '10px',
        fontFamily: 'Open Sans',
        color: '#FFFFFF',
        backgroundColor: '#344ADE',
        borderRadius: '5px',
        letterSpacing: 0,
    }
})(Button);

export default function JoinClassComponent(props) {
    const classes = useStyles({});
    const [ isAccepted, setIsAccept ] = React.useState(false);
    const [ isRejected, setIsRejected ] = React.useState(false);
    const [ isCancel, setIsCancel] = React.useState(false);

    //console.log(props.data.is_cancelled + " ==="+ isCancel );
    const params ={
        zoom_meeting_id: props.data.zoom_id,
        class_date: props.data.date
    }
    const handleCancel = () => {
        axiosInstance.put('erp_user/cancel-online-class/',params)
        .then((res) => {
            console.log(res);
            setIsCancel(true);
        })
        .catch((error) => console.log(error))
    }

    return (
        <div>
            <Typography className={classes.classDetailsDescription}>
                {props.data.date}
            </Typography>
            {!isAccepted && isRejected && (
                <Typography className={classes.rejectText}>Rejected</Typography>
            )}
            {props.isTeacher &&( isCancel || props.data.is_cancelled )&& (
                <Typography className={classes.rejectText}>Canceled</Typography>
            )}
            {(isAccepted  && !props.isTeacher)&& !isRejected && (
                <StyledJoinButton
                    variant="contained"
                    color="secondary"
                    href={props.joinUrl}
                >
                    Join
                </StyledJoinButton>
            )}
            {(!isAccepted && !props.isTeacher) && !isRejected && (
                <div className={classes.buttonDiv}>
                    <StyledAcceptButton
                        variant="contained"
                        color="secondary"
                        onClick={(e) => setIsAccept(true)}
                    >
                        Accept
                    </StyledAcceptButton>
                    <StyledRejectButton
                        variant="contained"
                        color="primary"
                        onClick={(e) => setIsRejected(true)}
                    >
                        Reject
                    </StyledRejectButton>
                </div>
            )}
            {(!isAccepted && props.isTeacher) && (!isCancel || !props.data.is_cancelled )&& (
                <div className={classes.buttonDiv}>
                    <StyledAcceptButton
                        variant="contained"
                        color="secondary"
                        href={props.joinUrl}
                    >
                        Host
                    </StyledAcceptButton>
                    <StyledRejectButton
                        variant="contained"
                        color="primary"
                        onClick={handleCancel}
                    >
                        Cancel
                    </StyledRejectButton>
                </div>
            )}
        </div>
    )
}

export const JoinClass = React.memo(JoinClassComponent);