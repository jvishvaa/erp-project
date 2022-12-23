import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import axios from 'axios';
import Loader from '../../components/loader/loader';


import {
    IconButton,
    Divider,
    makeStyles,
    Grid,
    Paper,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    Table,
    Drawer,
} from '@material-ui/core';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';

import Layout from 'containers/Layout';

import BookmarksIcon from '@material-ui/icons/Bookmarks';
import './styles.scss';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { FileProtectOutlined, CloseCircleOutlined, UserOutlined, FundViewOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button as ButtonAnt, Select, Input, Avatar, Modal, Table as TableAnt } from 'antd';



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


// interface DataType {
//     height: number;
//     weight: number;
//     bmi: number;
//     date: string;
// }


const dummyData = [
    { id: 1, height: 20, weight: 40, bmi: 23, date: '28th Dec' },
    { id: 2, height: 21, weight: 40, bmi: 33, date: '28th Dec' },
    { id: 3, height: 20, weight: 44, bmi: 23, date: '28th Dec' },

]

const tableData = { id: 1, student_name: 'Anam', erp_id: '221313131_OLV', grade: "grade 1", branch: 'Branch 1' }


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
    const erpData = dataes?.erp
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
    const [openBigModal, setOpenBigModal] = useState(false);
    const [checkBMIData, setCheckBMIData] = useState([])
    const [bmiDetails, setBmiDetails] = useState([])
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

    const columnsBigTable = [
        {
            title: <span className='th-white th-fw-700 '>Height(in meters)</span>,
            dataIndex: 'height',
            key: 'height',
            align: 'center',
            render: (text, row, index) => <a>{row?.bmi_details?.height}</a>,
            // render: (text) => <a>{text}</a>,
        },
        {
            title: <span className='th-white th-fw-700 '>Weight(in kgs)</span>,
            dataIndex: 'weight',
            key: 'weight',
            align: 'center',
            render: (text, row, index) => <a>{row?.bmi_details?.weight}</a>
        },
        {
            title: <span className='th-white th-fw-700 '>BMI</span>,
            dataIndex: 'bmi',
            key: 'bmi',
            align: 'center',
            render: (text, row, index) => <a>{row?.bmi_details?.bmi}</a>
        },
        {
            title: <span className='th-white th-fw-700 '>Date</span>,
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            render: (text, row, index) => <a>{moment(row?.bmi_details?.created_at).format("MMM Do YY")}</a>
        },
    ];

    // const columnsListTable = [
    //     {
    //         title: <span className='th-white th-fw-700 '>Title</span>,
    //         dataIndex: 'height',
    //         key: 'height',
    //         align: 'center',
    //         // render: (text) => <a>{text}</a>,
    //     },
    //     {
    //         title: <span className='th-white th-fw-700 '>ERP ID</span>,
    //         dataIndex: 'weight',
    //         key: 'weight',
    //         align: 'center'
    //     },
    //     {
    //         title: <span className='th-white th-fw-700 '>Submission Date</span>,
    //         dataIndex: 'bmi',
    //         key: 'bmi',
    //         align: 'center'
    //     },
    //     {
    //         title: <span className='th-white th-fw-700 '>Overall Score</span>,
    //         dataIndex: 'date',
    //         key: 'date',
    //         align: 'center'
    //     },
    //     {
    //         title: <span className='th-white th-fw-700 '>Actions</span>,
    //         dataIndex: 'date',
    //         key: 'date',
    //         align: 'center',
    //         render: (data) => (
    //             <>
    //                 <span style={{margin:'0.5rem 1rem'}}>
    //                     <ButtonAnt
    //                                             type="primary"
    //                                             icon={<FileProtectOutlined />}
    //                                             onClick={() => assignPage(response)}
    //                                             size={'medium'}>
    //                                             Check Review
    //                                         </ButtonAnt>
    //                 </span>
    //             </>
    //         )
    //     },
    // ];

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

    useEffect(() => {
        getAssinged()
    }, [currentPageAssigned, sudActId, boardId])
    const getAssinged = () => {
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
        }
    };
    useEffect(() => {
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

    let dummyArr = []
    const filterRound = (data) => {
        if (dummyArr.indexOf(data) !== -1) {
            return ""
        } else {
            dummyArr.push(data)
            return data
        }
    }

    const studentViewBMI = () => {
        setOpenBigModal(true)
        checkBMIFun()
    }

    const checkBMIFun = () => {
        setLoading(true)
        axios
            .get(`${endpoints.newBlog.checkBMIApi}?erp_id=${erpData}&user_level=${13}`, {
                headers: {
                    Authorization: `${token}`,
                    'X-DTS-HOST': X_DTS_HOST,
                }
            })
            .then((response) => {
                setCheckBMIData(response?.data?.result)
                showBMITable(response?.data?.result)
                setAlert('success', response?.data?.message)
                setLoading(false);
            })
    }

    const goDownload = () => {
        //will implement soon
    }

    const showBMITable = (data) => {
        setLoading(true)
        axios
            .get(`${endpoints.newBlog.getStudentBMIApi}?student_id=${data?.id}`, {
                headers: {
                    Authorization: `${token}`,
                    'X-DTS-HOST': X_DTS_HOST,
                }
            })
            .then((res) => {
                if (res.data?.status_code == 200) {
                    setBmiDetails(res?.data?.result)
                    setLoading(false)
                    setAlert('success', res?.data?.message)
                    setOpenBigModal(true)

                } else if (res?.data?.status_code == 400) {
                    setOpenBigModal(false)
                    setAlert('error', res?.data?.message)
                    setLoading(false)
                    setOpenBigModal(false)
                }
            })

    }


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
                    <div className='col-md-6' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0.5rem 2rem', fontWeight: 'bold' }}>
                        <ButtonAnt
                            type="primary"
                            size='medium'
                            onClick={studentViewBMI}
                            icon={<FundViewOutlined />}
                        >
                            View BMI
                        </ButtonAnt>
                    </div>
                    <Modal
                        title="BMI Details"
                        visible={openBigModal}
                        centered
                        open={openBigModal}
                        onOk={() => setOpenBigModal(false)}
                        onCancel={() => setOpenBigModal(false)}
                        width={1000}
                        footer={null}
                    >
                        <div className='row'>
                            {/* <div className='col-12' style={{ display: 'flex', borderRadius: '10px', padding: '0.5rem 1rem' }}>
                                <div className='col-3'>
                                    Name : {tableData?.student_name}
                                </div>
                                <div className='col-3'>
                                    ERP ID :{tableData?.erp_id}
                                </div>
                                <div className='col-3'>
                                    Branch : {tableData?.branch}
                                </div>
                                <div className='col-3'>
                                    Grade: {tableData?.grade}
                                </div>

                            </div> */}
                            {/* <div className='col-12' style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem 1rem' }}>
                                <ButtonAnt
                                    size='medium'
                                    type="primary"
                                    icon={<CloudDownloadOutlined />}
                                    onClick={goDownload}
                                >
                                    Download Report
                                </ButtonAnt>

                            </div> */}
                            <div className='col-12' style={{ padding: '1rem 1rem' }}>
                                <TableAnt
                                    className='th-table'
                                    rowClassName={(record, index) => `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                                    }
                                    pagination={false}
                                    // loading={loading}
                                    columns={columnsBigTable} dataSource={bmiDetails} />

                            </div>
                        </div>
                    </Modal>
                </Grid>
                {/* <div className='row'>
                    <div className='col-12'>
                        <TableAnt
                            className='th-table'
                            rowClassName={(record, index) => `'th-pointer ${index % 2 === 0 ? 'th-bg-grey' : 'th-bg-white'}`
                            }
                            pagination={false}
                            loading={loading}
                            columns={columnsListTable} dataSource={totalSubmitted} />

                    </div>
                </div> */}
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

                                    <TableCell className={classes.tableCell}>Submission Date</TableCell>
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
                                    >
                                        <TableCell className={classes.tableCells}>{index + 1}</TableCell>
                                        <TableCell className={classes.tableCells}>
                                            {' '}
                                            {response?.activity_detail?.title}
                                        </TableCell>
                                        <TableCell className={classes.tableCells}>
                                            {' '}
                                            {response?.booked_user?.username}
                                        </TableCell>
                                        <TableCell className={classes.tableCells}>
                                            {' '}
                                            {response?.submitted_on?.substring(0, 10)}
                                        </TableCell>
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
                    <div style={{ width: '100%', padding: '10px' }}>
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
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', width: '100%', padding: '0.5rem 1rem', alignItems: 'center' }}>
                                            <div style={{ padding: '5px' }}>
                                                <Avatar size={40} aria-label="recipe" icon={<UserOutlined color='#f3f3f3' style={{ color: '#f3f3f3' }} twoToneColor="white" />}>
                                                </Avatar>
                                            </div>
                                            <div style={{ padding: '0 0.5rem' }}>
                                                <div style={{ fontWeight: 600, fontSize: '16px' }}>
                                                    {data?.booked_user?.name}
                                                </div>
                                                <div style={{ fontWeight: 500, fontSize: '14px' }}>
                                                    {data?.branch?.name}
                                                </div>
                                                <div style={{ fontWeight: 500, fontSize: '12px' }}>
                                                    {data?.grade?.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            background: '#f9f9f9',
                                            // margin: '1rem 2rem',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '5px',
                                            // marginTop: '10px',
                                            height: 'auto',
                                            border: '1px solid #dbdbdb',
                                            width: '36vw',
                                            overflowY:'auto',
                                            maxHeight:'16vh',
                                            margin:'auto'

                                        }}
                                    >
                                        <div
                                            style={{ display: 'flex', justifyContent: 'flex-start', fontWeight: 'bold', paddingLeft: '10px', marginTop: '10px' }}
                                        >
                                            <span style={{ fontWeight: 'normal', fontSize: '16px', }}>
                                                Title: {data?.activity_detail?.title}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                fontWeight: 'bold',
                                                paddingLeft: '10px',
                                                paddingBottom: '10px'
                                            }}
                                        >
                                            <span style={{ fontWeight: 'normal', color: 'gray', fontSize: '12px' }}>
                                                Description: {data?.activity_detail?.description}
                                            </span>
                                        </div>
                                    </div>
                                    <Divider  style={{margin:'1.5rem 0.5rem'}}/>
                                    <div style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '17px', paddingLeft: '34px', paddingTop:'10px'}}>Review</div>
                                    <div
                                        style={{

                                            width: '502px',
                                            marginLeft: '34px',
                                            height: 'auto',
                                            marginTop: '12px',
                                            marginBottom: '29px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                border: '1px solid #d9d9d9',
                                                borderRadius: '5px',
                                                height: 'auto',
                                                padding: '0.5rem',
                                                background: '#f4f5f9',
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
                                                            ""
                                                        ) : (
                                                            <div
                                                                key={index}
                                                                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
                                                            >
                                                                {' '}
                                                                {obj?.name}<b style={{ color: '#53bedd', fontSize: '12px' }}>{filterRound(obj?.level)}</b>
                                                            </div>
                                                        )}
                                                        {/* {obj} */}
                                                        {obj?.name == 'Overall' ? (
                                                            ""
                                                        ) : (
                                                            <div>

                                                                <Input
                                                                    placeholder={obj?.name}
                                                                    value={obj?.remarks}

                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
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
                                                        {obj?.name == "Overall" ? (
                                                            <div>
                                                                {obj?.name}
                                                                <Input placeholder={obj?.name}
                                                                    value={obj?.remarks}
                                                                />
                                                            </div>

                                                        ) : (
                                                            ""

                                                        )}
                                                    </div>

                                                )
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
