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
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [durations, setDurations] = useState('');
    const [hour,setHour]=useState('');
    const [mins,setMins]= useState('');
    const [ampm,setAmpm] =useState('');
    const [divideHour,setDivideHour] = useState('');
    const [divideSec,setDivideSec] = useState('');
    const [filterData, setFilterData] = useState({
        teacher: '',
    })
    const batchSlot = assignData?.classData?.batch_time_slot && assignData?.classData?.batch_time_slot.split('-',2)
    const batchSlotAMPM = assignData?.classData?.batch_time_slot && assignData?.classData?.batch_time_slot.slice(-2);
    const helperTextMsg=`Select time between ${batchSlot && parseInt(batchSlot[0])} to ${batchSlot && parseInt(batchSlot[1])}`
    console.log(batchSlot +'---'+batchSlotAMPM ,'BBBBBB')
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleHour = () => {
        const hr = new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(selectedDate);
        const min = new Intl.DateTimeFormat('en', { minute: 'numeric' }).format(selectedDate);
        setHour(hr.split(' ')[0])
        setMins(min)
        setAmpm(hr.split(' ')[1])
    }

    const handleTeacher = (event, value) => {
        setFilterData({ ...filterData, teacher: '' })
        if (value) {
            setFilterData({ ...filterData, teacher: value })
        }
    }

    const handleDurations = (e) => {
        setDurations(e.target.value);
    }

    useEffect(() => {
        handleHour();
    }, [selectedDate])

    const handleDuration=(e)=>{
        setDurations(e.target.value)
        setDivideHour()
    }

    const handleAssign = () => {
        if (parseInt(batchSlot && batchSlot[0]) % 12 <= hour%12 && parseInt(batchSlot && batchSlot[1]) % 12 > hour%12 &&  batchSlot && batchSlotAMPM === ampm ) {
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(selectedDate);
            const mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(selectedDate);
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(selectedDate);
            axiosInstance.put(`${endpoints.aol.assignTeacher}`, {
                "batch_id": assignData?.classData?.id,
                "start_date_time": selectedDate.format(`${ye}-${mo}-${da} hh:mm:ss`),
                "teacher": filterData.teacher.tutor_id,
                "durations": durations,
            }).then(result => {
                if (result.data.status_code === 200) {
                    setAlert('success', result.data.message)
                    setOpenAssignModal(false)
                    setReload(!reload)
                    setFilterData([])
                    setSelectedDate([])
                }
            })

        } else if (parseInt(batchSlot && batchSlot[0]) % 12 <= hour%12 && parseInt(batchSlot && batchSlot[1]) % 12 == hour%12 && batchSlot && batchSlotAMPM === ampm ) {
            if (mins == 0) {
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
                setAlert('warning', `set the time between ${parseInt(batchSlot && batchSlot[0])} to ${parseInt(batchSlot && batchSlot[1])} ${parseInt(batchSlot && batchSlotAMPM)}`)
            }
        }
         else {
            setAlert('warning', `set the time between ${parseInt(batchSlot && batchSlot[0])} to ${parseInt(batchSlot && batchSlot[1])} ${batchSlot && batchSlotAMPM}`)
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
                            <Grid container spacing={4} >
                                <Grid item xs={12} sm={12}>
                                <TextField
                                    style={{ width: '100%' }}
                                    size='small'
                                    margin="normal"
                                    variant='outlined'
                                    label='Durations'
                                    type='number'
                                    placeholder='Enter Durations in minutes'
                                    value={durations}
                                    onChange={(e)=>handleDuration(e)}
                                    size='small'
                                />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={12}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardDatePicker
                                        style={{ width: '100%' }}
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Start Date"
                                        format='MM-DD-YYYY'
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} >
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
                        <Grid container spacing={2} >
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




