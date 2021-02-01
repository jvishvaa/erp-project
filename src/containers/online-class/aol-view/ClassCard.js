import React, {useContext} from 'react';
import { Typography, Box, makeStyles, Button, withStyles, IconButton } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { CreateclassContext } from '../create-class/create-class-context/create-class-state';


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
    const history = useHistory();
    const classes = useStyles({});
    const classData = props.classData.zoom_meeting ? props.classData.zoom_meeting : props.classData;
    
    const { dispatch, setEditData } = useContext(CreateclassContext);
    const handleEditSubject = () => {
        dispatch(setEditData(classData));
        history.push('/online-class/create-class');
    }
    //console.log(classData);
    return (
        <Box className={`${props.selectedId === classData.id ? classes.activeCard : classes.card}`}>
            <div>
                <Typography className={classes.classTitle}>
                    {classData.online_class.title}
                </Typography>
                <IconButton
                    onClick={handleEditSubject}
                    title='Edit Subject'
                    style={{float: 'right', verticalAlign: 'top', display: 'inline-block', padding: '10px'}}
                >
                    <EditOutlinedIcon style={{color:'#fe6b6b', fontSize: '18px'}} />
                </IconButton>
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