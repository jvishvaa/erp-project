import React, { useEffect, useState, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Divider, Grid, makeStyles, useTheme, withStyles, Button, TextField, Switch, FormControlLabel } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state'
import axiosInstance from '../../../config/axios'
import endpoints from '../../../config/endpoints';
import './style.css'
import { setLocale } from 'yup';

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
const ReassignModal = ({ openReassignModal, setOpenReassignModal, teacherDropdown }) => {
    const { setAlert } = useContext(AlertNotificationContext);
    const [teacherData,setTeacherData]= useState(teacherDropdown)


    useEffect(() => {
        // axiosInstance.get(`${endpoints.}`)
    }, [])

    const handleSubmit = () => {
        axiosInstance.put(`${endpoints.aol.updateTeacher}`, {
            "teacher": 1441,
            "batch_id": 62
        }).then(result=>{
            if(result.data.status_code === 200){
                setAlert('success',result.data.message)
                setOpenReassignModal(false)
            }
        })
    }

    return (
        <div>
            <Dialog open={openReassignModal} onClose={() => setOpenReassignModal(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" className='reshuffle-header' style={{ color: '#ffffff' }}>Reassign Teacher</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ marginTop: '1.25rem' }}>
                        <Grid container spacing={4} >
                            <Grid item xs={12} sm={12} >
                                <Autocomplete
                                    style={{ width: '100%' }}
                                    size='small'
                                    // onChange={handleTeacher}
                                    id='grade'
                                    className='dropdownIcon'
                                    // value={filterData?.teacher}
                                    // options={teacherDropdown}
                                    // getOptionLabel={(option) => option?.email}
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
                        <Grid>
                            <Button onClick={handleSubmit}>
                                SUBMIT
                            </Button>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ReassignModal;




