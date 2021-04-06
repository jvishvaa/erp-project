import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Layout from 'containers/Layout';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Breadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import './Styles.css';

const CreateEvent = () => {
  const [state, setState] = useState();
  const [branches, setBranches] = useState();
  const [grades, setGrades] = useState();

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '1rem',
      borderRadius: '10px',
      width: '100%',

      margin: '1.5rem -0.1rem',
    },
  }));
  

  const handleChange = (event) => {
    console.log(event.target.value);
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('state', state);
  };

  const styles = {
    crossButton: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: 0,
    },
  };

  const classes = useStyles();

  useEffect(() => {
    axiosInstance.get(endpoints.academics.branches).then((res) => {
      console.log('brnahces', res.data.data);
      setBranches(res.data.data);
    });

    axiosInstance.get(endpoints.masterManagement.grades).then((res) => {
      console.log('grades', res.data.result.results);
      setGrades(res.data.result.results);
    });
  }, []);

  return (
    <>
      <Layout>
        <Grid container direction='row'>
          <Grid item md={4} xs={12}>
            <Breadcrumbs componentName='CreateEvent' />
          </Grid>
        </Grid>
        <form>
          <Grid container direction='row' spacing={2} className={classes.root}>
            {/* <Grid item md={2}>
              
              <DateRangePicker
                startText='Select-Date-Range'
                size='medium'
                value={dateRangeTechPer}
                onChange={(newValue) => {
                  setDateRangeTechPer(newValue);
                }}
                renderInput={({ inputProps, ...startProps }, endProps) => {
                  return (
                    <>
                      <TextField
                        {...startProps}
                        format={(date) => moment(date).format('DD-MM-YYYY')}
                        inputProps={{
                          ...inputProps,
                          value: `${inputProps.value} > ${endProps.inputProps.value}`,
                          readOnly: true,
                        }}
                        size='medium'
                        style={{ minWidth: '100%' }}
                      />
                    </>
                  );
                }}
              />
            </Grid> */}

            <Grid item md={2} xs={12}>
              <Autocomplete
                size='medium'
                // style={{ width: 150 }}
                id='combo-box-demo'
                onChange={handleChange}
                options={branches}
                getOptionLabel={(option) => option.branch_name}
                renderInput={(params) => (
                  <TextField {...params} label='Event Type' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <TextField
                name='event_name'
                variant='outlined'
                size='medium'
                label='Event Name'
                fullWidth
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid conatiner>
            <Divider />
          </Grid>

          <Grid container direction='row' spacing={2} className={classes.root}>
            {/* <Grid item md={2}>
              <Autocomplete
                size='medium'
                style={{ width: 250 }}
                id='combo-box-demo'
                options={getData}
                onChange={handleChange}
                getOptionLabel={(getData) => getData}
                renderInput={(params) => (
                  <TextField {...params} label='academic year' variant='outlined' />
                )}
              />
            </Grid> */}
            <Grid item md={2} xs={12} xl={2}>
              <Autocomplete
                size='medium'
                id='combo-box-demo'
                name='branch'
                onChange={handleChange}
                options={branches}
                getOptionLabel={(option) => option.branch_name}
                renderInput={(params) => (
                  <TextField {...params} label='Branch' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item md={2} xs={12} xl={2}>
              <Autocomplete
                size='medium'
                id='combo-box-demo'
                name='grade'
                options={grades}
                onChange={handleChange}
                getOptionLabel={(option) => option.grade_name}
                renderInput={(params) => (
                  <TextField {...params} label='Grade' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item md={2} xs={12} xl={2}>
              <Autocomplete
                id='combo-box-demo'
                size='medium'
                options={grades}
                onChange={handleChange}
                getOptionLabel={(option) => option.grade_name}
                renderInput={(params) => (
                  <TextField {...params} label='Section' variant='outlined' />
                )}
              />
            </Grid>
          </Grid>
          <Grid conatiner>
            <Divider />
          </Grid>

          <Grid container direction='row' spacing={2} className={classes.root}>
            <Grid item md={2} xs={6} xl={2}>
              <TextField
                type='date'
                variant='outlined'
                name='start_date'
                fullWidth
                onChange={handleChange}
              />
            </Grid>

            <Grid item md={2} xs={6} xl={2}>
              <TextField
                variant='outlined'
                type='date'
                name='end_date'
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={1} xs={12} xl={1}>
              <FormControlLabel
                control={<Checkbox onChange={handleChange} />}
                label='All Day'
                variant='outlined'
                labelPlacement='top'
              />
            </Grid>
          </Grid>

          <Grid container direction='row' className={classes.root}>
            <Grid item md={1} xs={6} xl={1}>
              <TextField
                type='time'
                variant='outlined'
                name='start_time'
                onChange={handleChange}
              />
            </Grid>

            <Grid item md={2} xs={6} xl={2}>
              <TextField
                variant='outlined'
                type='time'
                name='end_time'
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={1} xs={3} xl={1}>
              <FormControlLabel
                value='top'
                control={<Checkbox />}
                label='1st Half'
                labelPlacement='top'
              />
            </Grid>
            <Grid item md={1} xs={3} xl={1}>
              <FormControlLabel
                value='top'
                control={<Checkbox />}
                label='2nd Half'
                labelPlacement='top'
              />
            </Grid>
          </Grid>
          <Grid conatiner style={{ marginTop: '3%' }}>
            <Divider />
          </Grid>
          <Grid container direction='row' className={classes.root}>
            <Grid item md={8} xl={8} xs={12}>
              <TextField
                variant='outlined'
                name='description'
                label='ADD Event Description'
                labelwidth='170'
                fullWidth
                onChange={handleChange}
                className='style'
              />
            </Grid>
          </Grid>
          <Grid container direction='row' className={classes.root}>
            <Grid item md={2} xl={2} xs={12}>
              <Button variant='contained'>CLEAR ALL</Button>
            </Grid>
            <Grid item md={2} xs={12} xl={2}>
              <Button variant='contained' color='primary' onClick={handleSubmit}>
                SAVE EVENT
              </Button>
            </Grid>
            {/* <Grid item md={2}>
              <DateRangePicker
                onChange={(item) => setAte([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={ate}
                direction='horizontal'
              />
            </Grid> */}
          </Grid>
        </form>

        <sameera />
      </Layout>
    </>
  );
};

export default CreateEvent;
