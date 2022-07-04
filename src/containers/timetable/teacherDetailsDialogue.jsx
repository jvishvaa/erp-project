import React from 'react';
import {
  Grid,
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker, TimePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  formTextFields: {
    margin: '12px 8px',
  },
  filter: {
    color: theme.palette.secondary.main,
    fontSize: '11px',
    fontWeight: 600,
    marginRight: '4px',
    cursor: 'pointer',
  },
  addtimetablebtn: {
    backgroundColor: '#EF676A',
    marginTop: '5px',
    marginLeft: '12%',
    '&:hover': {
      backgroundColor: '#EF676A',
    },
  },
  addperiodbutton: {
    marginLeft: '77%',
    color: 'white',
  },
}));

const TeacherDetailsDialogue = (props) => {
  const { openPeriod, periodData, handleClosePeriod } = props;
  const {
    day_name,
    end_time,
    period_type_name,
    start_time,
    subject_name,
    teacher_name,
    branch_name,
    section_name,
    grade_name,
  } = periodData;
  const classes = useStyles();

  return (
    <Grid>
      <div style={{ marginTop: '10%' }}>{''}</div>
      <Dialog
        open={openPeriod}
        onClose={() => handleClosePeriod(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        style={{ marginTop: '4%' }}
      >
        <DialogTitle id='add-new-dialog-title'>{'Period Details'}</DialogTitle>
        <div className={classes.periodDialog}>
          <div className={classes.formTextFields}>
            <Autocomplete
              fullWidth
              id='combo-box-demo'
              value={period_type_name}
              options={[]}
              getOptionLabel={(option) => option}
              disabled={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Period Type'
                  variant='outlined'
                />
              )}
            />
          </div>
          <div className={classes.formTextFields}>
            <Autocomplete
              fullWidth
              id='combo-box-demo'
              value={branch_name}
              options={[]}
              getOptionLabel={(option) => option}
              disabled={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Branch'
                  variant='outlined'
                />
              )}
            />
          </div>
          <div className={classes.formTextFields}>
            <Autocomplete
              fullWidth
              id='combo-box-demo'
              value={grade_name}
              options={[]}
              getOptionLabel={(option) => option}
              disabled={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Grade'
                  variant='outlined'
                />
              )}
            />
          </div>
          <div className={classes.formTextFields}>
            <Autocomplete
              fullWidth
              id='combo-box-demo'
              value={section_name}
              options={[]}
              getOptionLabel={(option) => option}
              disabled={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  fullWidth
                  label='Section'
                  variant='outlined'
                />
              )}
            />
          </div>
          {(period_type_name === 'Lecture' || period_type_name === 'Examination') && (
            <div className={classes.formTextFields}>
              <Autocomplete
                fullWidth
                id='combo-box-demo'
                value={subject_name}
                options={[]}
                getOptionLabel={(option) => option}
                disabled={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size='small'
                    fullWidth
                    label='Subject'
                    variant='outlined'
                  />
                )}
              />
            </div>
          )}
          <div style={{ display: 'flex' }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div className={classes.formTextFields}>
                <TimePicker
                  style={{ width: 250, textAlign: 'center' }}
                  autoOk
                  disabled={true}
                  format='hh:mm A'
                  label='Starting Time'
                  value={moment(new Date('2015-03-25T' + start_time))}
                />
              </div>
              <div className={classes.formTextFields}>
                <TimePicker
                  autoOk
                  disabled={true}
                  format='hh:mm A'
                  label='Ending Time'
                  value={moment(new Date('2015-03-25T' + end_time))}
                />
              </div>
            </MuiPickersUtilsProvider>
          </div>
          {(period_type_name === 'Lecture' ||
            period_type_name === 'Examination' ||
            period_type_name === 'Competitions' ||
            period_type_name === 'Miscellaneous Event') && (
            <div className={classes.formTextFields}>
              <Autocomplete
                fullWidth
                id='combo-box-demo'
                value={teacher_name}
                options={[]}
                getOptionLabel={(option) => option}
                disabled={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size='small'
                    fullWidth
                    label='Assigned Teacher'
                    variant='outlined'
                  />
                )}
              />
            </div>
          )}
          <div className={classes.formTextFields}>
            <Autocomplete
              fullWidth
              value={day_name}
              id='day'
              options={[]}
              getOptionLabel={(option) => option}
              disabled={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  fullWidth
                  size='small'
                  label='Day'
                />
              )}
            />
          </div>
        </div>
        <DialogActions>
          <Button
            className='cancelButton labelColor'
            onClick={() => handleClosePeriod(false)}
            color='primary'
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TeacherDetailsDialogue;
