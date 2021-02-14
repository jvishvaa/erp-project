import Dialog from '@material-ui/core/Dialog';
import { Divider, Grid, makeStyles, useTheme, withStyles, Button, TextField, Switch, FormControlLabel } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state'
import MomentUtils from '@date-io/moment';
import DateFnsUtils from '@date-io/date-fns'
import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../../config/axios'
import endpoints from '../../../config/endpoints';
import { result } from 'lodash';
import './style.css'

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5),
        width: '25%'
    },
    dialogTitle: {
        paddingRight: '0px'
    }
}))
const AssignModal = ({ openAssignModal, setOpenAssignModal, teacherDropdown, assignData, setReload, reload }) => {
    const classes = useStyles();
    const [batchList, setBatchList] = useState([]);
    const [date, setDate] = useState(new Date())
    const [list, setList] = useState([])
    const [toggle, setToggle] = useState(false);
    const { setAlert } = useContext(AlertNotificationContext);
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    let hour;
    let mins;

    const [filterData, setFilterData] = useState({
        teacher: '',
    })
    const batchSlot = assignData?.classData?.batch_time_slot && assignData?.classData?.batch_time_slot.split('-')
    const helperTextMsg=`Select time between ${batchSlot && parseInt(batchSlot[0])} to ${batchSlot && parseInt(batchSlot[1])}`

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleHour = () => {
        const hr = new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(selectedDate);
        const min = new Intl.DateTimeFormat('en', { minute: 'numeric' }).format(selectedDate);
        hour = hr.split(' ')[0]
        mins = min
    }
    const handleTeacher = (event, value) => {
        setFilterData({ ...filterData, teacher: '' })
        if (value) {
            setFilterData({ ...filterData, teacher: value })
        }
    }

    useEffect(() => {
        handleHour();
    }, [selectedDate])


    // console.log(parseInt(batchSlot[0]),parseInt(batchSlot[1]),'BBBBBB')
    const handleAssign = () => {
        if (parseInt(batchSlot && batchSlot[0]) % 12 <= hour && parseInt(batchSlot && batchSlot[1]) % 12 > hour && filterData.teacher) {
            // <<<<API CALL >>>alert('success')
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(selectedDate);
            const mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(selectedDate);
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(selectedDate);
            axiosInstance.put(`${endpoints.aol.assignTeacher}`, {
                "batch_id": assignData?.classData?.id,
                "start_date_time": selectedDate.format(`${ye}-${mo}-${da} hh:mm:ss`),
                "teacher": filterData.teacher.tutor_id,
            }).then(result => {
                if (result.data.status_code === 200) {
                    setAlert('success', result.data.message)
                    setOpenAssignModal(false)
                    setReload(!reload)
                }
            })

        } else if (parseInt(batchSlot && batchSlot[0]) % 12 <= hour && parseInt(batchSlot && batchSlot[0]) % 12 == hour && filterData.teacher) {
            if (mins == 0 && filterData.teacher) {
                //  api call >>>>><<<<<<alert('sucess-nested')
                const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(selectedDate);
                const mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(selectedDate);
                const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(selectedDate);
                axiosInstance.put(`${endpoints.aol.assignTeacher}`, {
                    "batch_id": assignData?.classData?.id,
                    "start_date_time": selectedDate.format(`${ye}-${mo}-${da} hh:mm:ss`),
                    "teacher": filterData.teacher.tutor_id,
                }).then(result => {
                    if (result.data.status_code === 200) {
                        setAlert('success', result.data.message)
                        setOpenAssignModal(false)
                        setReload(!reload)
                    }
                })
            }
            else {
                setAlert('warning', `set the time between ${parseInt(batchSlot && batchSlot[0])} to ${parseInt(batchSlot && batchSlot[1])}`)
            }
        } else {
            setAlert('warning', `set the time between ${parseInt(batchSlot && batchSlot[0])} to ${parseInt(batchSlot && batchSlot[1])}`)
        }
    }
    return (
        <div>
            <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} aria-labelledby="form-dialog-title" classes={{ paper: classes.dialogWrapper }}>
                <DialogTitle id="form-dialog-title" className='reshuffle-header' style={{ color: '#ffffff' }}>Assign Teacher</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ marginTop: '1.25rem' }}>
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={12} >
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    size='small'
                                    onChange={handleTeacher}
                                    id='grade'
                                    className='dropdownIcon'
                                    value={filterData?.teacher}
                                    options={teacherDropdown}
                                    getOptionLabel={(option) => option?.email}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant='outlined'
                                            label='Teacher Name'
                                            placeholder='Teacher Name'
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className='create-class-container'>
                            <Grid item xs={12} sm={12}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardDatePicker
                                        style={{ width: '100%' }}
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Start Date"
                                        format="MM/dd/yyyy"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} className='create-class-container'>
                            <Grid item xs={12} sm={12}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        style={{ width: '100%'}}
                                        className='helperText'
                                        id="time-picker"
                                        label="Start Time"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        helperText={helperTextMsg}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className='create-class-container'>
                            <Grid item xs={12} sm={6}>
                                <Button onClick={() => setOpenAssignModal(false)} color="primary" style={{ width: '7.5rem' }}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button color="primary"
                                    onClick={handleAssign}
                                    style={{ width: '7.5rem' }}>
                                    ASSIGN
                                    </Button>
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AssignModal;




