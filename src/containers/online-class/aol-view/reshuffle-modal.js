
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

const ReshuffleModal = ({ openReshuffleModal, setOpenReshuffleModal }) => {
    const classes = useStyles();
    const [batchList, setBatchList] = useState([]);

    const [date, setDate] = useState(new Date())

    const [list, setList] = useState([])
    const [toggle, setToggle] = useState(false);


    const branchDrop = [{ branch_name: 'B 2' }, { branch_name: 'B 3' },]
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));


    const [filterData, setFilterData] = useState({
        course: 'COURSE 1',
        branch: ''
    })

    const val = 'B 1'

    const handleTeacher = (event, value) => {
        setFilterData({ ...filterData, course: '' })
        if (value) {
            setFilterData({ ...filterData, course: value })
        }
    }
    const handleBranch = (event, value) => {
        setFilterData({ ...filterData, branch: value })
    }
    // const handleDateChange=(event,value)=>{
    //     setDate(value)
    // }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    return (
        <div>

            <Dialog open={openReshuffleModal} onClose={() => setOpenReshuffleModal(false)} aria-labelledby="form-dialog-title" classes={{ paper: classes.dialogWrapper }}>
                <DialogTitle id="form-dialog-title">Batch Reshuffle</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={6} >
                                <TextField
                                    id="standard-read-only-input"
                                    label="Course Name"
                                    defaultValue="COURSE 1"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={6} >
                                <TextField
                                    id="standard-read-only-input"
                                    label="Batch Name"
                                    defaultValue={val}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={6} >
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    size='small'
                                    onChange={handleBranch}
                                    id='grade'
                                    className='dropdownIcon'
                                    value={filterData?.branch}
                                    options={branchDrop}
                                    getOptionLabel={(option) => option?.branch_name}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant='outlined'
                                            label='Reshuffle Batch Name'
                                            placeholder='Reshuffle Batch Name'
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={6} >
                                <TextField
                                    id="standard-read-only-input"
                                    label="Batch Limit"
                                    // defaultValue={val}
                                    defaultValue='1:5'
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={6} >
                                <TextField
                                    id="standard-read-only-input"
                                    label="Batch Time"
                                    // defaultValue={val}
                                    defaultValue='12 - 3'
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>



                    </DialogContentText>


                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReshuffleModal(false)} color="primary">
                        Cancel
            </Button>
                    <Button color="primary" onClick={() => setOpenReshuffleModal(false)}>
                        Reshuffle
            </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ReshuffleModal;