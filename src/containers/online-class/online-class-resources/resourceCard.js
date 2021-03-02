import React from 'react';
import { Typography, Box, makeStyles, Button, withStyles, IconButton } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
//import { CreateclassContext } from '../create-class/create-class-context/create-class-state';


const useStyles = makeStyles({
    card: {
        padding: '8px',
        border: '1px solid #F9D474',
        borderRadius: '5px',
        backgroundColor: '#FFFADF',
        //cursor: 'pointer',
        minHeight: '160px',
    },
    activeCard: {
        padding: '8px',
        border: '1px solid #F9D474',
        borderRadius: '5px',
        backgroundColor: '#F9D474',
        minHeight: '160px',
    },
    classTitle: {
        display: 'inline-block',
        color: '#001495',
        fontSize: '18px',
        fontFamily: 'Poppins',
        //fontWeight: 'bold',
        lineHeight: '27px',
        overflow: 'hidden',
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

export default function ResourceCardComponent(props) {
    const history = useHistory();
    const classes = useStyles({});

    //const { dispatch, setEditData } = useContext(CreateclassContext);
    const handleEditSubject = () => {
        //dispatch(setEditData(classData));
    }
    //console.log(classData);
    //className={`${props.selectedId === classData.id ? classes.activeCard : classes.card}`}
    return (
        <Box className={`${props.selectedId === props.resourceData.id ? classes.activeCard : classes.card}`}>
            <div>
                <Typography className={classes.classTitle}>
                    {props.resourceData.online_class.title}
                </Typography>
                {/*
                <IconButton
                    onClick={handleEditSubject}
                    title='Edit Subject'
                    style={{float: 'right', verticalAlign: 'top', display: 'inline-block', padding: '7px'}}
                >
                    <EditOutlinedIcon style={{color:'#fe6b6b', fontSize: '18px'}} />
                </IconButton>
                */}
            </div>
                <Typography className={classes.classTitle}>
                    {props.resourceData.online_class.subject && props.resourceData.online_class.subject.reduce((sub) => sub.subject_name.join())}
                </Typography>
                {/*
                <Typography className={classes.classSchedule}>
                    Date : {moment(props.resourceData.online_class.start_time).format('Do MMM YYYY')}
                </Typography>
                */}
                <Typography className={classes.classSchedule}>
                    Start Time : {moment(props.resourceData.online_class.start_time).format('h:mm:ss')}
                </Typography>

            <div style={{ marginTop: '15px', width: '100%'}}>
                { props.selectedId !== props.resourceData.id && (
                    <StyledButton
                        variant="contained"
                        color="secondary"
                        onClick={(e) => props.handleSelctedClass(props.resourceData)}
                    >
                        VIEW
                    </StyledButton>
                )}
            </div>
        </Box>
    )
}

export const ResourceCard = React.memo(ResourceCardComponent);