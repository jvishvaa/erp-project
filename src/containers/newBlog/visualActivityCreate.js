import React, { useState, useRef, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';

import {
    IconButton,
    Divider,
    TextField,
    Button,
    SvgIcon,
    makeStyles,
    Typography,
    Grid,
    Tooltip,
    MenuItem,
    TextareaAutosize,
    Paper,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    Table,
    Drawer,
    TablePagination,
    Select,
    Dialog,
    DialogTitle,
    Checkbox,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Layout from 'containers/Layout';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import Box from '@material-ui/core/Box';
import { useTheme, withStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useHistory } from 'react-router-dom';
import MyTinyEditor from 'containers/question-bank/create-question/tinymce-editor';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import './styles.scss';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import Loader from '../../components/loader/loader';
import Carousel from "react-elastic-carousel";
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import BackupIcon from '@material-ui/icons/Backup';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { Breadcrumb } from 'antd';

import {
    fetchBranchesForCreateUser as getBranches,
    fetchGrades as getGrades,
    fetchSections as getSections,
    fetchSubjects as getSubjects,
} from '../../redux/actions';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width: 300,
    },
    indeterminateColor: {
        color: '#f50057',
    },
    selectAllText: {
        fontWeight: 500,
    },
    selectedAll: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
        },
    },
    root: {
        maxWidth: '90vw',
        width: '95%',
        margin: '20px auto',
        marginTop: theme.spacing(4),
        boxShadow: 'none',
    },
    customFileUpload: {
        border: '1px solid black',
        padding: '6px 12px',

        cursor: 'pointer',
    },
    container: {
        maxHeight: '70vh',
        maxWidth: '90vw',
    },
    dividerColor: {
        backgroundColor: `${theme.palette.primary.main} !important`,
    },
    buttonColor: {
        color: `${theme.palette.secondary.main} !important`,
        backgroundColor: 'white',
    },
    buttonColor1: {
        color: `${theme.palette.primary.main} !important`,
        backgroundColor: 'white',
    },
    columnHeader: {
        color: `${theme.palette.secondary.main} !important`,
        fontWeight: 600,
        fontSize: '1rem',
        backgroundColor: `#ffffff !important`,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    tableCell: {
        color: theme.palette.secondary.main,
    },
    vl: {
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        height: '45px',
    },
    tickSize: {
        transform: "scale(2.0)",
    },
}));

const dummyRound = [
    { id: 1, round: 1, name: '1' },
    { id: 2, round: 2, name: '2' },
    { id: 3, round: 3, name: '3' },
    { id: 4, round: 4, name: '4' },
    { id: 5, round: 5, name: '5' },
]

const VisualActivityCreate = () => {
    const classes = useStyles();
    const themeContext = useTheme();
    let data = JSON.parse(localStorage.getItem('userDetails')) || {};
    const token = data?.token;
    const user_level = data?.user_level;
    const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
    const visualId = localStorage?.getItem('VisualActivityId') ? JSON.parse(localStorage?.getItem('VisualActivityId')) : '';
    const branch_update_user = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
    const history = useHistory();
    const [branchList, setBranchList] = useState([]);
    const [maxWidth, setMaxWidth] = React.useState('lg');
    const { setAlert } = useContext(AlertNotificationContext);
    const [loading, setLoading] = useState(false);

    const [assigned, setAssigned] = useState(false);

    const [sectionDropdown, setSectionDropdown] = useState([]);
    const [roundDropdown, setRoundDropdown] = useState(dummyRound)

    const [moduleId, setModuleId] = React.useState();
    const [month, setMonth] = React.useState('1');
    const [branches, setBranches] = useState([]);
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [status, setStatus] = React.useState('');
    const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
    const [subActivityListData, setSubActivityListData] = useState([])
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [selectedBranchIds, setSelectedBranchIds] = useState('');
    const [gradeList, setGradeList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState([]);
    const [selectedRound, setSelectedRound] = useState([]);
    const [selectedRoundID, setSelectedRoundID] = useState('');
    const [gradeIds, setGradeIds] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [sectionList, setSectionList] = useState([]);
    const [selectedSection, setSelectedSection] = useState([]);
    const [selectedSectionIds, setSelectedSectionIds] = useState('');
    const [desc, setDesc] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [activityName, setActivityName] = useState([]);
    const [changeText, setChangeText] = useState("");
    const [visible, setVisible] = useState(false);
    const [isPhysicalActivity, setIsPhysicalActivity] = useState(false);
    const [selectedFile, setSelectedFile] = useState('');
    const [subActivityName, setSubActivityName] = useState([])
    const [isVisualActivity, setIsVisualActivity] = useState(false);
    const [filterData, setFilterData] = useState({
        branch: '',
        grade: '',
        section: '',
    });
    const [sudActId, setSubActId] = useState(visualId);
    const [selectedSubActivityId, setSelectedSubActivityId] = useState('')

    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );
    const handleEditorChange = (content, editor) => {
        setDesc(content);
    };

    const handleSubActivity = (e, value) => {
        setVisible(false)
        setSelectedBranch([])
        setSelectedGrade([])
        setSelectedSection([])
        setIsPhysicalActivity(false)
        setIsVisualActivity(false)
        if (value) {
            setSubActivityName(value)
            setIsPhysicalActivity(true)
            setSelectedSubActivityId(value?.id)
            setVisible(true)

        }

    }

    const handleChangeActivity = (e, value) => {
        setActivityName([])
        setSelectedBranch([])
        setSelectedGrade([])
        setSelectedSection([])
        setIsPhysicalActivity(false)
        setVisible(false)
        if (value) {
            setVisible(true)
            setActivityName(value);
            if (value?.name == "Physical Activity") {
                setIsPhysicalActivity(true)
            } else if (value?.name === "Visual Act") {
                setIsVisualActivity(true)
            }
        }
    };
    const handleChangeText = (e, value) => {
        setChangeText(value);
    };


    const fetchBranches = () => {
        var branchIds = branch_update_user?.branches?.map((item) => item?.id)
        setLoading(true)
        axiosInstance
            .get(`${endpoints.newBlog.activityBranch}?branch_ids=${branchIds}`, {
                headers: {
                    'X-DTS-HOST': X_DTS_HOST,
                },
            })
            .then((res) => {
                setLoading(false)
                if (res?.data) {
                    const transformedData = res?.data?.result?.map((obj) => ({
                        id: obj.id,
                        name: obj.name,
                    }));
                    transformedData.unshift({
                        name: 'Select All',
                        id: 'all',
                    });
                    setBranchList(transformedData);
                    setLoading(false)
                }
            });
        // })
    };

    let allGradeIds = [];

    const fetchGrades = (value) => {
        const ids = value.map((el) => el.id) || [];
        setLoading(true)
        axiosInstance
            .get(`${endpoints.newBlog.activityGrade}?branch_ids=${ids}`, {
                headers: {
                    'X-DTS-HOST': X_DTS_HOST,
                },
            })
            .then((res) => {
                setLoading(false)
                if (res) {
                    setLoading(false)
                    const gradeData = res?.data?.result || [];
                    for (let i = 0; i < gradeData?.length; i++) {
                        allGradeIds.push(gradeData[i].id);
                    }
                    gradeData.unshift({
                        name: 'Select All',
                        id: allGradeIds,
                    });
                    setGradeList(gradeData);
                }
            });
    };

    useEffect(() => {
        fetchSubActivityListData()
    }, [])

    const fetchSubActivityListData = () => {
        axiosInstance
            .get(`${endpoints.newBlog.subActivityListApi}?type_id=${sudActId}`, {
                headers: {
                    'X-DTS-HOST': X_DTS_HOST,
                },
            })
            .then((result) => {
                setLoading(false)
                setSubActivityListData(result?.data?.result)
            })
    }

    const fetchSections = (value) => {
        if (value?.length !== 0) {
            const ids = value.map((el) => el.id) || [];
            setLoading(true)
            axiosInstance
                .get(`${endpoints.newBlog.activitySection}?grade_ids=${ids}`, {
                    headers: {
                        'X-DTS-HOST': X_DTS_HOST,
                    },
                })
                .then((result) => {
                    setLoading(false)
                    if (result.data) {
                        const gradeData = result?.data?.result || [];
                        gradeData.unshift({
                            name: 'Select All',
                            id: 'all',
                        });
                        setSectionDropdown(gradeData);
                    }
                });
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);
    const handleBranch = (e, value) => {
        setSelectedGrade([]);
        if (value) {
            value =
                value.filter(({ id }) => id === 'all').length === 1
                    ? [...branchList].filter(({ id }) => id !== 'all')
                    : value;
            setSelectedBranch(value);
            fetchGrades(value);
        }
        getTemplate(activityName.id);

    };

    const handleGrade = (e, value) => {
        if (value) {
            value =
                value.filter(({ name }) => name === 'Select All').length === 1
                    ? [...gradeList].filter(({ name }) => name !== 'Select All')
                    : value;
            setSelectedGrade(value);
            fetchSections(value);
        }
    };
    const handleSection = (e, value) => {
        if (value) {
            value =
                value.filter(({ id }) => id === 'all').length === 1
                    ? [...sectionDropdown].filter(({ id }) => id !== 'all')
                    : value;
            setSelectedSection(value);
        }
    };

    const handleRound = (e, value) => {
        if (value) {
            setSelectedRound(value)
            setSelectedRoundID(value?.id)
        }
    }

    const handleStartDateChange = (val) => {
        setStartDate(val);
    };
    let branchIdss = selectedBranch.map((obj, index) => obj?.name).join(', ');
    let branchname = [...branchIdss];
    let gradeIdss = selectedGrade.map((obj, index) => obj?.name).join(', ');
    let gradename = [...gradeIdss];
    let sectionIdss = selectedSection.map((obj, index) => obj?.name).join(', ');
    let sectionname = [...sectionIdss];

    const PreviewBlog = () => {
        setAssigned(true);
    };

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileUrl(URL.createObjectURL(event.target.files[0]));
    };
    const deleteSelectedImage = () => {
        setFileUrl(null);
        setSelectedFile(null);
    };
    const ActvityLocalStorage = () => {
        setLoading(true)
        axios
            .post(
                `${endpoints.newBlog.activityWebLogin}`,
                {},
                {
                    headers: {
                        Authorization: `${token}`,
                        'X-DTS-HOST': X_DTS_HOST,
                    },
                }
            )
            .then((response) => {
                getActivitySession();

                localStorage.setItem(
                    'ActivityManagement',
                    JSON.stringify(response?.data?.result)
                );
                setLoading(false);
            });
    };
    const handleClear = () => {
        setSelectedGrade([]);
        setSelectedBranch([]);
        setSelectedSection([]);
        setActivityName([]);
        setDescription('');
        setTitle('');
        setSelectedRound([])
        setStartDate('');
    };
    const formatdate = new Date();
    const hoursAndMinutes =
        'T' +
        formatdate.getHours() +
        ':' +
        formatdate.getMinutes() +
        ':' +
        formatdate.getSeconds();

    const dataPost = () => {
        setLoading(true)
        const branchIds = selectedBranch.map((obj) => obj?.id);
        const gradeIds = selectedGrade.map((obj) => obj?.id);
        const sectionIds = selectedSection.map((obj) => obj?.id);
        if (!startDate) {
            setLoading(false)
            setAlert('error', 'Please Select The Date')
            return;
        }
        if (branchIds?.length === 0) {
            setLoading(false)
            setAlert('error', 'Please Select Branch')
            return
        }
        if (gradeIds?.length === 0) {
            setLoading(false)
            setAlert('error', 'Please Select Grade')
            return;
        }
        if (sectionIds?.length === 0) {
            setLoading(false)
            setAlert('error', 'Please Select Section')
            return;
        }
        if (title.length === 0) {
            setLoading(false)
            setAlert('error', 'Please Add Title')
            return;
        }
        if (!description) {
            setLoading(false)
            setAlert('error', 'Please Add Description')
            return;
        }
        else {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('issue_date', null);
            formData.append('submission_date', startDate + hoursAndMinutes);
            formData.append('image', selectedFile);
            formData.append('activity_type_id', visualId);
            formData.append('session_year', selectedAcademicYear.session_year);
            formData.append('created_at', startDate + hoursAndMinutes);
            formData.append('created_by', user_id.id);
            formData.append('branch_ids', branchIds);
            formData.append('grade_ids', gradeIds);
            formData.append('section_ids', sectionIds);
            formData.append('is_draft', false);
            formData.append('template_type', "template");
            formData.append('template_id', checked);
            formData.append('round_count', selectedRoundID);
            axios
                .post(`${endpoints.newBlog.activityCreate}`, formData, {
                    headers: {
                        // Authorization: `${token}`,
                        'X-DTS-HOST': X_DTS_HOST,
                    },
                })
                .then((response) => {
                    setLoading(false);
                    setAlert('success', 'Activity Successfully Created');
                    setLoading(false);
                    setSelectedGrade([]);
                    setSelectedBranch([]);
                    setSelectedSection([]);
                    setActivityName([]);
                    setDescription('');
                    setTitle('');
                    setStartDate('');
                    history.push('/visual/activity')
                    return
                })
                .catch((error) => {
                    setAlert('error', error)
                })

        }


    };

    const [typeText, setTypeText] = useState([{ name: "text" }, { name: "template" }])

    const [activityCategory, setActivityCategory] = useState([]);
    const getActivityCategory = () => {
        setLoading(true)
        axios
            .get(`${endpoints.newBlog.getActivityType}`, {
                headers: {
                    'X-DTS-HOST': X_DTS_HOST,
                },
            })
            .then((response) => {
                setLoading(false)
                setActivityCategory(response.data.result);
            });
    };
    useEffect(() => {
        getActivityCategory();
    }, []);

    const [activityStorage, setActivityStorage] = useState([]);
    const getActivitySession = () => {
        setLoading(true)
        axios
            .post(
                `${endpoints.newBlog.activitySessionLogin}`,
                {},
                {
                    headers: {
                        'X-DTS-HOST': X_DTS_HOST,
                        Authorization: `${token}`,
                    },
                }
            )
            .then((response) => {

                setActivityStorage(response.data.result);

                localStorage.setItem(
                    'ActivityManagementSession',
                    JSON.stringify(response?.data?.result)
                );
                setLoading(false)
            });
    };
    const goBack = () => {
        history.push('/blog/blogview');
    }

    const closePreview = () => {
        setAssigned(false);
    };
    const [title, setTitle] = useState('');
    const handleTitle = (event) => {
        setTitle(event.target.value);
    };
    const [description, setDescription] = useState('');
    const handleDescription = (event) => {
        setDescription(event.target.value);
    };
    const [templates, setTemplates] = useState([]);

    const getTemplate = (data) => {
        if (data) {
            setLoading(true)
            axios
                .get(`${endpoints.newBlog.getTemplates}${data}/`, {
                    headers: {
                        'X-DTS-HOST': X_DTS_HOST,
                    },
                })
                .then((response) => {
                    setTemplates(response?.data?.result);
                    setLoading(false)

                });

        }
    };

    useEffect(() => {
        getTemplate()
    }, [selectedBranch, activityName]);

    const [checked, setChecked] = React.useState("");

    const handleChange = (event, value) => {
        setChecked(value);
    };

    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 2, itemsToScroll: 2 },
        { width: 768, itemsToShow: 3 },
        { width: 1200, itemsToShow: 4 }
    ];

    const handleGoBack = () => {
        history.goBack()
    }


    return (
        <div>

            {loading && <Loader />}
            <Layout>
                {loading && <Loader />}

                <Grid
                    container
                    direction='row'
                    style={{ paddingLeft: '22px', paddingRight: '10px' }}
                >
                </Grid>
                <div className='col-md-6' style={{ zIndex: 2, display: 'flex', alignItems: 'center' }}>
                    <div>
                        <IconButton aria-label="back" onClick={handleGoBack}>
                            <KeyboardBackspaceIcon style={{ fontSize: '20px', color: 'black' }} />
                        </IconButton>
                    </div>
                    <Breadcrumb separator='>'>
                        <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                            Activity Management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href='' className='th-grey th-16'>
                            Activity
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href='' className='th-grey th-16'>
                            Create Visual Art
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div style={{ paddingLeft: '22px', paddingRight: '10px' }}>

                    <Button
                        variant='primary'
                        style={{ borderRadius: '1px', color: 'white' }}
                        disabled
                    >
                        Create Visual Art
                    </Button>
                    <Divider className={classes.dividerColor} />
                </div>
                <div
                    style={{
                        paddingLeft: '22px',
                        paddingRight: '10px',
                        paddingTop: '50px',
                        fontSize: '15px',
                    }}
                >
                    <div
                        style={{
                            marginLeft: '9px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginRight: '6px',
                        }}
                    >
                        <div>
                            {' '}
                            Submission End Date *: &nbsp;&nbsp;&nbsp;
                            <TextField
                                required
                                size='small'
                                style={{ marginTop: '-6px' }}
                                onChange={(e) => handleStartDateChange(e.target.value)}
                                type='date'
                                value={startDate || ' '}
                                variant='outlined'
                            />
                        </div>
                    </div>
                    <Grid container spacing={2} style={{ marginTop: '23px' }}>
                        <Grid item md={6} xs={12}>
                            <Autocomplete
                                multiple
                                fullWidth
                                size='small'
                                limitTags={1}
                                // style={{ width: '82%', marginLeft: '4px' }}
                                options={branchList || []}
                                value={selectedBranch || []}
                                getOptionLabel={(option) => option?.name}
                                filterSelectedOptions
                                onChange={(event, value) => {
                                    handleBranch(event, value);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        fullWidth
                                        variant='outlined'
                                        label='Branch'
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Autocomplete
                                multiple
                                fullWidth
                                limitTags={1}
                                size='small'
                                className='filter-student meeting-form-input'
                                options={gradeList || []}
                                getOptionLabel={(option) => option?.name || ''}
                                filterSelectedOptions
                                value={selectedGrade || []}
                                onChange={(event, value) => {
                                    handleGrade(event, value);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        fullWidth
                                        variant='outlined'
                                        label='Grade'
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Autocomplete
                                multiple
                                fullWidth
                                limitTags={1}
                                size='small'
                                className='filter-student meeting-form-input'
                                options={sectionDropdown || []}
                                getOptionLabel={(option) => option?.name || ''}
                                filterSelectedOptions
                                value={selectedSection || []}
                                onChange={(event, value) => {
                                    handleSection(event, value);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        fullWidth
                                        variant='outlined'
                                        label='Section'
                                    />
                                )}
                            />
                        </Grid>

                    </Grid>
                    <div
                        style={{
                            border: '1px solid lightgrey',
                            borderRadius: '5px',
                            height: 'auto',
                            marginTop: '20px',
                        }}
                    >
                        <div style={{ marginTop: '23px', marginLeft: '73px', display: 'flex' }}>
                            Activity Details *: &nbsp;&nbsp;&nbsp;&nbsp;
                            <TextField
                                id='outlined-basic'
                                size='small'
                                fullWidth
                                value={title}
                                onChange={handleTitle}
                                style={{ maxWidth: '80%' }}
                                label='Title *'
                                variant='outlined'
                            />
                        </div>
                        <br />
                        <div
                            style={{
                                marginLeft: '13%',
                                marginRight: '8%',
                                marginBottom: '23px',
                            }}
                        >

                            <TextField
                                label='Description/Instructions *'
                                placeholder='Description/Instructions *'
                                multiline
                                value={description}
                                onChange={handleDescription}
                                fullWidth
                                style={{ maxWidth: '97%' }}
                                rows='8'
                                variant='outlined'
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            border: '1px solid lightgrey',
                            borderRadius: '5px',
                            height: 'auto',
                            marginTop: '20px',
                        }}
                    >
                    </div>
                    <div
                        style={{
                            marginTop: '60px',
                            marginLeft: '50px',

                            display: 'flex',
                        }}
                    >
                        <Button
                            variant='outlined'
                            className={classes.buttonColor}
                            size='medium'
                            onClick={goBack}
                        >
                            Back
                        </Button>{' '}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                            variant='outlined'
                            className={classes.buttonColor}
                            size='medium'
                            onClick={PreviewBlog}
                        >
                            Preview
                        </Button>{' '}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button
                            variant='outlined'
                            onClick={handleClear}
                            className={classes.buttonColor1}
                            size='medium'
                        >
                            Clear
                        </Button>{' '}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Button variant='contained' color='primary' disabled={user_level == 11} onClick={dataPost}>
                            Submit
                        </Button>
                    </div>
                </div>
                <Dialog open={assigned} maxWidth={maxWidth} style={{ borderRadius: '10px' }}>
                    <div style={{ width: '642px' }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '12px',
                            }}
                        >
                            <DialogTitle id='confirm-dialog'>Preview</DialogTitle>
                            <div style={{ marginTop: '21px', marginRight: '34px' }}>
                                <CloseIcon style={{ cursor: 'pointer' }} onClick={closePreview} />
                            </div>
                        </div>

                        <div
                            style={{
                                border: '1px solid lightgray',
                                height: ' auto',
                                // width: '100%',
                                marginLeft: '16px',
                                marginRight: '32px',
                                borderRadius: '10px',
                                marginBottom: '9px',
                            }}
                        >
                            <div style={{ marginLeft: '23px', marginTop: '28px' }}>
                                <div style={{ fontSize: '15px', color: '#7F92A3' }}>
                                    Title -{activityName.name}
                                </div>
                                <div style={{ fontSize: '21px' }}>{title}</div>
                                <div style={{ fontSize: '10px', color: '#7F92A3' }}>
                                    Submission on -{startDate}
                                </div>
                                <div style={{ fontSize: '10px', paddingTop: '10px', color: 'gray' }}>
                                    Branch -&nbsp;<span style={{ color: 'black' }}>{branchname}</span>
                                </div>
                                <div style={{ fontSize: '10px', color: 'gray' }}>
                                    Grade -&nbsp;<span style={{ color: 'black' }}>{gradename}</span>
                                </div>
                                <div style={{ fontSize: '10px', color: 'gray' }}>
                                    Section -&nbsp;<span style={{ color: 'black' }}>{sectionname}</span>
                                </div>

                                <div style={{ paddingTop: '16px', fontSize: '12px', color: '#536476' }}>
                                    {/* word limit -300 */}
                                </div>
                                <div style={{ paddingTop: '19px', fontSize: '16px', color: '#7F92A3' }}>
                                    Instructions
                                </div>
                                <div style={{ paddingTop: '8px', fontSize: '16px' }}>{description}</div>
                                <div style={{ paddingTop: '28px', fontSize: '14px' }}>
                                    <img src={fileUrl} width='50%' />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Layout>

        </div>
    );
};
export default VisualActivityCreate;
