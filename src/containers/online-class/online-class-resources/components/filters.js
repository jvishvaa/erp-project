import React, { useContext, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Divider,
  Typography,
  TablePagination,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import '../../../teacherBatchView/style.scss'
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import { LocalizationProvider, DateRangePicker } from '@material-ui/pickers-4.2';
import MomentUtils from '@material-ui/pickers-4.2/adapter/moment';
//import Loader from '../../components/loader/loader';
import axiosInstance from '../../../../config/axios';
import endpoints from '../../../../config/endpoints';
//import filterImage from '../../assets/images/unfiltered.svg';
//import TeacherBatchViewCard from './teacherbatchViewCard';
//import TeacherBatchFullView from './teacherBatchFullView';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state'
//import Layout from '../Layout';

const Filter = (props) => {
    /** 
    const {
        resourceView: { currentPage },
        listOnlineClassesResourceView,
        dispatch,
        listGrades,
        listSections,
        grades,
        sections,
        setCurrentResourceTab,
    } = useContext(OnlineclassViewContext);
    */

    const [dateRangeTechPer, setDateRangeTechPer] = useState([
            moment().subtract(6, 'days'),
            moment(),
        ]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [branchList] = useState([
        {
            id: 5,
            branch_name: 'AOL',
        },
    ]);
    const { setAlert } = useContext(AlertNotificationContext);
    const [loading, setLoading] = useState(false);
    const [studentDetails] = useState(
        JSON.parse(window.localStorage.getItem('userDetails'))
    );
    const [selectedBranch, setSelectedBranch] = useState(branchList[0]);
    const [gradeList, setGradeList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [courseList, setCourseList] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [batchList, setBatchList] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [filterList, setFilterList] = useState('');
    const [filterFullData, setFilterFullData] = useState('');
    const [selectedModule, setSelectedModule] = useState(4);
    const [selectedViewMore, setSelectedViewMore] = useState('');
    const [page, setPage] = useState(1);
    
    function callApi(api, key) {
        setLoading(true);
        axiosInstance.get(api)
        .then((result) => {
            if (result.status === 200) {
                if (key === 'gradeList') {
                    setGradeList(result.data.data || []);
                }
                if (key === 'batchsize') {
                    setBatchList(result.data.result || []);
                }
                if (key === 'course') {
                    setCourseList(result.data.result || []);
                }
                if (key === 'filter') {
                    setFilterFullData(result.data || {});
                    setFilterList(result.data.data || {});
                    setSelectedViewMore('');
                    props.getResourceData(result.data.data);
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
    
    function handleClose(data) {
        setSelectedViewMore('');
        if (data === 'success') {
            setPage(1);
            callApi(`${endpoints.teacherViewBatches.getBatchList}?aol_batch=${
                selectedBatch && selectedBatch.id
                }&start_date=${startDate}&end_date=${endDate}&page_number=${page}&page_size=12&module_id=${selectedModule}&class_type=1&batch_limit=${selectedBatch.batch_size}`,
                'filter'
            );
        }
    }
    
    useEffect(() => {
        callApi(
            `${endpoints.academics.grades}?branch_id=${selectedBranch.id}&module_id=4`,
            'gradeList'
        );
    }, []);
    
    function handlePagination(e, page) {
        setPage(page);
        callApi(`${endpoints.teacherViewBatches.getBatchList}?aol_batch=${
                    selectedBatch && selectedBatch.id
                }&start_date=${startDate}&end_date=${endDate}&page_number=${page}&page_size=12&module_id=${selectedModule}&class_type=1&batch_limit=${selectedBatch.batch_size}`,
            'filter'
        );
    }
    
    function handleClearFilter() {
        setDateRangeTechPer([moment().subtract(6, 'days'), moment()]);
        setEndDate('');
        setStartDate('');
        setSelectedBranch('');
        setSelectedGrade('');
        setCourseList([]);
        setSelectedCourse('');
        setBatchList([]);
        setSelectedBatch('');
        props.hendleDetails();
        props.getResourceData([]);
    }
    
    function handleFilter() {
        if (!selectedGrade) {
            setAlert('warning', 'Select Grade');
            return;
        }
        if (!selectedCourse) {
            setAlert('warning', 'Select Course');
            return;
        }
        if (!selectedBatch) {
            setAlert('warning', 'Select Batch Size');
            return;
        }
        if (!startDate) {
            setAlert('warning', 'Select Start Date');
            return;
        }
        setLoading(true);
        setPage(1);
        callApi(`${endpoints.teacherViewBatches.getBatchList}?aol_batch=${
                selectedBatch && selectedBatch.id
            }&start_date=${startDate}&end_date=${endDate}&page_number=1&page_size=12&module_id=4&class_type=1&batch_limit=${selectedBatch && selectedBatch.batch_size}&batch_limit=${selectedBatch.batch_size}`,
            'filter'
        );
    }
    
    function handleDate(v1) {
        if (v1 && v1.length !== 0) {
            setStartDate(moment(new Date(v1[0])).format('YYYY-MM-DD'));
            setEndDate(moment(new Date(v1[1])).format('YYYY-MM-DD'));
        }
        setDateRangeTechPer(v1);
    }

    return (
        <>
            <Grid container spacing={2} style={{ marginTop: '10px' }}>
                <Grid item md={3} xs={12}>
                    <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={(event, value) => {
                            setSelectedBranch(value);
                        }}
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
                                placeholder='Branch'
                            />
                        )}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={(event, value) => {
                            setSelectedGrade(value);
                            if (value) {
                                callApi(
                                `${endpoints.teacherViewBatches.courseListApi}?grade=${
                                    value && value.grade_id
                                }`,
                                'course'
                                );
                            }
                            setCourseList([]);
                            setBatchList([]);
                            setSelectedCourse('');
                            setSelectedBatch('');
                        }}
                        id='grade_id'
                        className='dropdownIcon'
                        value={selectedGrade}
                        options={gradeList}
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
                <Grid item md={3} xs={12}>
                    <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={(event, value) => {
                            setSelectedCourse(value);
                            if (value) {
                                callApi(`${endpoints.teacherViewBatches.batchSizeList}?course_id=${
                                        value && value.id
                                    }`,
                                    'batchsize'
                                );
                            }
                            setBatchList([]);
                            setSelectedBatch('');
                        }}
                        id='course_id'
                        className='dropdownIcon'
                        value={selectedCourse}
                        options={courseList}
                        getOptionLabel={(option) => option?.course_name}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant='outlined'
                                label='Course'
                                placeholder='Course'
                            />
                        )}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <Autocomplete
                        style={{ width: '100%' }}
                        size='small'
                        onChange={(event, value) => {
                            setSelectedBatch(value);
                        }}
                        id='batch_size_id'
                        className='dropdownIcon'
                        value={selectedBatch}
                        options={batchList}
                        getOptionLabel={(option) =>
                            option ? `1 : ${JSON.stringify(option.batch_size)}` : ''}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant='outlined'
                                label='Batch Limit'
                                placeholder='Batch Limit'
                            />
                        )}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                  <LocalizationProvider dateAdapter={MomentUtils}>
                    <DateRangePicker
                        startText='Select-date-range'
                        value={dateRangeTechPer}
                        onChange={(newValue) => {
                            handleDate(newValue);
                        }}
                        renderInput={({ inputProps, ...startProps }, endProps) => {
                        return (
                            <>
                                <TextField
                                    {...startProps}
                                    inputProps={{
                                        ...inputProps,
                                        value: `${inputProps.value} - ${endProps.inputProps.value}`,
                                        readOnly: true,
                                    }}
                                    size='small'
                                    style={{ minWidth: '100%' }}
                                />
                          </>
                        );
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={2} style={{ marginTop: '5px' }}>
                        <Grid item md={2} xs={12}>
                            <Button
                                variant='contained'
                                size='large'
                                className='BatchViewfilterButtons'
                                onClick={() => handleClearFilter()}
                            >
                                Clear All
                            </Button>
                            </Grid>
                            <Grid item md={2} xs={12}>
                            <Button
                                variant='contained'
                                size='large'
                                color="primary"
                                onClick={() => handleFilter()}
                            >
                                Get Classes
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Filter;