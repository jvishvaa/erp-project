import React, { useState, useRef, useEffect, useContext, createRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import Loader from '../../components/loader/loader';


import {
    IconButton,
    Divider,
    TextField,
    Button,
    SvgIcon,
    makeStyles,
    Typography,
    Grid,
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
    InputAdornment,
    DialogActions,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import Layout from 'containers/Layout';
import Close from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Box from '@material-ui/core/Box';
import { useTheme, withStyles } from '@material-ui/core/styles';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import ForumIcon from '@material-ui/icons/Forum';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DialogContentText from '@material-ui/core/DialogContentText';
import CloseIcon from '@material-ui/icons/Close';
import './styles.scss';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { PieChartOutlined, IdcardOutlined, DownOutlined, FileProtectOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button as ButtonAnt, Form, Select, message, Input } from 'antd';

import {
    AppstoreAddOutlined,
    SearchOutlined,
} from '@ant-design/icons';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '90vw',
        width: '95%',
        margin: '20px auto',
        marginTop: theme.spacing(4),
        boxShadow: 'none',
    },
    searchTable: {
        fontSize: '12px',
        whiteSpace: 'nowrap',
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    dividerColor: {
        backgroundColor: `${theme.palette.primary.main} !important`,
    },
    container: {
        maxHeight: '70vh',
        maxWidth: '90vw',
    },
    columnHeader: {
        color: `${theme.palette.secondary.main} !important`,
        fontWeight: 600,
        fontSize: '1rem',
        backgroundColor: `#ffffff !important`,
    },

    tableCell: {
        color: 'black !important',
        backgroundColor: '#ADD8E6 !important',
    },
    tableCells: {
        color: 'black !important',
        backgroundColor: '#F0FFFF !important',
    },
    vl: {
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        height: '45px',
    },
    buttonColor: {
        color: `${theme.palette.primary.main} !important`,
        // backgroundColor: 'white',
    },
    tabStyle: {
        color: 'white !important',
        backgroundColor: `${theme.palette.primary.main} !important`,
    },
    tabStatic: {
        position: 'static',
        paddingLeft: '19px',
        paddingRight: '39px',
        paddingTop: '36px',
    },
    buttonColor1: {
        color: 'grey !important',
        backgroundColor: 'white',
    },
    buttonColor2: {
        color: `${theme.palette.primary.main} !important`,
        backgroundColor: 'white',
    },
    selected1: {
        background: `${theme.palette.primary.main} !important`,
        color: 'white !important',
        borderRadius: '4px',
    },
    selected2: {
        background: `${theme.palette.primary.main} !important`,
        color: 'white !important',
        borderRadius: '4px',
    },
    tabsFont: {
        '& .MuiTab-wrapper': {
            color: 'white',
            fontWeight: 'bold',
        },
    },
    tabsFont1: {
        '& .MuiTab-wrapper': {
            color: 'black',
            fontWeight: 'bold',
        },
    },
}));




const StudentSidePhysicalActivity = () => {
    const boardListData = useSelector((state) => state.commonFilterReducer?.branchList)
    const branch_update_user = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
    const userIdLocal = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
    const classes = useStyles();
    const history = useHistory();
    const { setAlert } = useContext(AlertNotificationContext);
    const [gradeData, setGradeData] = useState([]);
    const [gradeName, setGradeName] = useState();
    const [moduleId, setModuleId] = React.useState('');
    const [month, setMonth] = React.useState('1');
    const [status, setStatus] = React.useState('');
    const [mobileViewFlag, setMobileViewFlag] = useState(window.innerWidth < 700);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [selectedBranchIds, setSelectedBranchIds] = useState('');
    const [gradeList, setGradeList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState([]);
    const [selectedGradeIds, setSelectedGradeIds] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [sectionList, setSectionList] = useState([]);
    const [selectedSection, setSelectedSection] = useState([]);
    const [selectedSectionIds, setSelectedSectionIds] = useState('');
    const [drawer, setDrawer] = useState(false);
    const [drawers, setDrawers] = useState(false);
    const [value, setValue] = useState(0);
    const [maxWidth, setMaxWidth] = React.useState('lg');
    const [preview, setPreview] = useState(false);
    const [totalCountUnassign, setTotalCountUnassign] = useState(0);
    const [currentPageUnassign, setCurrentPageUnassign] = useState(1)
    const [totalPagesUnassign, setTotalPagesUnassign] = useState(0);
    const [limitUnassign, setLimitUnassign] = useState(10);
    const [isClickedUnassign, setIsClickedUnassign] = useState(false);
    const [totalCountAssigned, setTotalCountAssigned] = useState(0);
    const [currentPageAssigned, setCurrentPageAssigned] = useState(1)
    const [boardId, setBoardId] = useState();
    const [totalPagesAssigned, setTotalPagesAssigned] = useState(0);
    const [limitAssigned, setLimitAssigned] = useState(10);
    const [isClickedAssigned, setIsClickedAssigned] = useState(false);
    const [searchFlag, setSearchFlag] = useState(false)
    const [loading, setLoading] = useState(false);
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    let dataes = JSON.parse(localStorage.getItem('userDetails')) || {};
    const physicalActivityId = JSON.parse(localStorage.getItem('PhysicalActivityId'))
    // const newBranches = JSON.parse(localStorage.getItem('ActivityManagementSession')) || {};
    const [subjectData, setSubjectData] = useState([]);
    const token = dataes?.token;
    const user_level = dataes?.user_level;
    const { Option } = Select;
    const selectedAcademicYear = useSelector(
        (state) => state.commonFilterReducer?.selectedYear
    );
    const [subActivityId, setSubActivityId] = useState('')
    const [sudActId, setSubActId] = useState(history?.location?.state?.subActiveId);
    const [subActivityListData, setSubActivityListData] = useState([])
    const ActivityId = JSON.parse(localStorage.getItem('PhysicalActivityId')) || {};
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalSubmitted, setTotalSubmitted] = useState([]);
    const [dataId, setDataId] = useState();
    const [ratingReview, setRatingReview] = useState([]);

    useEffect(() => {
        setLoading(true)
        if (NavData && NavData.length) {
            NavData.forEach((item) => {
                if (
                    item.parent_modules === 'Activity Management' &&
                    item.child_module &&
                    item.child_module.length > 0
                ) {
                    item.child_module.forEach((item) => {
                        if (
                            item.child_name === 'Blog Activity'
                            &&
                            window.location.pathname === '/blog/wall/central/redirect'
                        ) {
                            setModuleId(item.child_id);
                            localStorage.setItem('moduleId', item.child_id);
                            setLoading(false)
                        }
                        // if (
                        //   item.child_name === 'Create Rating' 
                        //     // &&
                        //     // window.location.pathname === '/erp-online-class-student-view'
                        // ) {
                        //   setModuleId(item.child_id);
                        //   localStorage.setItem('moduleId', item.child_id);
                        // }
                    });
                }
            });
        }
    }, [window.location.pathname]);

    const handleCloseViewMore = () => {
        setView(false);
    };




    const [view, setView] = useState(false);
    const [branchView, setBranchView] = useState(true);
    const [branchSearch, setBranchSearch] = useState(true);
    const [branchList, setBranchList] = useState([]);

    const [data, setData] = useState('');
    const [assigned, setAssigned] = useState(false);
    const [userId, setUserId] = useState('');
    const todayDate = moment();


    const [unassingeds, setUnAssigneds] = useState([]);
    const getUnAssinged = () => {
        const branchIds = selectedBranch.map((obj) => obj.id);
        setLoading(true)
        axios
            .get(
                `${endpoints.newBlog.unAssign}?section_ids=null&user_id=null&branch_ids=${branchIds}&is_draft=true&page=${currentPageUnassign}&page_size=${limitUnassign}`,
                {
                    headers: {
                        'X-DTS-HOST': X_DTS_HOST,
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setTotalCountUnassign(response?.data?.total)
                    setTotalPagesUnassign(response?.data?.page_size)
                    setCurrentPageUnassign(response?.data?.page)
                    setLimitUnassign(Number(limitUnassign))
                    setSearchFlag(false)
                    setUnAssigneds(response?.data?.result);
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            });
    };
    const [assingeds, setAssigneds] = useState([]);


    // useEffect(()=>{
    //   setAssigneds(dummyData)
    // },[])

    useEffect(() => {
        getAssinged()
    }, [currentPageAssigned, sudActId, boardId])
    const getAssinged = () => {
        // const branchIds = selectedBranch.map((obj) => obj.id);
        setLoading(true)
        axios
            .get(
                `${endpoints.newBlog.physicalActivityListApi}?section_ids=null&user_id=null&is_draft=false&page=${currentPageAssigned}&page_size=${limitAssigned}&activity_type=${sudActId ? sudActId : physicalActivityId}`, {
                params: {
                    ...(boardId ? { branch_ids: boardId } : {})
                },
                headers: {
                    'X-DTS-HOST': X_DTS_HOST,
                },
            }
            )
            .then((response) => {
                if (response?.status == 200) {
                    setTotalCountAssigned(response?.data?.total)
                    setTotalPagesAssigned(response?.data?.page_size)
                    setCurrentPageAssigned(response?.data?.page)
                    setLimitAssigned(Number(limitAssigned))
                    setSearchFlag(false)
                    setAssigneds(response?.data?.result);
                    // setAssigneds(dummyData)
                    setLoading(false)

                } else {
                    setAlert('error', 'Server Issue ')
                    setLoading(false)
                }
            });
    };

    useEffect(() => {
        if (moduleId && branch_update_user) {
            if (selectedAcademicYear?.id > 0)
                var branchIds = branch_update_user?.branches?.map((item) => item?.id)
            setLoading(true)
            axios
                .get(
                    `${endpoints.newBlog.activityBranch}?branch_ids=${branchIds}`,
                    {
                        headers: {
                            'X-DTS-HOST': X_DTS_HOST,
                        },
                    }
                )
                .then((response) => {
                    if (response?.data?.status_code === 200) {
                        setBranchList(response?.data?.result || [])
                        setLoading(false)

                    } else {
                        setLoading(false)
                    }
                });
        }

    }, [window.location.pathname, moduleId])


    const fetchBranches = async () => {
        const newBranches =
            (await JSON?.parse(localStorage?.getItem('ActivityManagementSession'))) || {};
        if (newBranches?.length !== undefined) {
            const transformedData = newBranches?.branches?.map((obj) => ({
                id: obj?.id,
                name: obj?.name,
            }));
            transformedData.unshift({
                name: 'Select All',
                id: 'all',
            });
            // setBranchList(transformedData);
        }
    };
    useEffect(() => {
        // ActvityLocalStorage();

        fetchBranches();
    }, []);


    useEffect(() => {
        if (selectedBranch?.length !== 0 && searchFlag) {
            getUnAssinged();
            getAssinged();
        }
    }, [value, selectedBranch, searchFlag, currentPageAssigned, currentPageUnassign]);
    const [previewData, setPreviewData] = useState();

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





    useEffect(() => {
        // fetchBoardListData()
        fetchSubActivityListData()
    }, [])

    const fetchSubActivityListData = () => {
        axiosInstance
            .get(`${endpoints.newBlog.subActivityListApi}?type_id=${sudActId ? sudActId : physicalActivityId}`, {
                headers: {
                    'X-DTS-HOST': X_DTS_HOST,
                },
            })
            .then((result) => {
                setLoading(false)
                console.log(result?.data?.result, 'sub')
                setSubActivityListData(result?.data?.result)
            })
    }

    const handleGoBack = () => {
        history.goBack()
    }

    useEffect(() => {
        getTotalSubmitted()
    }, [])

    const getTotalSubmitted = () => {
        // if(props){
        setLoading(true)
        axios
            .get(
                `${endpoints.newBlog.studentSideApi}?user_id=${userIdLocal?.id}&activity_type=${ActivityId}&activity_detail_id=null&is_reviewed=True&is_submitted=True`,
                {
                    headers: {
                        'X-DTS-HOST': X_DTS_HOST,
                    },
                }
            )
            .then((response) => {
                setTotalCount(response?.data?.count)
                setTotalPages(response?.data?.page_size)
                setCurrentPage(response?.data?.page)
                setLimit(Number(limit))
                setAlert('success', response?.data?.message)
                setTotalSubmitted(response?.data?.result);
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })

        // }
    };
    let array = []
    const getRatingView = (data) => {
        setLoading(true)
        axios
            .get(
                `${endpoints.newBlog.studentReviewss}?booking_detail_id=${data}`,
                {
                    headers: {
                        'X-DTS-HOST': X_DTS_HOST,
                    },
                }
            )
            .then((response) => {
                console.log(response, 'responses');
                response.data.map((obj, index) => {
                    let temp = {};
                    temp['id'] = obj.id;
                    temp['name'] = obj.level.name;
                    temp['remarks'] = obj.remarks;
                    temp['given_rating'] = obj.given_rating;
                    temp['level'] = obj?.level?.rating;
                    array.push(temp);
                });
                setRatingReview(array);
                setLoading(false)
            });
    };

    const assignPage = (data) => {
        if (data?.length !== 0) {
            setView(true);
            setData(data);
            setDataId(data?.id);
            getRatingView(data?.id)
        }
    };


    return (
        <div>
            {loading && <Loader />}
            <Layout>
                <Grid
                    container
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingLeft: '22px',
                        paddingBottom: '15px',
                    }}
                >
                    <div className='col-md-6' style={{ zIndex: 2, display: 'flex', alignItems: 'center' }}>
                        <div>
                            <IconButton aria-label="back" onClick={handleGoBack}>
                                <KeyboardBackspaceIcon style={{ fontSize: '20px', color: 'black' }} />
                            </IconButton>
                        </div>
                        <Breadcrumb separator='>'>
                            <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                                Physical Activity List
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </Grid>

                <Paper className={`${classes.root} common-table`} id='singleStudent'>
                    <TableContainer
                        className={`table table-shadow view_users_table ${classes.container}`}
                    >
                        <Table stickyHeader aria-label='sticky table'>
                            <TableHead className={`${classes.columnHeader} table-header-row`}>
                                <TableRow>
                                    <TableCell className={classes.tableCell} style={{ whiteSpace: 'nowrap' }}>
                                        S No.
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>Title</TableCell>
                                    <TableCell className={classes.tableCell}>ERP ID</TableCell>

                                    {/* <TableCell className={classes.tableCell}></TableCell> */}
                                    <TableCell className={classes.tableCell}>Submission Date</TableCell>
                                    {/* <TableCell className={classes.tableCell}>Reviewed By</TableCell> */}
                                    <TableCell className={classes.tableCell}>Overall Score</TableCell>
                                    <TableCell className={classes.tableCell}></TableCell>

                                    <TableCell className={classes.tableCell} style={{ width: '261px' }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            {totalSubmitted?.map((response, index) => (
                                <TableBody>
                                    <TableRow
                                        hover
                                        role='checkbox'
                                        tabIndex={-1}
                                    // key={`user_table_index${i}`}
                                    >
                                        <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                                        <TableCell className={classes.tableCells}>
                                            {' '}
                                            {response?.activity_detail?.title}
                                            {/* {response?.name} */}
                                        </TableCell>
                                        <TableCell className={classes.tableCells}>
                                            {' '}
                                            {response?.booked_user?.username}
                                        </TableCell>
                                        {/* <TableCell className={classes.tableCells}>GRADE 1</TableCell> */}
                                        <TableCell className={classes.tableCells}>
                                            {' '}
                                            {response?.submitted_on?.substring(0, 10)}
                                        </TableCell>
                                        {/* <TableCell className={classes.tableCells}>{response?.reviewer}</TableCell> */}
                                        <TableCell className={classes.tableCells}>
                                            {response?.user_reviews?.remarks}
                                        </TableCell>
                                        <TableCell className={classes.tableCells}>
                                            {' '}
                                            {response?.is_bookmarked == true ? (
                                                <BookmarksIcon style={{ color: 'gray' }} />
                                            ) : (
                                                ''
                                            )}
                                        </TableCell>

                                        <TableCell className={classes.tableCells}>
                                            <ButtonAnt
                                                type="primary"
                                                icon={<FileProtectOutlined />}
                                                onClick={() => assignPage(response)}
                                                size={'medium'}>
                                                Check Review
                                            </ButtonAnt>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ))}
                        </Table>
                        {/* <TablePagination
                component='div'
                count={totalCount}
                rowsPerPage={limit}
                page={Number(currentPage) - 1}
                onChangePage={(e, page) => {
                handlePagination(e, page + 1);
                }}
                rowsPerPageOptions={false}
                className='table-pagination'
                classes={{
                spacer: classes.tablePaginationSpacer,
                toolbar: classes.tablePaginationToolbar,
                }}
            /> */}
                    </TableContainer>
                </Paper>

                <Drawer
                    anchor='right'
                    maxWidth={maxWidth}
                    open={view}
                    onClose={handleCloseViewMore}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <div style={{ width: '100%', marginTop: '72px' }}>
                        <div style={{ fontSize: '24px', marginLeft: '6px', display: 'flex', justifyContent: 'space-between' }}>
                            <strong>Preview</strong>
                            <strong onClick={handleCloseViewMore} style={{ cursor: 'pointer', marginRight: '10px' }} >
                                <CloseCircleOutlined />
                            </strong>
                        </div>
                        <Divider />

                        <Grid container direction='row' justifyContent='center'>
                            <Grid item>
                                <div
                                    style={{
                                        // border: '1px solid #813032',
                                        // width: '583px',
                                        background: 'white',
                                        height: 'auto',
                                    }}
                                >
                                    <div
                                        style={{
                                            background: 'white',
                                            width: '554px',
                                            marginLeft: '13px',
                                            marginTop: '5px',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <img
                                                src='https://image3.mouthshut.com/images/imagesp/925725664s.png'
                                                width='130'
                                                alt='image'
                                            />
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    ERP Id :
                                                    <span style={{ fontWeight: 'normal' }}>
                                                        {data?.booked_user?.username}{' '}
                                                    </span>
                                                </div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    Name :
                                                    <span style={{ fontWeight: 'normal' }}>
                                                        {data?.booked_user?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            background: 'white',
                                            width: '502px',
                                            marginLeft: '34px',
                                            marginTop: '16px',
                                            height: 'auto',
                                        }}
                                    >
                                        <div
                                            style={{ paddingLeft: '30px', paddingTop: '7px', fontWeight: 'bold' }}
                                        >
                                            Title:{' '}
                                            <span style={{ fontWeight: 'normal' }}>
                                                {data?.activity_detail?.title}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                paddingLeft: '30px',
                                                paddingTop: '10px',
                                                paddingBottom: '5px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Description:
                                            <span style={{ fontWeight: 'normal' }}>
                                                {data?.activity_detail?.description}
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            background: 'white',
                                            width: '502px',
                                            marginLeft: '34px',
                                            height: 'auto',
                                            marginTop: '12px',
                                            marginBottom: '29px',
                                        }}
                                    >
                                        <div style={{ paddingTop: '12px' }}>

                                            <Grid item>
                                            </Grid>
                                        </div>
                                        <div
                                            style={{
                                                border: '1px solid #707070',
                                                borderRadius: '10px',
                                                height: 'auto',
                                                padding: '0.5rem'
                                            }}
                                        >
                                            {ratingReview?.map((obj, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            paddingLeft: '15px',
                                                            paddingRight: '15px',
                                                            paddingTop: '5px',
                                                        }}
                                                    >
                                                        {obj?.name === 'Overall' ? (
                                                            <div
                                                                key={index}
                                                                style={{ display: 'flex', justifyContent: 'space-between' }}
                                                            >
                                                                {obj.name}*
                                                            </div>
                                                        ) : (
                                                            <div
                                                                key={index}
                                                                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
                                                            >
                                                                {' '}
                                                                {/* <> */}
                                                                {obj?.name}<b>({obj?.level})</b>
                                                                {/* </> */}
                                                            </div>
                                                        )}
                                                        {/* {obj} */}
                                                        {obj?.name == 'Overall' ? (
                                                            <div>
                                                                <Input placeholder="Mandatory"
                                                                    //    onChange={(event) => handleInputCreativity(event, index)}
                                                                    value={obj?.remarks}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div>

                                                                <Input
                                                                    placeholder={obj?.name}
                                                                    // onChange={(event) => handleInputCreativity(event, index)}
                                                                    value={obj?.remarks}

                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    marginRight: '10px',
                                                    marginLeft: '6px',
                                                    marginBottom: '15px',
                                                    marginTop: '32px',
                                                }}
                                            >
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row-reverse',
                                        paddingTop: '9px',
                                    }}
                                >

                                    &nbsp;
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Drawer>

            </Layout>
        </div>
    );
};
export default StudentSidePhysicalActivity;
