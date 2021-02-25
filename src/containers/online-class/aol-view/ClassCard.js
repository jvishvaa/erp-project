import React, { useContext } from 'react';
import { IconButton, Modal, Typography, Box, makeStyles, Button, withStyles, Grid } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import EditIcon from '@material-ui/icons/Edit';
import Fade from '@material-ui/core/Fade';
import moment from 'moment';
import ClassUpdation from '../create-class/class-updation';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useHistory, useLocation } from 'react-router-dom';
import { CreateclassContext } from '../create-class/create-class-context/create-class-state';

const useStyles = makeStyles((theme) => ({
    card: {
        padding: '8px',
        border: '1px solid #F9D474',
        borderRadius: '10px',
        backgroundColor: '#FFFADF',
        cursor: 'pointer',
        minHeight: '200px',
    },
    activeCard: {
        padding: '8px',
        border: '1px solid #F9D474',
        borderRadius: '10px',
        backgroundColor: '#F9D474',
        height: 'auto',
        minHeight: '200px',
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

export default function ClassCardComponent(props) {
    const history = useHistory();
    const classes = useStyles({});
    const location = useLocation();
    const [enableEdit, setEnabelEdit] = React.useState(false)
    const classData = props.classData.zoom_meeting ? props.classData.zoom_meeting : props.classData;

    const { dispatch, setEditData } = useContext(CreateclassContext);
    const handleEditClass = () => {
        // dispatch(setEditData(classData));
        // history.push('/online-class/create-class');
        handleOpen()
    }
    console.log(props, '...........');

    const handleOpen = () => { setEnabelEdit(true) }
    const handleClose = () => { setEnabelEdit(false) }
    const updateClasses = () => {
        if (props.updateClasses) {
            props.updateClasses()
        }
    }
    const updateClassesAndHandleClose = () => {
        handleClose()
        updateClasses()

    }
    const StyledEditButton = withStyles({
        root: {
            height: '30px',
            width: '30px',
            float: 'right',
        }
    })(IconButton);
    const editClassJsx = (
        <>
            <Modal
                open={enableEdit}
                onClose={handleClose}
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={enableEdit}>
                    <div className={classes.paper}>
                        <ClassUpdation handleClose={updateClassesAndHandleClose} classData={classData} />
                    </div>
                </Fade>
            </Modal>
        </>
    )
    return (
        <>
            {(props && props.toggle) ?
                (<div>
                    <Box className={`${props.selectedId === classData.id ? classes.activeCard : classes.card}`}>
                        <Typography className={classes.classSchedule}>
                            Batch Name:{classData && classData.batch_name}
                        </Typography>
                        <Typography className={classes.classSchedule}>
                            Batch Size: {classData && `1 : ${classData.batch_size}`}
                        </Typography>
                        <div style={{ marginTop: '15px', width: '100%' }}>
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
                </div>
                ) : (
                    <Box className={`${props.selectedId === classData.id ? classes.activeCard : classes.card}`}>
                        <div>
                            <Typography className={classes.classTitle}>
                                {classData.online_class ? classData.online_class.title : ''}
                            </Typography>
                        </div>
                        <div>
                            <Typography className={classes.classTitle}>
                                {classData.online_class ? `No. Seat Left : ${classData.online_class && classData.online_class.seat_left}` : ''}
                            </Typography>
                        </div>

                        <Typography className={classes.classSchedule}>
                            Start Date: {classData.online_class ? moment(classData.online_class.start_time).format('DD-MM-YYYY') : ''}
                        </Typography>

                        <Typography className={classes.classSchedule}>
                            End Date: {classData.online_class ? moment(classData.online_class.end_time).format('DD-MM-YYYY') : ''}
                        </Typography>
                        <Typography className={classes.classSchedule}>
                            Assigned To: {classData.online_class && classData.online_class.teacher.split('@')[0]}
                        </Typography>

                        <div style={{ marginTop: '-2px', width: '100%' }}>
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
                )}
        </>
    )
}

export const ClassCard = React.memo(ClassCardComponent);