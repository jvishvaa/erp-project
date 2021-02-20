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
import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react';
import {useHistory, useParams} from 'react-router-dom'
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state'
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

const ReshuffleModal = ({ openReshuffleModal, setOpenReshuffleModal, studentName, modalData, id }) => {
    const classes = useStyles();
    const { setAlert } = useContext(AlertNotificationContext);
    const [batchList, setBatchList] = useState([]);

    const [date, setDate] = useState(new Date())

    const [list, setList] = useState([])
    const [toggle, setToggle] = useState(false);
    // const {id} = useParams()

    const branchDrop = [{ branch_name: 'B 2' }, { branch_name: 'B 3' },]
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));


    const [filterData, setFilterData] = useState({
        course: 'COURSE 1',
        branch: '',
        batch: '',
    })

    const val = 'B 1'

    const handleTeacher = (event, value) => {
        setFilterData({ ...filterData, course: '' })
        if (value) {
            setFilterData({ ...filterData, course: value })
        }
    }
    const handleBatch = (event, value) => {
        setFilterData({ ...filterData, batch: value })
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    useEffect(() => {
        axiosInstance.get(`${endpoints.aol.reshuffleBatchList}?batch_id=${id}`)
            .then((result) => {
                setBatchList(result.data.result)
            })
    }, [])
    const handleReshuffle = () => {
        axiosInstance.post(`${endpoints.aol.studentReshuffle}?aol=1`, {
            "batch":parseInt(id),
            "new_batch": filterData?.batch?.id,
            "students": [modalData?.user_id]
        })
            .then((result => {
                if (result.data.status_code === 200) {
                    setAlert('success', result.data.message)
                    setOpenReshuffleModal(false)
                }
                else{
                    setAlert('error',result.data.message)
                }
            }))
    }

    return (
        <div>
            <Dialog open={openReshuffleModal} onClose={() => setOpenReshuffleModal(false)} aria-labelledby="form-dialog-title" classes={{ paper: classes.dialogWrapper }}>
                <DialogTitle id="form-dialog-title" className='reshuffle-header' style={{ color: '#ffffff' }}>Batch Reshuffle</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ marginTop: '1.25rem' }} >
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={12} >
                                <TextField
                                    style={{ width: '100%' }}
                                    id="standard-read-only-input"
                                    label="Course Name"
                                    defaultValue={modalData?.course_name}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={12} >
                                <TextField
                                    style={{ width: '100%' }}
                                    id="standard-read-only-input"
                                    label="Batch Name"
                                    defaultValue={modalData?.title}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={12} >
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    size='small'
                                    onChange={handleBatch}
                                    id='grade'
                                    className='dropdownIcon'
                                    value={filterData?.batch}
                                    options={batchList}
                                    getOptionLabel={(option) => option?.batch_name}
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
                        {filterData?.batch ?
                            <Grid container spacing={4} >
                                <Grid item xs={12} sm={12} >
                                    <TextField
                                        style={{ width: '100%' }}
                                        id="standard-read-only-input"
                                        label="Batch Start Time"
                                        defaultValue={moment(filterData?.batch.start_date).format('YYYY-MM-DD h:mm:ss')}
                                        // defaultValue='12 - 3'
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        id="standard-read-only-input"
                                        label="Batch Size"
                                        defaultValue={`1 : ${filterData?.batch.batch_size}`}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>

                            </Grid> : <div style={{ marginTop: '2rem' }}></div>}
                        <Grid container spacing={2} >
                            <Grid item xs={12} sm={6}>

                                <Button onClick={() => setOpenReshuffleModal(false)} color="primary" style={{ width: '7.5rem' }}>
                                    Cancel
                                 </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} style={{ width: '7.5rem' }}>
                                <Button color="primary" onClick={handleReshuffle}>
                                    Reshuffle
                            </Button>
                            </Grid>
                        </Grid>
                    </DialogContentText>


                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => setOpenReshuffleModal(false)} color="primary">
                        Cancel
            </Button>
                    <Button color="primary"
                        // onClick={() => setOpenReshuffleModal(false)}
                        onClick={handleReshuffle}
                    >
                        Reshuffle
            </Button> */}
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ReshuffleModal;