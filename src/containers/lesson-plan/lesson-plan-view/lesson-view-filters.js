import React, { useContext, useEffect, useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import axios from 'axios';
import './lesson.css';

const LessonViewFilters = ({ handlePeriodList, setPeriodData, setViewMore, setViewMoreData, setFilterDataDown }) => {

    const { setAlert } = useContext(AlertNotificationContext);
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px'
    const widerWidth = isMobile ? '98%' : '95%';

    const [branchDropdown, setBranchDropdown] = useState([]);
    const [academicYearDropdown, setAcademicYearDropdown] = useState([]);
    const [volumeDropdown, setVolumeDropdown] = useState([]);
    const [gradeDropdown, setGradeDropdown] = useState([]);
    const [subjectDropdown, setSubjectDropdown] = useState([]);
    const [chapterDropdown, setChapterDropdown] = useState([]);

    const [filterData, setFilterData] = useState({
        branch: '',
        year: '',
        volume: '',
        grade: '',
        subject: '',
        chapter: '',
    });

    const handleClear = () => {
        setFilterData({
            branch: '',
            year: '',
            volume: '',
            grade: '',
            subject: '',
            chapter: '',
        });
        setPeriodData([]);
        setSubjectDropdown([]);
        setChapterDropdown([]);
        setViewMoreData({});
        setViewMore(false);
        setFilterDataDown({});
    };



    const handleAcademicYear = (event, value) => {
        setFilterData({ ...filterData, year: '' });
        if (value) {
            setFilterData({ ...filterData, year: value });
        }
    };

    const handleVolume = (event, value) => {
        setFilterData({ ...filterData, volume: '' });
        if (value) {
            setFilterData({ ...filterData, volume: value });
        }
    };

    const handleBranch = (event, value) => {
        setFilterData({ ...filterData, branch: '', grade: '', subject: '', chapter: '' });
        if (value) {
            setFilterData({ ...filterData, branch: value, grade: '', subject: '', chapter: '' });
            axiosInstance.get(`${endpoints.communication.grades}?branch_id=${value.id}&module_id=8`)
                .then(result => {
                    if (result.data.status_code === 200) {
                        setGradeDropdown(result.data.data);
                    }
                    else {
                        setAlert('error', result.data.message);
                        setGradeDropdown([]);
                        setSubjectDropdown([]);
                        setChapterDropdown([]);
                    }
                })
                .catch(error => {
                    setAlert('error', error.message);
                    setGradeDropdown([]);
                    setSubjectDropdown([]);
                    setChapterDropdown([]);
                })
        }
        else {
            setGradeDropdown([]);
            setSubjectDropdown([]);
            setChapterDropdown([]);
        }
    };

    const handleGrade = (event, value) => {
        setFilterData({ ...filterData, grade: '', subject: '', chapter: '' });
        if (value && filterData.branch) {
            setFilterData({ ...filterData, grade: value, subject: '', chapter: '' });
            axiosInstance.get(`${endpoints.lessonPlan.gradeSubjectMappingList}?branch=${filterData.branch.id}&grade=${value.grade_id}`)
                .then(result => {
                    if (result.data.status_code === 200) {
                        setSubjectDropdown(result.data.result);
                    }
                    else {
                        setAlert('error', result.data.message);
                        setSubjectDropdown([]);
                        setChapterDropdown([]);
                    }
                })
                .catch(error => {
                    setAlert('error', error.message);
                    setSubjectDropdown([]);
                    setChapterDropdown([]);
                })
        }
        else {
            setSubjectDropdown([]);
            setChapterDropdown([]);
        }
    };

    const handleSubject = (event, value) => {
        setFilterData({ ...filterData, subject: '', chapter: '' });
        if (filterData.grade && filterData.year && filterData.volume && value) {
            setFilterData({ ...filterData, subject: value, chapter: '' });
            if (value && filterData.branch && filterData.year && filterData.volume) {
                axiosInstance.get(`${endpoints.lessonPlan.chapterList}?gs_mapping_id=${value.id}&volume=${filterData.volume.id}&academic_year=${filterData.year.id}&branch=${filterData.grade.grade_id}`)
                    .then(result => {
                        if (result.data.status_code === 200) {
                            setChapterDropdown(result.data.result);
                        }
                        else {
                            setAlert('error', result.data.message);
                            setChapterDropdown([]);
                        }
                    })
                    .catch(error => {
                        setAlert('error', error.message);
                        setChapterDropdown([]);
                    })
            }
        }
        else {
            setChapterDropdown([]);
        }
    };

    const handleChapter = (event, value) => {
        setFilterData({ ...filterData, chapter: '' });
        if (value) {
            setFilterData({ ...filterData, chapter: value });
        }
    };

    const handleFilter = () => {
        if (filterData.chapter) {
            handlePeriodList(filterData.chapter.id);
            setFilterDataDown(filterData);
        } else {
            setAlert('error', 'No chapter selected!');
            setFilterDataDown({});
        }
    }

    useEffect(() => {
        axiosInstance.get(`${endpoints.communication.branches}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setBranchDropdown(result.data.data);
                } else {
                    setAlert('error', result.data.message);
                }
            }).catch(error => {
                setBranchDropdown('error', error.message);
            })

        axios.get(`${endpoints.lessonPlan.academicYearList}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setAcademicYearDropdown(result.data.result.results);
                } else {
                    setAlert('error', result.data.message);
                }
            }).catch(error => {
                setAlert('error', error.message);
            })

        axios.get(`${endpoints.lessonPlan.volumeList}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setVolumeDropdown(result.data.result.results);
                } else {
                    setAlert('error', result.data.message);
                }
            }).catch(error => {
                setAlert('error', error.message);
            })
    }, [])

    return (
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
            <Grid item xs={12} sm={4} className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleAcademicYear}
                    id='academic-year'
                    className="dropdownIcon"
                    value={filterData?.year}
                    options={academicYearDropdown}
                    getOptionLabel={(option) => option?.session_year}
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
            <Grid item xs={12} sm={4} className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleVolume}
                    id='volume'
                    className="dropdownIcon"
                    value={filterData?.volume}
                    options={volumeDropdown}
                    getOptionLabel={(option) => option?.volume_name}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant='outlined'
                            label='Volume'
                            placeholder='Volume'
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={4} className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleBranch}
                    id='branch'
                    className="dropdownIcon"
                    value={filterData?.branch}
                    options={branchDropdown}
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
            <Grid item xs={12} sm={4} className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleGrade}
                    id='grade'
                    className="dropdownIcon"
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
            <Grid item xs={12} sm={4} className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleSubject}
                    id='subject'
                    className="dropdownIcon"
                    value={filterData?.subject}
                    options={subjectDropdown}
                    getOptionLabel={(option) => option?.subject_name}
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
            <Grid item xs={12} sm={4} className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                <Autocomplete
                    style={{ width: '100%' }}
                    size='small'
                    onChange={handleChapter}
                    id='chapter'
                    className="dropdownIcon"
                    value={filterData?.chapter}
                    options={chapterDropdown}
                    getOptionLabel={(option) => option?.chapter_name}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant='outlined'
                            label='Chapter'
                            placeholder='Chapter'
                        />
                    )}
                />
            </Grid>
            {/* {!isMobile && <Grid item xs sm={4} />} */}
            <Grid item xs={12} sm={12}>
                <Divider />
            </Grid>
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
        </Grid>
    );
}

export default LessonViewFilters