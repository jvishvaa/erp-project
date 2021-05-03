/* eslint-disable react/jsx-no-duplicate-props */
import React , { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import CreateTopic from './CreateTopic';
import EditTopic from './EditTopic';
import Loading from '../../../components/loader/loader';
import '../master-management.css'
import SubjectCard from './subjects-card';
import ClearAllIcon from '@material-ui/icons/ClearAll';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: '0 auto',
    boxShadow:'none'
  },
  container: {
    maxHeight: '70vh',
    width: '100%'
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
  buttonContainer: {
    width: '95%',
    margin: '0 auto',
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
  }
}));

const columns = [
  { 
    id: 'subject_name',
    label: 'Topic Name',
    minWidth: 100 ,
    align: 'center',
    labelAlign: 'center',
  },
  { 
    id: 'created_by',
    label: 'Chapter Name',
    minWidth: 100 ,
    align: 'center',
    labelAlign: 'center',
  },
  // { 
  //   id: 'desc', 
  //   label: 'Description', 
  //   minWidth: 100 , 
  //   align: 'center',
  //   labelAlign: 'center',
  // },
  // {
  //   id: 'optional',
  //   label: 'Optional',
  //   minWidth: 50,
  //   align: 'center',
  //   labelAlign: 'center',
  // },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'center',
    labelAlign: 'center',
  },
];

const TopicTable = () => {
    const classes = useStyles();
    const { setAlert } = useContext(AlertNotificationContext);
    const [page, setPage] = useState(1);
    const [grades,setGrades]=useState([])
    const [openDeleteModal,setOpenDeleteModal]=useState(false)
    const [subjectName,setSubjectName]=useState('')
    const [addFlag,setAddFlag]=useState(false)
    const [editFlag,setEditFlag]=useState(false)
    const [tableFlag,setTableFlag]=useState(true)
    const [delFlag,setDelFlag]=useState(false)
    const [totalCount, setTotalCount] = useState(0);
    const [searchGrade,setSearchGrade]=useState('')
    const [searchSection,setSearchSection]=useState('')
    const [loading, setLoading] = useState(false)
    const [topicList, setTopicList] = useState([]);
    const [gradeDropdown,setGradeDropdown]=useState([]);
    const [subjectDropdown,setSubjectDropdown]=useState([]);
    const [chapterDropdown, setChapterDropdown] = useState([]);
    const [branchDropdown, setBranchDropdown]=useState([]);
    const [academicYearDropdown, setAcademicYearDropdown]=useState([]);

    const [chapterEditDetails,setChapterEditDetails]=useState([]);
    const [filterData, setFilterData] = useState({
        year: '',
        branch: '',
        grade: '',
        subject: '',
        chapter: '',
    });
    const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
    const [moduleId, setModuleId] = useState('');

    const [chapterId,setChapterId]=useState('');
    const topicUpdateApi='/topics/';

    const limit = 10;
    
    const [goBackFlag,setGoBackFlag]=useState(false)
    const {role_details}=JSON.parse(localStorage.getItem('userDetails'))
    const themeContext = useTheme();
    const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

    const wider= isMobile?'-10px 0px':'-10px 0px 20px 8px'
    const widerWidth=isMobile?'98%':'95%'


    const handleChangePage = (event, newPage) => {
        setPage(newPage+1)
    };

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
        if(moduleId){
            axiosInstance.get(`${endpoints.masterManagement.academicYear}?module_id=${moduleId}`)
            .then(result => {
                if (result.data.status_code === 200) {
                    setAcademicYearDropdown(result.data.result.results);
                } else {
                    setAlert('error', result.data.message);
                }
            }).catch(error => {
                setAlert('error', error.message);
            })
        }
    },[moduleId])

    useEffect(() => {
        console.log(filterData.branch, 'branch')
        if(filterData.branch){
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
    },[filterData]);

    useEffect(() => {
        if(filterData.subject.id)
        {
            axiosInstance.get(`${endpoints.masterManagement.chapter}?subject=${filterData.subject.id}`)
            .then((res) => {
                if(res.data.status_code === 200){
                    setChapterDropdown(res.data.result);
                } else {
                    setAlert('error', res.data.message)
                }
            })
            .catch((error) => setAlert('error', error.message));
        }
    },[filterData]);

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
            //setFilterData({ ...filterData, chapter: ''});
        }
    };

    const handleChapter = (event, value) => {
        setFilterData({ ...filterData, chapter: '' });
        if (value) {
            setFilterData({ ...filterData, chapter: value });
        }
    };

    const handleClearFilter = () => {
        setFilterData({
            grade: '',
            subject: '',
            chapter: '',
        })
    }

    const handleAddSubject=()=>{
        setTableFlag(false)
        setAddFlag(true)
        setEditFlag(false)
    }

    const handleEditSubject=(subject)=>{
        setTableFlag(false)
        setAddFlag(false)
        setEditFlag(true)
        setChapterEditDetails(subject)
    }
    const handleGoBack=()=>{
        setPage(1)
        setTableFlag(true)
        setAddFlag(false)
        setEditFlag(false)
        setSearchGrade('')
        setSearchSection('')
        setGoBackFlag(!goBackFlag)
    }

    const handleDeleteTopic = (e) => {
        e.preventDefault()
        setLoading(true);

        axiosInstance.delete(`${endpoints.masterManagement.updateTopic}${chapterId}${topicUpdateApi}`)
            .then(result=>{
            if (result.data.status_code === 200) {
                setDelFlag(!delFlag)
                setLoading(false);
                setAlert('success', result.data.message);
            } else {
                setLoading(false);
                setAlert('error',result.data.message)
            }
            }).catch((error)=>{
                setLoading(false)
                setAlert('error', error.message)
            })
        setOpenDeleteModal(false)
    };

    const handleOpenDeleteModal = (id) => {
        // setSubjectId(id)
        setChapterId(id)
        setOpenDeleteModal(true)
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false)
    };

    useEffect(()=>{
        setLoading(true)
        setTimeout(()=> {setLoading(false)},450); 
    },[goBackFlag,page,delFlag,searchGrade,searchSection])

    useEffect(() => {
        setLoading(true);
        if(filterData.chapter.id){
            axiosInstance.get(`${endpoints.masterManagement.createTopic}?chapter=${filterData.chapter.id}&page=${page}&page_size=${limit}`)
            .then((res) => {
                console.log(res.data,'topic');
                if (res.data.status_code === 200) {
                    setLoading(false);
                    let count = res.data.result.results ? res.data.result.results.length : 0;
                    setTotalCount(res.data.result.count? res.data.result.count : count);
                    setTopicList(res.data.result.results);
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
        } else {
            axiosInstance.get(`${endpoints.masterManagement.createTopic}?page_size=${limit}&page=${page}`)
            .then((res) => {
                //console.log(res.data,'topic');
                if (res.data.status_code === 200) {
                    setLoading(false);
                    setTotalCount(res.data.result.count);
                    setTopicList(res.data.result.results);
                } else {
                    setLoading(false);
                    setAlert('error', res.data.message);
                }
            })
            .catch((error) => {
                //console.log(error);
                setLoading(false);
                setAlert('error', error.message);
            });
        }
    },[page, delFlag, goBackFlag, filterData]);
      
    const handleDelete = (topic) => {
        setSubjectName(topic.topic_name);
        handleOpenDeleteModal(topic.id)
    }
 
    return (
    <>
        {loading ? <Loading message='Loading...' /> : null}
        <Layout>
            <div style={{ width: '95%', margin: '20px auto' }}>
                <CommonBreadcrumbs
                    componentName='Master Management'
                    childComponentName='Topic List'
                    childComponentNameNext={(addFlag&&!tableFlag)?'Add Topic':(editFlag&&!tableFlag)?'Edit Chapter':null}
                />
            </div>
   
            {!tableFlag && addFlag && !editFlag && <CreateTopic grades={grades} setLoading={setLoading} handleGoBack={handleGoBack}/> }
            {!tableFlag && !addFlag && editFlag && <EditTopic topicData={chapterEditDetails} setLoading={setLoading} handleGoBack={handleGoBack}/> }
            
            
            {tableFlag && !addFlag && !editFlag && 
            <>
                <Grid container spacing={isMobile?3:5} style={{ width: widerWidth, margin: wider}}>
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
                    <Grid item xs sm={12} className={isMobile?'hideGridItem':''}/>
                    <Grid item xs={6} sm={3} className={isMobile?'':'addButtonPadding'}>
                        <Button 
                            startIcon={<ClearAllIcon style={{fontSize:'30px'}}/>} 
                            variant='contained' 
                            color='primary' 
                            size="small" 
                            style={{color:'white'}} 
                            title="Add Subject" 
                            onClick={handleClearFilter}
                        >
                            Clear Filter
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={3} className={isMobile?'':'addButtonPadding'}>
                        <Button 
                            startIcon={<AddOutlinedIcon style={{fontSize:'30px'}}/>} 
                            variant='contained' 
                            color='primary' 
                            size="small" 
                            style={{color:'white'}} 
                            title="Add Subject" 
                            onClick={handleAddSubject}
                        >
                            Add Topic
                        </Button>
                    </Grid>
                </Grid>
            </>}

            <>
                {!isMobile?
                    <>
                        {tableFlag && !addFlag && !editFlag && 
                        <Paper className={`${classes.root} common-table`}>
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
                                    <TableBody>
                                        {topicList.map((topic, index) => {
                                            return (
                                            <TableRow hover subject='checkbox' tabIndex={-1} key={index}>
                                                <TableCell className={classes.tableCell}>
                                                    {topic.topic_name}
                                                </TableCell>
                                                <TableCell className={classes.tableCell}>
                                                    {topic.chapter?.chapter_name}
                                                </TableCell>
                                                <TableCell className={classes.tableCell}>
                                                    <IconButton
                                                        onClick={e=>{ handleDelete(topic) }}
                                                        title='Delete Chapter'
                                                    >
                                                        <DeleteOutlinedIcon style={{color:'#fe6b6b'}} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={e=>handleEditSubject(topic)}
                                                        title='Edit Chapter'
                                                    >
                                                        <EditOutlinedIcon style={{color:'#fe6b6b'}} />
                                                    </IconButton>
                                                
                                                </TableCell>
                                            </TableRow>
                                        )})}
                                    </TableBody>
                                </Table>
                            </TableContainer> 
                            <div className="paginateData">
                                <TablePagination
                                    component='div'
                                    count={totalCount}
                                    className='customPagination'
                                    rowsPerPage={limit}
                                    page={page-1}
                                    onChangePage={handleChangePage}
                                    rowsPerPageOptions={false}
                                />
                            </div>
                        </Paper>}
                    </>:
                    <>
                        <>
                            {tableFlag && !addFlag && !editFlag && 
                                <>
                                    {topicList.map(topic => (
                                        <SubjectCard 
                                            data={topic} 
                                            handleDelete={handleDelete} 
                                            handleEditSubject={handleEditSubject} />
                                    ))}
                                    <div className="paginateData paginateMobileMargin">
                                        <TablePagination
                                            component='div'
                                            count={totalCount}
                                            rowsPerPage={limit}
                                            page={page-1}
                                            onChangePage={handleChangePage}
                                            rowsPerPageOptions={false}
                                            className='table-pagination'
                                        />
                                    </div>
                                </>
                            }
                        </>
                    </>}
                </>
                <Dialog
                    open={openDeleteModal}
                    onClose={handleCloseDeleteModal}
                    aria-labelledby='draggable-dialog-title'
                >
                    <DialogTitle style={{ cursor: 'move',color: '#014b7e' }} id='draggable-dialog-title'>
                        Delete Topic
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`Confirm Delete Topic : ${subjectName}`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteModal} className="labelColor cancelButton">Cancel</Button>
                        <Button color="primary" variant='contained' style={{color:'white'}} onClick={handleDeleteTopic}>Confirm</Button>
                    </DialogActions>
                </Dialog>
    
            </Layout>
        </>
    );
};

export default TopicTable;
