
import Dialog from '@material-ui/core/Dialog';
import { Divider, Grid, makeStyles, useTheme, withStyles, Button, TextField, Switch, FormControlLabel } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import DateFnsUtils from '@date-io/date-fns';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import DateFnsUtils from '@date-io/date-fns'
import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../config/axios';
// import endpoints from '../../config/endpoints';
import { result } from 'lodash';


const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5),
        width: '80%'
    },
    dialogTitle: {
        paddingRight: '0px'
    }
}))

const AssignModal = ({ openAssignModal, setOpenAssignModal }) => {
    const classes = useStyles();
    const [batchList, setBatchList] = useState([]);

    const [date, setDate] = useState(new Date())

    const [list, setList] = useState([])
    const [toggle, setToggle] = useState(false);


    const [teacherDrop, setTeacherDrop] = useState([{ teacher_name: 'SUNNY DEV', teacher_name: 'NITIN', teacher_name: 'MANI', teacher_name: 'TONY', }])

    // const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
    const [filterData, setFilterData] = useState({
        teacher: '',
    })

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };




    const handleTeacher = (event, value) => {
        setFilterData({ ...filterData, teacher: '' })
        if (value) {
            setFilterData({ ...filterData, teacher: value })
        }
    }
 console.log('==========',selectedDate)

    return (
        <div>

            <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} aria-labelledby="form-dialog-title" classes={{ paper: classes.dialogWrapper }}>
                <DialogTitle id="form-dialog-title">Assign Teacher</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={6} >
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    size='small'
                                    onChange={handleTeacher}
                                    id='grade'
                                    className='dropdownIcon'
                                    value={filterData?.teacher}
                                    options={teacherDrop}
                                    getOptionLabel={(option) => option?.teacher_name}
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
                            <Grid item xs={12} sm={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Date picker dialog"
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
                            <Grid item xs={12} sm={6}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <KeyboardTimePicker
                                        margin="normal"
                                        id="time-picker"
                                        label="Time picker"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>

                    </DialogContentText>


                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAssignModal(false)} color="primary">
                        Cancel
            </Button>
                    <Button color="primary" onClick={() => setOpenAssignModal(false)}>
                        ASSIGN
            </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AssignModal;




