import React , { useContext, useState ,useEffect} from 'react';
import { Grid, TextField, Button, useTheme, Switch, FormControlLabel, Divider } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Autocomplete from '@material-ui/lab/Autocomplete';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const CreateTopic = ({grades,setLoading,handleGoBack}) => {
    const { setAlert } = useContext(AlertNotificationContext);
    const [subjectName,setSubjectName]=useState('')
    const [description,setDescription]=useState('')
    const [selectedGrade,setSelectedGrade]=useState([])
    const [selectedSection,setSelectedSection]=useState([])
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
    const [sections,setSections]=useState([])
    const [optional,setOptional] = useState(false)
    const [academicYearDropdown,setAcademicYearDropdown]=useState([]);
    const [volumeDropdown,setVolumeDropdown]=useState([]);
    const [branchDropdown, setBranchDropdown]=useState([]);
    const [gradeDropdown,setGradeDropdown]=useState([]);
    const [subjectDropdown,setSubjectDropdown]=useState([]);
    const [chapterDropdown, setChapterDropdown] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState('');
    const [topicName,setTopicName]=useState([]);
    //const [noOfChapter,setNoOfChapter]=useState([]);
    const {role_details}=JSON.parse(localStorage.getItem('userDetails'))

    const [filterData, setFilterData] = useState({
        year: '',
        volume: '',
        grade: '',
        subject: '',
        chapter: '',
    });
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    const [moduleId, setModuleId] = useState('');

    useEffect(() => {
        if (NavData && NavData.length) {
          NavData.forEach((item) => {
            if (
              item.parent_modules === 'Master Management' &&
              item.child_module &&
              item.child_module.length > 0
            ) {
              item.child_module.forEach((item) => {
                if (item.child_name === 'Chapter Creation') {
                  setModuleId(item.child_id);
                }
              });
            }
          });
        }
    }, []);

    useEffect(() => {
        axiosInstance.get(`${endpoints.masterManagement.academicYear}`)
        .then(result => {
            if (result.data.status_code === 200) {
                setAcademicYearDropdown(result.data.result.results);
            } else {
                setAlert('error', result.data.message);
            }
        }).catch(error => {
            setAlert('error', error.message);
        })

    // axiosInstance.get(`${endpoints.masterManagement.volumes}`)
    //     .then(result => {
    //         if (result.data.status_code === 200) {
    //             setVolumeDropdown(result.data.result.results);
    //         } else {
    //             setAlert('error', result.data.message);
    //         }
    //     }).catch(error => {
    //         setAlert('error', error.message);
    //     })
    }, [])

    useEffect(() => {
        if(filterData.branch) {
            axiosInstance.get(`${endpoints.academics.grades}?branch_id=${filterData.branch?.branch?.id}&module_id=${moduleId}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setGradeDropdown(result.data.data);
                } else {
                    setAlert('error', result.data.message);
                }
            }).catch(error => {
                setAlert('error', error.message);
            })
        }
    },[filterData])

    useEffect(() => {
        if(filterData.year.id && filterData.subject.id)
        {
            axiosInstance.get(`${endpoints.masterManagement.chapter}?subject=${filterData.subject.id}`)
            .then((res) => {
                console.log(res.data, 'chapter')
                setChapterDropdown(res.data.result);
            })
            .catch((error) => console.log(error));
        }
    },[filterData]);

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('hi',filterData.chapter.id,topicName,filterData.year.id)

    setLoading(true);
        const params ={
            chapter:filterData.chapter.id,
            topic_name: topicName.replace(/\//g, "")
        }
      axiosInstance.post(`${endpoints.masterManagement.createTopic}`,params)
      .then(result=>{
      if (result.data.status_code === 200) {
        setFilterData({
          year: '',
          volume: '',
          branch: '',
          grade: '',
          subject: '',
          chapter: '',
      });
        setTopicName('')
        //setNoOfChapter('')
        setLoading(false)
        setAlert('success', result.data.message)
      } else {
        setLoading(false);
        setAlert('error',result.data.description ? result.data.description : result.data.message)
      }
      }).catch((error)=>{
        setLoading(false);
        setAlert('error', error.message)
      })
    };

    const handleAcademicYear = (event, value) => {
        setFilterData({ ...filterData, year: '' });
        if (value) {
            setFilterData({ ...filterData, year: value });
            axiosInstance.get(
                `${endpoints.academics.branches}?session_year=${value.id}&module_id=${moduleId}`
            )
            .then((result) => {
                if (result.status === 200) {
                    setBranchDropdown(result.data.data.results);
                } else {
                    setAlert('error', result.data.message);
                }
            })
            .catch((error) => {
                setAlert('error', error.message);
            });
        }
    };

    const handleBranch = (event, value) => {
        setFilterData({ ...filterData, branch: '' });
        if (value) {
            setFilterData({ ...filterData, branch: value });
        }
    };

    const handleVolume = (event, value) => {
        setFilterData({ ...filterData, volume: '' });
        if (value) {
            setFilterData({ ...filterData, volume: value });
        }
    };


  const handleGrade = (event, value) => {
    setFilterData({ ...filterData, grade: '' });
    if (value) {
        setFilterData({ ...filterData, grade: value });
        axiosInstance.get(`${endpoints.masterManagement.subjects}?grade=${value.grade_id}&branch_id=${filterData.branch?.branch?.id}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setSubjectDropdown(result.data.data.results);
                }
                else {
                    setAlert('error', result.data.message);
                    setSubjectDropdown([]);
                }
            })
            .catch(error => {
                setAlert('error', error.message);
                setSubjectDropdown([]);
            })
    }
    else {
        setSubjectDropdown([]);
    }
    };
    const handleSubject = (event, value) => {
        setFilterData({ ...filterData, subject: '' });
        if (value) {
            setFilterData({ ...filterData, subject: value });
        }
    };

    const handleChapter = (event, value) => {
        setFilterData({ ...filterData, chapter: '' });
        if (value) {
            setFilterData({ ...filterData, chapter: value });
        }
    };

    return (
        <form autoComplete='off' onSubmit={handleSubmit}>
            <div style={{ width: '95%', margin: '20px auto'}}>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
                        <Autocomplete
                            size='small'
                            onChange={handleAcademicYear}
                            style={{ width: '100%' }}
                            id='grade'
                            options={academicYearDropdown}
                            value={filterData.year}
                            getOptionLabel={(option) => option?.session_year}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant='outlined'
                                    label='Academic Year'
                                    placeholder='Academic Year'
                                    required
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
                        <Autocomplete
                            size='small'
                            onChange={handleBranch}
                            style={{ width: '100%' }}
                            id='grade'
                            options={branchDropdown}
                            value={filterData.branch}
                            getOptionLabel={(option) => option?.branch?.branch_name}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant='outlined'
                                    label='Branch'
                                    placeholder='Branch'
                                    required
                                />
                            )}
                        />
                    </Grid>

                    {/* <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
                        <Autocomplete
                            size='small'
                            onChange={handleVolume}
                            style={{ width: '100%' }}
                            id='grade'
                            options={volumeDropdown}
                            value={filterData.volume}
                            getOptionLabel={(option) => option?.volume_name}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant='outlined'
                                    label='Volume'
                                    placeholder='Volume'
                                    required
                                />
                            )}
                        />
                    </Grid> */}
                    <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
                        <Autocomplete
                            size='small'
                            onChange={handleGrade}
                            style={{ width: '100%' }}
                            id='grade'
                            options={gradeDropdown}
                            value={filterData.grade}
                            getOptionLabel={(option) => option?.grade__grade_name}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant='outlined'
                                    label='Grades'
                                    placeholder='Grades'
                                    required
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
                        <Autocomplete
                            size='small'
                            onChange={handleSubject}
                            style={{ width: '100%' }}
                            id='grade'
                            options={subjectDropdown}
                            value={filterData.subject}
                            getOptionLabel={(option) => option?.subject_name}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant='outlined'
                                    label='Subject'
                                    placeholder='Subject'
                                    required
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
                        <Autocomplete
                            size='small'
                            onChange={handleChapter}
                            style={{ width: '100%' }}
                            id='grade'
                            options={chapterDropdown}
                            value={filterData.chapter}
                            getOptionLabel={(option) => option?.chapter_name}
                            filterSelectedOptions
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant='outlined'
                                    label='Chapter'
                                    placeholder='Chapter'
                                    required
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12} sm={4} className={isMobile?'':'addEditPadding'}>
                        <TextField
                            id='topic-name'
                            style={{ width: '100%' }}
                            label='Topic Name'
                            variant='outlined'
                            size='small'
                            value={topicName}
                            placeholder='Enter Topic Name'
                            inputProps={{accept:'^[a-zA-Z0-9 +_-]+',maxLength:100}}
                            //inputProps={{pattern:'^[a-zA-Z0-9]+',maxLength:100}}
                            name='topic-name'
                            onChange={e=>setTopicName(e.target.value)}
                            required
                        />
                    </Grid>
                </Grid>
            </div>
            <Grid container spacing={isMobile?1:5} style={{ width: '95%', margin: '10px'}} >
                <Grid item xs={6} sm={2} className={isMobile?'':'addEditButtonsPadding'}>
                    <Button variant='contained' className="custom_button_master labelColor" size='medium' onClick={handleGoBack}>
                        Back
                    </Button>
                </Grid>
                <Grid item xs={6} sm={2} className={isMobile?'':'addEditButtonsPadding'}> 
                    <Button variant='contained' style={{color:'white'}} color ="primary" className="custom_button_master" size='medium' type='submit'>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default CreateTopic;
