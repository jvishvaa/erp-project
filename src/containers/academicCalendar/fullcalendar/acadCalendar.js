import React, { useState } from 'react';
import Layout from '../../Layout';
import './acadCalendar.scss';
import MyCalendar from './monthly';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../.././../components/loader/loader'
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  outlined: {
    border: `1px solid ${theme.palette.primary.main}`,
    background: '#fff',
    color: theme.palette.secondary.main,
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '4px 16px !important',
  },
}));

const AcadCalendar = () => {
  const classes = useStyles();
  const history = useHistory();
  const [accordianOpen, setAccordianOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState(null);
  const [roleList, setRoleList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleBranch = (event, value) => {
    setSelectedBranch('');
    setGradeList([]);
    if (value) {
      setSelectedBranch(value);
    }
  };

  const handleGrade = (event, value) => {
    setSelectedGrades(value);
    if (value.length) {
      const ids = value.map((el) => el.grade_id);
      //   setGradeIds(ids);
      // listSubjects(ids)
    } else {
      //   setGradeIds([]);
      setSelectedGrades([]);
    }
  };

  const statsView = () => {
    setLoading(true);
    history.push('/dashboard');
    setLoading(false);
  };

  return (
    <Layout className='acadyearCalendarContainer'>
      {/* <Grid
        id
        item
        sm={8}
        md={10}
        xs={9}
        style={{
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Accordion expanded={accordianOpen}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            onClick={() => setAccordianOpen(!accordianOpen)}
          >
            <Typography variant='h6' color='primary'>
              Filter
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item md={4} sm={4} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  size='small'
                  //onChange={(e) => setSelectedBranch(e.target.value)}
                  onChange={handleBranch}
                  id='branch_id'
                  className='dropdownIcon'
                  value={selectedBranch}
                  options={branchList}
                  getOptionLabel={(option) => option?.branch_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Branch'
                      placeholder='Select Branch'
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} xs={12} sm={3}>
                <Autocomplete
                  //key={clearKey}
                  multiple
                  size='small'
                  onChange={handleGrade}
                  id='create__class-branch'
                  options={gradeList}
                  className='dropdownIcon'
                  getOptionLabel={(option) => option?.grade__grade_name}
                  filterSelectedOptions
                  value={selectedGrades}
                  renderInput={(params) => (
                    <TextField
                      className='create__class-textfield'
                      {...params}
                      variant='outlined'
                      label='Grades'
                      placeholder='Select Grades'
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} sm={4} xs={12}>
                <Autocomplete
                  style={{ width: '100%' }}
                  multiple
                  fullWidth
                  size='small'
                  onChange={(event, value) => {
                    setSelectedRoles(value);
                  }}
                  id='role_id'
                  className='dropdownIcon'
                  value={selectedRoles?.role_name}
                  options={roleList}
                  getOptionLabel={(option) => option?.role_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Section'
                      placeholder='Section'
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} sm={3} xs={3}>
                <Autocomplete
                  style={{ width: '100%' }}
                  multiple
                  fullWidth
                  size='small'
                  onChange={(event, value) => {
                    setSelectedRoles(value);
                  }}
                  id='role_id'
                  className='dropdownIcon'
                  value={selectedRoles?.role_name}
                  options={roleList}
                  getOptionLabel={(option) => option?.role_name}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant='outlined'
                      label='Subject'
                      placeholder='Subject'
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} sm={3} xs={3} ml={4}>
                <Button
                  style={{ marginTop: '5px' }}
                  variant='contained'
                  color='primary'
                  //   onClick={() => getUsersData()}
                  fullWidth={true}
                >
                  Filter
                </Button>
              </Grid>
              <Grid item md={3} sm={3} xs={3}>
                <Button
                  style={{ marginTop: '5px' }}
                  variant='contained'
                  color='primary'
                  //   onClick={handleResetFilters}
                  fullWidth={true}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <div className='stats-view'>
          <Button className={classes.outlined} color='secondary' onClick={statsView}>
            Stats View
          </Button>
        </div>
      </Grid> */}
      <div className='calenderContainer'>
        <MyCalendar />
      </div>
      {loading && <Loader />}
    </Layout>
  );
};
export default AcadCalendar;
