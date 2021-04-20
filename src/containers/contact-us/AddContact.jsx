import React, { useState, useEffect, useContext } from 'react';
import { Grid, TextField, Button, makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loader from '../../components/loader/loader';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1rem',
    borderRadius: '10px',
    width: '100%',
    margin: '1.5rem -0.1rem',
    // marginLeft:'10px',
    // border:'1px solid black'
  },
  bord: {
    margin: theme.spacing(1),
    border: 'solid lightgrey',
    borderRadius: 10,
  },
  title: {
    fontSize: '1.1rem',
  },

  content: {
    fontSize: '20px',
    marginTop: '2px',
  },
  contentData: {
    fontSize: '12px',
  },
  contentsmall: {
    fontSize: '15px',
  },
  textRight: {
    textAlign: 'right',
  },
  paperSize: {
    width: '300px',
    height: '670px',
    borderRadius: '10px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

function AddContact() {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState([]);
  const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [foe_contact, setFoeContact] = useState('');
  const [op_manager_contact, setOpManagerContact] = useState('');
  const [campus_incharge_contact, setCampusInchargeContact] = useState('');
  const moduleId = 175;

  useEffect(() => {
    if (moduleId) {
      callApi(
        `${endpoints.userManagement.academicYear}?module_id=${moduleId}`,
        'academicYearList'
      );
    }
  }, [moduleId]);
  const handleFoeContact = (e) => {
    const re = /^[0-9]+$/g;
    if (
      (e.target.value === '' || re.test(e.target.value)) &&
      e.target.value.length <= 10
    ) {
      setFoeContact(e.target.value);
    }
  };
  const handleOpManagerContact = (e) => {
    const re = /^[0-9]+$/g;
    if (
      (e.target.value === '' || re.test(e.target.value)) &&
      e.target.value.length <= 10
    ) {
      setOpManagerContact(e.target.value);
    }
  };
  const handleCampusInchargeContact = (e) => {
    const re = /^[0-9]+$/g;
    if (
      (e.target.value === '' || re.test(e.target.value)) &&
      e.target.value.length <= 10
    ) {
      setCampusInchargeContact(e.target.value);
    }
  };
  function callApi(api, key) {
    setLoading(true);
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'academicYearList') {
            console.log(result?.data?.data || []);
            setAcademicYear(result?.data?.data || []);
          }
          if (key === 'branchList') {
            console.log(result?.data?.data || []);
            setBranchList(result?.data?.data?.results || []);
          }
          setLoading(false);
        } else {
          setAlert('error', result.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setLoading(false);
      });
  }
  const handleSend = () => {
    console.log('You Clicked on Send button');
    const payload = {
      academicYear: selectedAcademicYear,
      branch: selectedBranch,
      foe_contact: foe_contact,
      op_manager_contact: op_manager_contact,
      campus_incharge_contact: campus_incharge_contact,
    };
    console.log(payload);
  };

  return (
    <>
      <Grid
        container
        direction='row'
        spacing={3}
        className={classes.root}
        alignItems='center'
        alignContent='center'
      >
        <Grid item md={5} xs={12}>
          <Autocomplete
            size='small'
            fullWidth
            style={{ width: '100%' }}
            onChange={(event, value) => {
              setSelectedAcadmeicYear(value);
              console.log(value, 'test');
              if (value) {
                callApi(
                  `${endpoints.communication.branches}?session_year=${value?.id}&module_id=${moduleId}`,
                  'branchList'
                );
              }
              setSelectedBranch([]);
            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedAcademicYear || ''}
            options={academicYear || ''}
            getOptionLabel={(option) => option?.session_year || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Academic Year'
                placeholder='Academic Year'
              />
            )}
          />
        </Grid>
        <Grid item md={5} xs={12}>
          <Autocomplete
            // multiple
            fullWidth
            size='small'
            style={{ width: '100%' }}
            onChange={(event, value) => {
              setSelectedBranch([]);
              if (value) {
                // const ids = value.map((el)=>el)
                const selectedId = value.branch.id;
                setSelectedBranch(value);
                console.log(value);
                callApi(
                  `${endpoints.academics.grades}?session_year=${
                    selectedAcademicYear.id
                  }&branch_id=${selectedId.toString()}&module_id=${moduleId}`,
                  'gradeList'
                );
              }
            }}
            id='branch_id'
            className='dropdownIcon'
            value={selectedBranch || ''}
            options={branchList || ''}
            getOptionLabel={(option) => option?.branch?.branch_name || ''}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Branch'
                placeholder='Branch'
              />
            )}
          />
        </Grid>
        <form className={classes.root} noValidate autoComplete='off'>
          <TextField
            id='foe-contact-number'
            label='FOE Contact Number'
            type='text'
            fullWidth
            value={foe_contact || ''}
            onChange={(e) => handleFoeContact(e)}
            InputLabelProps={{ shrink: true }}
          />
          <br />
          <br />
          <TextField
            id='operational-manager-number'
            label='Operational Manager Contact Number'
            type='text'
            value={op_manager_contact || ''}
            onChange={(e) => handleOpManagerContact(e)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <br />
          <br />
          <TextField
            id='campus-incharge-number'
            label='Campus Incharge Contact Number'
            type='text'
            value={campus_incharge_contact || ''}
            fullWidth
            onChange={(e) => handleCampusInchargeContact(e)}
            InputLabelProps={{ shrink: true }}
          />
          <br />
          <br />
          <Button variant='contained' color='primary' fullWidth onClick={handleSend}>
            Send
          </Button>
        </form>
      </Grid>{' '}
    </>
  );
}

export default AddContact;
