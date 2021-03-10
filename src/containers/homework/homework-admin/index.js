import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../Layout';
import './homework-admin.css';
import {
  Checkbox,
  IconButton,
  TextField,
  Grid,
  Button,
  useTheme,
  Divider,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { HighlightOffOutlined, AddCircleOutline } from '@material-ui/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    margin: '1.25rem 3%',
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
    boxShadow: '0px 0px 10px -5px #fe6b6b',
    borderRadius: '.5rem',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
}));

const sscolumns = [
  {
    id: 'subject',
    label: 'Subject',
    minWidth: 80,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'mandatory',
    label: 'Mandatory',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'optional',
    label: 'Optional',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'others',
    label: 'Others',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
];
const columns = [
  {
    id: 'low_range',
    label: 'Lower Range',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'upper_range',
    label: 'Upper Range',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'star',
    label: 'Star',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'display',
    label: 'Display',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'addrating',
    label: 'Add Rating',
    minWidth: 200,
    align: 'center',
    labelAlign: 'center',
  },
];

const HomeworkAdmin = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [rowData, setRowData] = useState({
    hw_ration: [],
    subject_data: [],
    prior_data: [],
  });
  const [loading, setLoading] = useState(false);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%';
  const widerWidth = isMobile ? '90%' : '85%';
  const [searchGrade, setSearchGrade] = useState('');
  const [searchSection, setSearchSection] = useState('');
  const [sectionDisplay, setSectionDisplay] = useState([]);
  const [gradeDisplay, setGradeDisplay] = useState([]);
  const { role_details } = JSON.parse(localStorage.getItem('userDetails'));
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [prior, setPrior] = useState();
  const [post, setPost] = useState();
  const [hwratio, setHwratio] = useState(false);
  const [topPerformers, setTopPerformers] = useState(false);
  const [ratingData, setRatingData] = useState([]);
  const [mandatorySubjects, setMandatorySubjects] = useState([]);
  const [optionalSubjects, setOptionalSubjects] = useState([]);
  const [otherSubjects, setOtherSubjects] = useState([]);
  const [required, setRequired] = useState({ lower: '', upper: '', star: '', index: '' });
  // else if((mandatorySubjects.length+optionalSubjects.length+otherSubjects.length)!==(rowData.subject_data.length)){
  //   setAlert('error','A subject should be either mandatory, optional or other but can\'t be empty')
  // }else if(mandatorySubjects.length===0 && rowData.subject_data.length>=3){
  //   setAlert('error','Atleast one subject should be mandatory')
  // }else if(optionalSubjects.length===0 && rowData.subject_data.length>=3){
  //   setAlert('error','Atleast one subject should be optional')
  // }else if(otherSubjects.length===0 && rowData.subject_data.length>=3){
  //   setAlert('error','Atleast one subject should be other than mandatory and optional')
  // }

  const handleSubmit = (e) => {
    e.preventDefault();

    let clear = true;
    for (let i = 0; i < ratingData.length; i++) {
      if (
        ratingData[i]['low_range'] &&
        ratingData[i]['upper_range'] &&
        ratingData[i]['star']
      ) {
        if (ratingData[i]['low_range'] < 0.1) {
          clear = false;
          setAlert(
            'warning',
            "Lower Range can't be less than 0.1 for rating number " + (i + 1)
          );
          break;
        } else if (ratingData[i]['upper_range'] > 1.0) {
          clear = false;
          setAlert(
            'warning',
            "Upper Range can't be more than 1.0 for rating number " + (i + 1)
          );
          break;
        } else if (ratingData[i]['low_range'] >= ratingData[i]['upper_range']) {
          clear = false;
          setAlert(
            'warning',
            "Lower Range can't be greater than or equal to Upper Range for rating number " +
              (i + 1)
          );
          break;
        } else if (ratingData[i]['star'] < 1 || ratingData[i]['star'] > 5) {
          clear = false;
          setAlert(
            'warning',
            'Stars must lie between 1 and 5 for rating number ' + (i + 1)
          );
          break;
        }
      }
    }
    // setRequired({ lower: '', upper: '', star: '', index: '' });
    for (let i = 0; i < ratingData.length; i++) {
      if (ratingData[i]['low_range'] === '') {
        clear = false;
        setAlert('warning', "Lower range can't be empty for rating " + (i + 1));
        break;
        // setRequired(prevState => ({ ...prevState, lower: true, index: i }));
      }
      if (ratingData[i]['upper_range'] === '') {
        clear = false;
        setAlert('warning', "Upper range can't be empty for rating " + (i + 1));
        break;
        // setRequired(prevState => ({ ...prevState, upper: true, index: i }));
      }
      if (ratingData[i]['star'] === '') {
        clear = false;
        setAlert('warning', "Stars can't be empty for rating " + (i + 1));
        break;
        // setRequired(prevState => ({ ...prevState, star: true, index: i }));
      }
    }

    if (searchGrade === '') {
      setAlert('error', 'Grade not selected');
    } else if (searchSection === '') {
      setAlert('error', 'Section not selected');
    } else if (prior === '') {
      setAlert('error', 'Prior days cannot be empty');
    } else if (post === '') {
      setAlert('error', 'Post days cannot be empty');
    } else if (mandatorySubjects.length > 5 || mandatorySubjects.length === 0) {
      setAlert('error', 'Number of mandatory subjects must lie between 1 and 5');
    } else if (clear) {
      debugger;
      setLoading(true);
      axiosInstance
        .post(endpoints.homework.createConfig, {
          branch: role_details.branch[0],
          grade: searchGrade,
          section: searchSection,
          subject_config: {
            mandatory_subjects: mandatorySubjects,
            optional_subjects: optionalSubjects,
            others_subjects: otherSubjects,
            prior_class: prior,
            post_class: post,
            is_hw_ration: hwratio,
            is_top_performers: topPerformers,
          },
          hw_ration: ratingData,
        })
        .then((result) => {
          if (result.data.status_code === 200) {
            setLoading(false);
            setAlert('success', result.data.message);
          } else {
            setLoading(false);
            setAlert('error', result.data.description);
          }
        })
        .catch((error) => {
          setLoading(false);
          setAlert('error', error.response.data.description);
        });
    }
  };

  /*Validation for Edit*/
  // else if(searchGrade
  //   &&searchSection
  //   &&(prior===rowData.prior_data[0].prior_class)
  //   &&(post===rowData.post_data[0].prior_class)
  //   &&(hwratio=== rowData.prior_data[0].is_hw_ration)
  //   &&(topPerformers===rowData.prior_data[0].is_top_performers)){
  // }

  const handleHwratio = (event) => {
    setHwratio(event.target.checked);
  };

  const handleTopPerformers = (event) => {
    setTopPerformers(event.target.checked);
  };

  const handleCheckSubject = (event, id, index) => {
    let value = event.target.checked;
    const list = [...rowData.subject_data];
    let name = event.target.name;

    if (name === 'is_mandatory') {
      if (value) {
        list[index]['is_mandatory'] = true;
        mandatorySubjects.push(id);
      } else {
        list[index]['is_mandatory'] = false;
        mandatorySubjects.splice(mandatorySubjects.indexOf(id), 1);
      }
      list[index]['is_optional'] = false;
      list[index]['is_other'] = false;
      let filtered = optionalSubjects.filter((value) => value !== id);
      setOptionalSubjects(filtered);
      filtered = otherSubjects.filter((value) => value !== id);
      setOtherSubjects(filtered);
    } else if (name === 'is_optional') {
      if (value) {
        list[index]['is_optional'] = true;
        optionalSubjects.push(id);
      } else {
        list[index]['is_optional'] = false;
        optionalSubjects.splice(optionalSubjects.indexOf(id), 1);
      }
      list[index]['is_mandatory'] = false;
      list[index]['is_other'] = false;
      let filtered = mandatorySubjects.filter((value) => value !== id);
      setMandatorySubjects(filtered);
      filtered = otherSubjects.filter((value) => value !== id);
      setOtherSubjects(filtered);
    } else if (name === 'is_other') {
      if (value) {
        list[index]['is_other'] = true;
        otherSubjects.push(id);
      } else {
        list[index]['is_other'] = false;
        otherSubjects.splice(otherSubjects.indexOf(id), 1);
      }
      list[index]['is_mandatory'] = false;
      list[index]['is_optional'] = false;
      let filtered = mandatorySubjects.filter((value) => value !== id);
      setMandatorySubjects(filtered);
      filtered = optionalSubjects.filter((value) => value !== id);
      setOptionalSubjects(filtered);
    }
    setRowData({ ...rowData, subject_data: list });
  };

  const handleAddRating = () => {
    setRatingData([
      ...ratingData,
      { low_range: '', upper_range: '', star: '', is_display: false },
    ]);
  };

  const handleRemoveRating = (index) => {
    const list = [...ratingData];
    list.splice(index, 1);
    setRatingData(list);
  };

  const handleRatingData = (event, index) => {
    let name = event.target.name;
    let value;
    const list = [...ratingData];
    if (name === 'is_display') value = event.target.checked;
    else value = event.target.value;
    list[index][name] = value;
    setRowData({ ...rowData, hw_ration: list });
  };

  const handleGrade = (event, value) => {
    setSectionDisplay([]);
    setSections([]);
    setOtherSubjects([]);
    setMandatorySubjects([]);
    setOptionalSubjects([]);
    setPrior('');
    setPost('');
    setRatingData([]);
    setGradeDisplay([]);
    setSearchGrade('');
    setSearchSection('');
    if (value) {
      setSearchGrade(value?.id);
      setGradeDisplay(value);
      axiosInstance
        .get(
          `${endpoints.masterManagement.sections}?branch_id=${role_details.branch[0]}&grade_id=${value.id}`
        )
        .then((result) => {
          if (result.data.status_code === 200) {
            setSections(result.data?.data);
          } else {
            setAlert('error', result.data.message);
            setRowData({ hw_ration: [], subject_data: [], prior_data: [] });
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
          setRowData({ hw_ration: [], subject_data: [], prior_data: [] });
        });
    } else {
      setRowData({ hw_ration: [], subject_data: [], prior_data: [] });
    }
  };

  const handleSection = (event, value) => {
    setSearchSection('');
    setSectionDisplay([]);
    if (value) {
      setOtherSubjects([]);
      setMandatorySubjects([]);
      setOptionalSubjects([]);
      setSearchSection(value?.section_id);
      setSectionDisplay(value);
    } else {
      setRowData({ hw_ration: [], subject_data: [], prior_data: [] });
      setPrior('');
      setPost('');
      setRatingData([]);
      setSearchSection('');
      setSectionDisplay([]);
    }
  };

  useEffect(() => {
    axiosInstance
      .get(endpoints.masterManagement.gradesDrop)
      .then((result) => {
        if (result.status === 200) {
          setGrades(result.data.data);
        } else {
          setAlert('error', result.data.message);
          setGrades([]);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
        setGrades([]);
      });
  }, []);

  useEffect(() => {
    if (searchGrade && searchSection) {
      let request = `${endpoints.homework.completeData}?branch=${role_details.branch[0]}&grade=${searchGrade}&section=${searchSection}`;
      axiosInstance
        .get(request)
        .then((result) => {
          if (result.data.status_code === 200) {
            let len = result.data.result[0].subject_data.length;
            if (len > 0) {
              let lenhw = result.data.result[0].hw_ration.length;
              if (lenhw > 0) setRatingData(result.data.result[0].hw_ration);
              else
                setRatingData([
                  { low_range: '', upper_range: '', star: '', is_display: false },
                ]);
            } else {
              setRatingData([]);
            }
            let arr = [...result.data.result[0].subject_data];
            for (let i = 0; i < len; i++) {
              if (arr[i]['is_mandatory'] === true) {
                mandatorySubjects.push(arr[i]['subject_id']);
              } else if (arr[i]['is_optional'] === true) {
                optionalSubjects.push(arr[i]['subject_id']);
              } else if (arr[i]['is_other'] === true) {
                otherSubjects.push(arr[i]['subject_id']);
              }
            }
            setRowData(result.data.result[0]);
            setPrior(result.data.result[0].prior_data[0].prior_class);
            setPost(result.data.result[0].prior_data[0].post_class);
            setHwratio(result.data.result[0].prior_data[0].is_hw_ration);
            setTopPerformers(result.data.result[0].prior_data[0].is_top_performers);
          } else {
            setRowData({ hw_ration: [], subject_data: [], prior_data: [] });
            setPrior('');
            setPost('');
            setRatingData([]);
            setHwratio(false);
            setTopPerformers(false);
            setAlert('error', result.data.description);
          }
        })
        .catch((error) => {
          setPrior('');
          setPost('');
          setHwratio(false);
          setTopPerformers(false);
        });
    }
  }, [searchGrade, searchSection]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleGrade}
              id='grade'
              required
              value={gradeDisplay}
              options={grades}
              getOptionLabel={(option) => option?.grade_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grades'
                  placeholder='Grades'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleSection}
              id='section'
              required
              value={sectionDisplay}
              options={sections}
              getOptionLabel={(option) => option?.section__section_name}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Sections'
                  placeholder='Sections'
                />
              )}
            />
          </Grid>
        </Grid>

        <div className='containerClass'>
          <div className='labelTag'>
            No. of days prior to class date when Homework can be uploaded by teacher
          </div>
          <input
            type='text'
            className='inputText'
            value={prior}
            required
            placeholder='No. of Days'
            maxLength='2'
            pattern='^[0-9]{1,2}'
            onChange={(e) => setPrior(e.target.value)}
          />
        </div>

        <div className='containerClass' style={{ marginBottom: '-1.25rem' }}>
          <div className='labelTag'>
            No. of days post class date when Homework can be uploaded by teacher
          </div>
          <input
            type='text'
            className='inputText'
            value={post}
            required
            placeholder='No. of Days'
            maxLength='2'
            pattern='^[0-9]{1,2}'
            onChange={(e) => setPost(e.target.value)}
          />
        </div>

        <Grid
          container
          spacing={5}
          spacing={isMobile ? 1 : 5}
          style={{ width: '85%', margin: '1.25rem 0 0 3%' }}
        >
          <Grid item xs={6} sm={3}>
            <FormControlLabel
              className='switchLabel'
              control={
                <Switch
                  checked={hwratio}
                  onChange={handleHwratio}
                  name='hwratio'
                  color='primary'
                />
              }
              label={'Star Conversion'}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <FormControlLabel
              className='switchLabel'
              control={
                <Switch
                  checked={topPerformers}
                  onChange={handleTopPerformers}
                  name='topperformers'
                  color='primary'
                />
              }
              label={'Top-Performers'}
            />
          </Grid>
        </Grid>

        <Divider style={{ width: '85%', margin: '0 3%' }} />

        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className='table-header-row'>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      className={classes.columnHeader}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {rowData.subject_data.length ? (
                <TableBody>
                  {ratingData.map((row, index) => {
                    return (
                      <TableRow ratio='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            style={{ width: '50%' }}
                            id='lower'
                            placeholder='Lower'
                            variant='outlined'
                            required
                            value={row.low_range}
                            inputProps={{ maxLength: 3, accept: '^[01]?(.)[0-9]{1}$' }}
                            size='small'
                            name='low_range'
                            autoComplete='off'
                            onChange={(e) => handleRatingData(e, index)}
                          />
                          {/* <div style={(required.lower && required?.index === index) ? { visibility: 'visible', color: 'red' } : { visibility: 'hidden' }}>Required</div> */}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            style={{ width: '50%' }}
                            id='upper'
                            placeholder='Upper'
                            variant='outlined'
                            size='small'
                            required
                            value={row.upper_range}
                            inputProps={{ maxLength: 3, accept: '^[01]?(.)[0-9]{1}$' }}
                            name='upper_range'
                            autoComplete='off'
                            onChange={(e) => handleRatingData(e, index)}
                          />
                          {/* <div style={(required.upper && required?.index === index) ? { visibility: 'visible', color: 'red' } : { visibility: 'hidden' }}>Required</div> */}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <TextField
                            style={{ width: '50%' }}
                            id='star'
                            placeholder='Star'
                            variant='outlined'
                            size='small'
                            required
                            inputProps={{ maxLength: 1 }}
                            value={row.star}
                            name='star'
                            autoComplete='off'
                            onChange={(e) => handleRatingData(e, index)}
                          />
                          {/* <div style={(required.star && required?.index === index) ? { visibility: 'visible', color: 'red' } : { visibility: 'hidden' }}>Required</div> */}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <Checkbox
                            checked={row.is_display}
                            name='is_display'
                            onChange={(e) => handleRatingData(e, index)}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            color='primary'
                          />
                        </TableCell>

                        <TableCell className={classes.tableCell}>
                          {ratingData.length !== 1 && (
                            <IconButton onClick={() => handleRemoveRating(index)}>
                              <HighlightOffOutlined color='secondary' />
                            </IconButton>
                          )}
                          {ratingData.length === index + 1 && (
                            <IconButton onClick={handleAddRating}>
                              <AddCircleOutline color='primary' />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <TableBody
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '25% 120%',
                    fontSize: '16px',
                    color: '#fe6b6b',
                    width: '100%',
                  }}
                >
                  Sorry! No Data Available.
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Paper>

        <Divider style={{ width: '85%', margin: '0 3%' }} />

        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className='table-header-row'>
                <TableRow>
                  {sscolumns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      className={classes.columnHeader}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {rowData.subject_data.length ? (
                <TableBody>
                  {rowData.subject_data.map((row, index) => {
                    return (
                      <TableRow hover subject='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          {row.subject_name}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <Checkbox
                            checked={row.is_mandatory}
                            onChange={(e) => handleCheckSubject(e, row.subject_id, index)}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            color='primary'
                            name='is_mandatory'
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <Checkbox
                            checked={row.is_optional}
                            onChange={(e) => handleCheckSubject(e, row.subject_id, index)}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            color='primary'
                            name='is_optional'
                          />
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <Checkbox
                            checked={row.is_other}
                            onChange={(e) => handleCheckSubject(e, row.subject_id, index)}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                            color='primary'
                            name='is_other'
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <TableBody>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      margin: '25% 80%',
                      fontSize: '16px',
                      color: '#fe6b6b',
                      width: '100%',
                    }}
                  >
                    Sorry! No Data Available
                  </div>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Paper>

        <Grid
          container
          spacing={isMobile ? 1 : 5}
          style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}
        >
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color='primary'
              className='custom_button_master'
              size='medium'
              type='submit'
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export default HomeworkAdmin;
