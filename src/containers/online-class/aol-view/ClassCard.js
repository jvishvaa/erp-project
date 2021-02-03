import React from 'react';
import { Typography, Box, makeStyles, Button, withStyles } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles({
    card: {
        padding: '8px',
        border: '1px solid #F9D474',
        borderRadius: '10px',
        backgroundColor: '#FFFADF',
        cursor: 'pointer',
        minHeight: '165px',
    },
    activeCard: {
        padding: '8px',
        border: '1px solid #F9D474',
        borderRadius: '10px',
        backgroundColor: '#F9D474',
        height: 'auto',
        minHeight: '165px',
    },
    classTitle: {
        display: 'inline-block',
        color: '#001495',
        fontSize: '18px',
        fontFamily: 'Poppins',
        lineHeight: '27px',
    },
    classTime: {
        display: 'inline-block',
        color: '#001495',
        fontSize: '16px',
        fontFamily: 'Poppins',
        lineHeight: '25px',
        float: 'right',
    },
    classSchedule: {
        color: '#014B7E',
        fontSize: '16px',
        fontFamily: 'Poppins',
        lineHeight: '25px',
    }
})

const StyledButton = withStyles({
    root: {
        height: '26px',
        width: '112px',
        fontSize: '15px',
        fontFamily: 'Open Sans',
        color: '#FFFFFF',
        backgroundColor: '#344ADE',
        borderRadius: '5px',
        marginRight: '4px',
        float: 'right',
    }
})(Button);

const ClassCard = (props) => {
    const classes = useStyles({});
    const classData = props.classData.zoom_meeting ? props.classData.zoom_meeting : props.classData;
    //console.log(classData);
    return (
        <Box className={`${props.selectedId === classData.id ? classes.activeCard : classes.card}`}>
            <div>
                <Typography className={classes.classTitle}>
                    {classData.online_class.title}
                </Typography>
            </div>
                <Typography className={classes.classTitle}>
                    {classData.online_class.subject[0].subject_name}
                </Typography>
                <Typography className={classes.classSchedule}>
                    Start Date: {moment(classData.online_class.start_time).format('Do MMM YYYY')}
                </Typography>

                <Typography className={classes.classSchedule}>
                    End Date: {moment(classData.online_class.end_time).format('Do MMM YYYY')}
                </Typography>

            <div style={{ marginTop: '15px', width: '100%'}}>
                {props.selectedId !== props.classData.id && (
                    <StyledButton
                        variant="contained"
                        color="secondary"
                        onClick={(e) => props.handleSelctedClass(classData)}
                    >
                        VIEW
                    </StyledButton>
                )}
            </div>
        </Box>
    )
}

export default ClassCard;