import Breadcrumbs from '@material-ui/core/Breadcrumbs';
// import Layout from 'containers/Layout';
import React, { useEffect, useState, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
import { connect, useSelector } from 'react-redux';
import FilterDetailsContext from '../store/filter-data';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
const grade = [{ title: 'The Shawshank Redemption', year: 1994 }];

function Header({ pendingDetails }) {
  const [periodDate, setPeriodDate] = useState();
  const [moduleId, setModuleId] = useState('');
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [selectedbranchIds, setSelectedbranchIds] = useState([]);

  const [gradeList, setGradeList] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState([]);
  const [selectedGradeIds, setSelectedGradeIds] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [sectionId, setSectionId] = useState('');

  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [subjectId, setSubjectId] = useState();

  // const { setAlert } = useContext(AlertNotificationContext);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const selectedAcademicYear = useSelector(
    (state) => state.commonFilterReducer?.selectedYear
  );
  const ctx = useContext(FilterDetailsContext);

  const handleDateClass = (e) => {
    setPeriodDate(e.target.value);
    console.log('bbbbbbbbb', e.target.value);
  };
  let date = moment().format('YYYY-MM-DD');

  const handleBranch = () => {
    setGradeList([]);
    setSelectedSection([]);
    setSelectedSubject([]);
    callApi(
      `${endpoints.academics.grades}?session_year=${
        ctx.sessionYearId
      }&branch_id=${2}&module_id=${ctx.moduleId}`,
      'gradeList'
    );
  };

  const handleGrade = (event = {}, value = []) => {
    // setSelectedGrade([]);

    const ids = value;
    const selectedId = value?.grade_id;
    setSelectedGrade(ids);
    setSelectedGradeIds(selectedId);
    callApi(
      `${endpoints.academics.sections}?session_year=${
        ctx.sessionYearId
      }&branch_id=${2}&grade_id=${selectedId?.toString()}&module_id=${ctx.moduleId}`,
      'section'
    );
  };

  const handleSection = (event = {}, value = []) => {
    // console.log('aaaaa', value);
    const ids = value;
    const selectedId = value?.section_id;
    const sectionid = value?.id;
    setSectionId(sectionid);
    setSelectedSection(ids);
    setSelectedSectionIds(selectedId);
    callApi(
      `${endpoints.academics.subjects}?session_year=${
        ctx.sessionYearId
      }&branch=${2}&grade=${selectedId?.toString()}&section=${selectedId?.toString()}&module_id=${
        ctx.moduleId
      }`,
      'subject'
    );
  };

  const handleSubject = (event = {}, value = []) => {
    setSelectedSubject(value);
    setSubjectId(value?.subject__id);
    // pendingInfo();
    pendingDetails(sectionId, value?.subject__id, periodDate);
  };

  // const pendingInfo = () => {
  //   pendingDetails(sectionId, subjectId, periodDate);
  // };

  function callApi(api, key) {
    axiosInstance
      .get(api)
      .then((result) => {
        if (result.status === 200) {
          if (key === 'gradeList') {
            setGradeList(result.data.data || []);
          }
          if (key === 'section') {
            setSectionList(result.data.data);
          }
          if (key === 'subject') {
            setSubjectList(result.data.data);
          }
        } else {
          console.log('error', result.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // useEffect(() => {
  //   if (NavData && NavData.length) {
  //     NavData.forEach((item) => {
  //       if (
  //         item.parent_modules === 'Online Class' &&
  //         item.child_module &&
  //         item.child_module.length > 0
  //       ) {
  //         item.child_module.forEach((item) => {
  //           if (item.child_name === 'Create Class') {
  //             setModuleId(item.child_id);
  //           }
  //         });
  //       }
  //     });
  //   }
  // }, [window.location.pathname]);

  useEffect(() => {
    handleBranch();
  }, [ctx.moduleId]);

  return (
    // <Layout>
    <>
      <Grid
        className='mainContainer'
        style={{ marginLeft: '20px', marginTop: '10px', marginBottom: '10px' }}
      >
        <Grid>
          <Grid style={{width:"100%"}}>
            <CommonBreadcrumbs
              componentName='Dashboard'
              childComponentName='Homework and Classwork'
              childComponentNameNext='Home work'
            />            
          </Grid>
          <Typography style={{ fontSize: '12px', marginTop: '10px' }}>
            Class Work
          </Typography>
          <Typography style={{ fontSize: '12px', fontWeight: '700', color: 'black' }}>
            Grade 1
          </Typography>
        </Grid>
        <Grid
          className='filters'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Grid container spacing={2} style={{ marginTop: '15px', display: 'flex' }}>
            {/* <Grid item xs={2} md={2} spacing={1}>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                value={selectedGrade || []}
                onChange={handleGrade}
                options={gradeList || []}
                getOptionLabel={(option) => option?.grade__grade_name || ''}
                getOptionSelected={(option, value) => option?.id == value?.id}
                renderInput={(params) => (
                  <TextField {...params} label='Volume' variant='outlined' />
                )}
              />
            </Grid> */}
            <Grid item xs={2} md={2} spacing={1}>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                value={selectedGrade || []}
                onChange={handleGrade}
                options={gradeList || []}
                getOptionLabel={(option) => option?.grade__grade_name || ''}
                getOptionSelected={(option, value) => option?.id == value?.id}
                renderInput={(params) => (
                  <TextField {...params} label='Grade' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item xs={2} md={2} spacing={1}>
              <Autocomplete
                size='small'
                onChange={handleSection}
                id='branch_id'
                value={selectedSection || []}
                options={sectionList || []}
                getOptionLabel={(option) =>
                  option?.section__section_name || option?.section_name || ''
                }
                getOptionSelected={(option, value) =>
                  option?.section_id == value?.section_id
                }
                renderInput={(params) => (
                  <TextField {...params} label='Section' variant='outlined' />
                )}
              />
            </Grid>
            <Grid item xs={2} md={2} spacing={1}>
              <Autocomplete
                id='combo-box-demo'
                size='small'
                onChange={handleSubject}
                className='dropdownIcon'
                value={selectedSubject || []}
                options={subjectList || []}
                getOptionLabel={(option) =>
                  option?.subject__subject_name || option?.subject__subject_name || ''
                }
                getOptionSelected={(option, value) =>
                  option?.subject__subject_name == value?.subject__subject_name
                }
                renderInput={(params) => (
                  <TextField {...params} label='Subject' variant='outlined' />
                )}
              />
            </Grid>
          </Grid>
          <Grid item style={{ marginRight: '31px', marginTop: '17px' }}>
            <TextField
              style={{
                cursor: 'pointer',
                border: '1px solid black',
                borderRadius: '5px',
                paddingTop: '15px',
              }}
              id='date'
              type='date'
              size='small'
              defaultValue={date}
              onChange={handleDateClass}
              inputProps={{ min: date }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      {/* </Layout> */}
    </>
  );
}

export default Header;
