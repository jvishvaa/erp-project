import React, { useState, useRef, createRef, useContext } from 'react'
import { Breadcrumb, Button, Divider, Form, Select } from 'antd';
// import type { UploadProps } from 'antd';
import './blog.css';
import { makeStyles, TextField } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import { DownOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import endpoints from 'config/endpoints';
import { X_DTS_HOST } from 'v2/reportApiCustomHost';
import Layout from 'containers/Layout';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import Loader from 'containers/sure-learning/hoc/loader';
import UploadModalBlog from './UploadModalBlog';



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
    media: {
        height: 240,
        objectFit: 'cover',
        width: '45%'
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


const activityDetailsApi = [
    { id: 4, level: "Intra Orchids Level" },
    { id: 1, level: "Branch Level" },
    { id: 2, level: "Grade Level" },
    { id: 3, level: "Section Level" },
]

const CreatePostActivity = () => {
    const formRef = createRef();
    const boardListData = useSelector((state) => state.commonFilterReducer?.branchList)
    const [maxWidth, setMaxWidth] = React.useState('lg');
    const classes = useStyles();
    const { Option } = Select;
    const history = useHistory();
    const [view, setView] = useState(false);
    const [listCount, setListCount] = useState('');
    const user_id = JSON.parse(localStorage.getItem('ActivityManagement')) || {};
    const [loading, setLoading] = useState(false);
    const [blogWallList, setBlogWallList] = useState([]);
    const [postList, setPostList] = useState([]);
    const [previewData, setPreviewData] = useState('');
    const [imageData, setImageData] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [boardId, setBoardId] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activityLevel, setActivityLevel] = useState('')
    const { setAlert } = useContext(AlertNotificationContext);
    const [assessmentReviewFile, setAssessmentReviewFile] = useState([]);
    const [activityId, setActivityId] = useState('')
    const fileRef = useRef()
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);


    const handleGoBack = () => {
        history.goBack()
    }

    const handleDescription = (event) => {
        setDescription(event.target.value);
    };

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const showModal = () => {
        setOpen(true)
    };

    const handleClearBoard = () => {
        setBoardId('');
    };

    const branchOptions = boardListData?.map((each) => {
        return (
            <Option key={each?.id} value={each?.branch?.id}>
                {each?.branch?.branch_name}
            </Option>
        );
    });


    const activityOptions = activityDetailsApi.map((each) => {
        return (
            <Option key={each.id} value={each?.level}>
                {each?.level}
            </Option>
        )
    })



    const handleBoard = (e, value) => {
        formRef.current.setFieldsValue({
            grade: null,
            subject: null
        })
        if (value) {
            setBoardId(value?.value);

        }
    };

    const handleActivityLevel = (e, value) => {
        formRef.current.setFieldsValue({
            grade: null,
        })
        if (value) {
            setActivityId(value?.id)
            setActivityLevel(value?.value)
        }
    }



    const dataPost = () => {
        setLoading(true)
        if (title.length === 0) {
            setLoading(false)
            setAlert('error', 'Please Add Title')
            return;
        }
        else if (!description) {
            setLoading(false)
            setAlert('error', 'Please Add Description')
            return;
        }
        else if (!activityLevel) {
            setLoading(false)
            setAlert('error', 'Please Add Activity Level')
            return;
        } else if (!assessmentReviewFile) {
            setLoading(false)
            setAlert('error', 'Please Add Files')
            return;
        } else if (!boardId) {
            setLoading(false)
            setAlert('error', 'Please Add Board')
        }
        else {
            const formData = new FormData();
            formData.append('name', title);
            formData.append('description', description);
            formData.append('file', assessmentReviewFile);
            formData.append('view_level', activityLevel);
            formData.append('user_id', user_id?.id);
            formData.append('branch_id', boardId);
            axios
                .post(`${endpoints.newBlog.postActivityCreateAPI}`, formData, {
                    headers: {
                        // Authorization: `${token}`,
                        'X-DTS-HOST': X_DTS_HOST,
                    },
                })
                .then((response) => {
                    setAlert('success', 'Post Activity Successfully Created');

                    setAssessmentReviewFile('')
                    setActivityLevel('')
                    setActivityId('')
                    setDescription('');
                    setTitle('');
                    history.push('/blog/wall');
                    setLoading(false);
                });

        }


    };




    const onFileChange = (event) => {
        setAssessmentReviewFile(...assessmentReviewFile, event.target.files[0])
    }

    const handleClearActivity = () => {
        setActivityId('')
        setActivityLevel("")
    }

    const handleRemoveUploadedFile = (index) => {
        const newFileList = uploadedFiles.slice();
        newFileList.splice(index, 1);
        setUploadedFiles(newFileList);
    };

    const handleUploadedFiles = (value) => {
        setUploadedFiles(value);
    };

    const handleShowModal = () => {
        if (!boardId) {
            setAlert('error', 'Please Select Branch')
            return;
        } else if(!activityId){
            setAlert('error','Please Select Activity Level')
            return
        }else if(!description){
            setAlert('error','Please Add Description')
            return
        }else if(!title){
            setAlert('error','Please Add Title')
            return
        }
        else {
            setShowUploadModal(true);
        }
    };

    const handleUploadModalClose = () => {
        setShowUploadModal(false);
    };



    return (
        <React.Fragment>
            <div>
                {loading && <Loader />}

                <Layout>
                    <div className='row th-16 py-3 px-2'>
                        <div className='col-md-8' style={{ zIndex: 2, display: 'flex', alignItems: 'center' }}>
                            <div>
                                <IconButton aria-label="back" onClick={handleGoBack}>
                                    <KeyboardBackspaceIcon style={{ fontSize: '20px', color: 'black' }} />
                                </IconButton>
                            </div>
                            <Breadcrumb separator='>'>
                                <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                                    Post Activities
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href='/dashboard' className='th-grey th-16'>
                                    Create Post Activities
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className='row' style={{ marginTop: '20px' }}>
                            <div className='col-12'>
                                <Divider orientation="left" orientationMargin="0">
                                    Create Post Activities
                                </Divider>
                            </div>
                            <div className='col-12'>
                                <Form id='filterForm' ref={formRef} layout={'horizontal'}>
                                    <div className='row align-items-center'>
                                        <div className='col-md-2 col-6 pl-0'>
                                            <div className='mb-2 text-left'>Branch</div>
                                            <Form.Item name='branch'>
                                                <Select
                                                    showSearch
                                                    placeholder='Select Branch'
                                                    getPopupContainer={(trigger) => trigger.parentNode}
                                                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                                                    placement='bottomRight'
                                                    suffixIcon={<DownOutlined className='th-grey' />}
                                                    dropdownMatchSelectWidth={false}
                                                    onChange={(e, value) => handleBoard(e, value)}
                                                    allowClear={true}
                                                    onClear={handleClearBoard}
                                                    optionFilterProp='children'
                                                    filterOption={(input, options) => {
                                                        return (
                                                            options.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                                            0
                                                        );
                                                    }}
                                                >
                                                    {branchOptions}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        {/* )} */}
                                        <div className='col-md-2 col-6 px-0'>
                                            <div className='mb-2 text-left'>Activity Level</div>
                                            <Form.Item name='level'>
                                                <Select
                                                    allowClear
                                                    placeholder='Select Activity Level'
                                                    showSearch
                                                    // disabled={user_level == 13}
                                                    optionFilterProp='children'
                                                    filterOption={(input, options) => {
                                                        return (
                                                            options.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                        );
                                                    }}
                                                    onChange={(e, value) => {
                                                        handleActivityLevel(e, value);
                                                    }}
                                                    onClear={handleClearActivity}
                                                    className='w-100 text-left th-black-1 th-bg-grey th-br-4'
                                                    bordered={true}
                                                >
                                                    {activityOptions}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className='col-12'>

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
                                                    <div className='col-12' style={{ display: 'flex', padding: '0.5rem 1rem' }}>
                                                        <Button onClick={handleShowModal} icon={<UploadOutlined />}>Upload</Button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </Form>
                            </div>

                        </div>

                    </div>

                    <UploadModalBlog
                        show={showUploadModal}
                        branchId={boardId}
                        title={title}
                        description={description}
                        view_level={activityLevel}
                        user_id={user_id?.id}
                        handleClose={handleUploadModalClose}
                        setUploadedFiles={handleUploadedFiles}
                    />

                </Layout>

            </div>

        </React.Fragment>
    )
}

export default CreatePostActivity