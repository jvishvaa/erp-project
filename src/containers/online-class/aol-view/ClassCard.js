import React from 'react';
import { IconButton, Modal, Typography, Box, makeStyles, Button, withStyles, Grid } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import EditIcon from '@material-ui/icons/Edit';
import Fade from '@material-ui/core/Fade';
import moment from 'moment';
import ClassUpdation from '../create-class/class-updation';


const useStyles = makeStyles((theme)=>({
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
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
    },
    paper: {
        width: "80%",
        backgroundColor: theme.palette.background.paper,
        border: 'none',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

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

const StyledEditButton = withStyles({
    root: {
        height: '30px',
        width: '30px',
        float: 'right',
    }
})(IconButton);

const ClassCard = (props) => {
    const classes = useStyles({});
    const [enableEdit, setEnabelEdit]= React.useState(false)
    const classData = props.classData.zoom_meeting ? props.classData.zoom_meeting : props.classData;
    //console.log(classData);
    

    const editClassJsx = (
        <>
            <StyledEditButton onClick={()=>setEnabelEdit(!enableEdit)}>
                <EditIcon /> 
            </StyledEditButton>
            <Modal
                open={enableEdit}
                onClose={()=>{setEnabelEdit(false)}}
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{timeout: 500}}
            >
                <Fade in={enableEdit}>
                    <div className={classes.paper}>
                        <ClassUpdation classData={classData} />  
                    </div>
                </Fade>
            </Modal>
        </>
    )
    return (
        <Box className={`${props.selectedId === classData.id ? classes.activeCard : classes.card}`}>
            <div>
                <Typography className={classes.classTitle}>
                    {classData.online_class.title}
                </Typography>
                {editClassJsx}
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