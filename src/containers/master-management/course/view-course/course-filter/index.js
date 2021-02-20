import React, { useState, useEffect, useContext } from 'react';
import {useHistory,useParams} from 'react-router-dom';
import {
  Grid,
  TextField,
  Button,
  useTheme,
} from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Box from '@material-ui/core/Box';
// import useStyles from './useStyles';
import endpoints from '../../../../../config/endpoints';
import axiosInstance from '../../../../../config/axios';
import {AlertNotificationContext} from '../../../../../context-api/alert-context/alert-state'
import Divider from '@material-ui/core/Divider';

const CourseFilter = ({handleCourseList}) => {
    const themeContext = useTheme();
    const { gradeKey } = useParams();
    const { setAlert } = useContext(AlertNotificationContext);
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
    const widerWidth = isMobile ? '98%' : '95%';
    const history =useHistory();
    const [branchDropdown, setBranchDropdown] = useState([]);
    const [gradeDropdown, setGradeDropdown] = useState([]);
    const [gradeIds, setGradeIds] = useState([]);
  
    const [filterData, setFilterData] = useState({
      branch: '',
      grade: [],
    });

    const branchDrop=[{branch_name:'AOL'}]

    const handleClear = () => {
        setFilterData({
            grade: [],
            branch:'',
        });
    }

    const handleFilter=()=>{
        handleCourseList(gradeIds);
    }
  
    const handleBranch = (event, value) => {
      setFilterData({ ...filterData, branch: '' });
      if (value) {
        setFilterData({
          ...filterData,
          branch: value,
        });
        axiosInstance
          .get(`${endpoints.communication.grades}?branch_id=${5}&module_id=8`)
          .then((result) => {
            if (result.data.status_code === 200) {
              setGradeDropdown(result?.data?.data);
            } else {
              setAlert('error', result?.data?.message);
              setGradeDropdown([]);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setGradeDropdown([]);
          });
      } else {
        setGradeDropdown([]);
      }
    };

    useEffect(()=>{
      if(gradeKey) {
        axiosInstance
          .get(`${endpoints.communication.grades}?branch_id=${5}&module_id=8`)
          .then((result) => {
            if (result.data.status_code === 200) {
              setGradeDropdown(result?.data?.data);
              const gradeObj = result.data?.data?.find(
                ({ grade_id }) => grade_id === Number(gradeKey)
              );
              if(gradeKey) {
                setFilterData({
                  grade: gradeObj,
                  branch:{branch_name:'AOL'},
                });
                handleCourseList(gradeKey);
              }
            } else {
              setAlert('error', result?.data?.message);
              setGradeDropdown([]);
            }
          })
          .catch((error) => {
            setAlert('error', error.message);
            setGradeDropdown([]);
          });
      }
    },[gradeKey]);
  
    const handleGrade = (event, value) => {
      setFilterData({ ...filterData, grade: '' });
      if (value) {
        setGradeIds(value.grade_id);
        setFilterData({
          ...filterData,
          grade: value,
        });
      }
    };
    // useEffect(() => {
    //   axiosInstance
    //     .get(`${endpoints.communication.branches}`)
    //     .then((result) => {
    //       if (result.data.status_code === 200) {
    //         setBranchDropdown(result.data.data);
    //       } else {
    //         setAlert('error', result.data.message);
    //       }
    //     })
    //     .catch((error) => {
    //       setBranchDropdown('error', error.message);
    //     });
    // }, []);

    return(
        <>
        <Grid
        container
        spacing={isMobile ? 3 : 5}
        style={{ width: widerWidth, margin: wider }}
      >
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
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
                label='Branch'
                placeholder='Branch'
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
          <Autocomplete
            style={{ width: '100%' }}
            size='small'
            onChange={handleGrade}
            id='volume'
            className='dropdownIcon'
            value={filterData?.grade}
            options={gradeDropdown}
            getOptionLabel={(option) => option?.grade__grade_name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant='outlined'
                label='Grade'
                placeholder='Grade'
              />
            )}
          />
        </Grid>
        
      </Grid>
      <Grid
        container
        spacing={isMobile ? 3 : 5}
        style={{ width: widerWidth, margin: wider }}
      >

      <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                    variant='contained'
                    className="custom_button_master labelColor"
                    size='medium'
                    onClick={handleClear}
                >
                    CLEAR ALL
                </Button>
            </Grid>
            <Grid item xs={6} sm={2} className={isMobile ? '' : 'addButtonPadding'}>
                <Button
                    variant='contained'
                    style={{ color: 'white' }}
                    color="primary"
                    className="custom_button_master"
                    size='medium'
                    onClick={handleFilter}
                >
                    FILTER
            </Button>
            </Grid>
            <div>
                <Divider orientation="vertical" style={{backgroundColor:'#014e7b',height:'40px',marginTop:'1rem',marginLeft:'2rem',marginRight:'1.25rem'}} />
            </div>
            <Grid item xs={6} sm={2} className={isMobile ? 'createButton' : 'createButton addButtonPadding'}>
                <Button
                    startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                    variant='contained'
                    style={{ color: 'white' }}
                    color="primary"
                    className="custom_button_master"
                    onClick={()=>history.push("/create/course")}
                    size='medium'
                >
                    CREATE
                </Button>
            </Grid>
           
            </Grid>
      </>
    )

};

export default CourseFilter;
