/* eslint-disable react/jsx-no-duplicate-props */
import React , { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { Grid, TextField, Button, useTheme } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Pagination from '@material-ui/lab/Pagination';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import CreateSubject from './create-subject'
import EditSubject from './edit-subject'
import Loading from '../../components/loader/loader';
import './master-management.css'
import SubjectCard from './subjects-card';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '95%',
    margin: '0 auto'
  },
  container: {
    maxHeight: '70vh',
  },
  columnHeader: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    fontSize: '1rem',
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
  { id: 'subject_name', label: 'Subject', minWidth: 100 },
  { id: 'created_by', label: 'Created by', minWidth: 100 },
  { id: 'desc', label: 'Description', minWidth: 100 },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    labelAlign: 'center',
  },
];


const SubjectTable = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = React.useState(1);
  const [subjects,setSubjects]=useState([])
  const [grades,setGrades]=useState([])
  const [openDeleteModal,setOpenDeleteModal]=useState(false)
  const [subjectId,setSubjectId]=useState()
  const [subjectName,setSubjectName]=useState('')
  const [addFlag,setAddFlag]=useState(false)
  const [editFlag,setEditFlag]=useState(false)
  const [tableFlag,setTableFlag]=useState(true)
  const [desc,setDesc]=useState('')
  const [delFlag,setDelFlag]=useState(false)
  const [pageCount,setPageCount]=useState()
  const [searchGrade,setSearchGrade]=useState('')
  const [searchSubject,setSearchSubject]=useState('')
  const [widthFlag,setWidthFlag]=useState(false)
  const [loading, setLoading] = useState(false);

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleGrade = (event, value) => {
    if(value)
    setSearchGrade(value.id)
    else
    setSearchGrade('')
  };

  const handleAddSubject=()=>{
    setTableFlag(false)
    setAddFlag(true)
    setEditFlag(false)
  }

  const handleEditSubject=(id,name,desc)=>{
    setTableFlag(false)
    setAddFlag(false)
    setEditFlag(true)
    setSubjectId(id)
    setSubjectName(name)
    setDesc(desc)
  }

  const handleGoBack=()=>{
    setTableFlag(true)
    setAddFlag(false)
    setEditFlag(false)
    setSearchGrade('')
    setSearchSubject('')
  }

  const handleDeleteSubject = (e) => {
      e.preventDefault()
      setLoading(true);
      axiosInstance.put(endpoints.masterManagement.updateSubject,{
        'is_delete': true,
        'subject_id': subjectId
      }).then(result=>{
      if (result.status === 200) {
        setDelFlag(!delFlag)
        setLoading(false);
        setAlert('success', result.data.message);
      } else {
        setLoading(false);
        setAlert('error', result.data.message);
      }
      }).catch((error)=>{
        setLoading(false);
        setAlert('error', error.message);
      })
    setOpenDeleteModal(false)
  };

  const handleOpenDeleteModal = (id) => {
    setSubjectId(id)
    setOpenDeleteModal(true)
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  };

  useEffect(()=>{
    setLoading(true)
    setTimeout(()=> {setLoading(false)},450); 
  },[page,delFlag,editFlag,addFlag,searchGrade])

  useEffect(()=>{
      axiosInstance.get(`${endpoints.masterManagement.subjects}?page=${page}&page_size=15&grade=${searchGrade}&subject=${searchSubject}`)
      .then(result=>{
        if (result.status === 200) {
          setSubjects(result.data.result.results);
          setPageCount(result.data.result.total_pages)
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error)=>{
        setAlert('error', error.message);
      })

      axiosInstance.get(endpoints.masterManagement.gradesDrop)
      .then(result=>{
        if (result.status === 200) {
          setGrades(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error)=>{
        setAlert('error', error.message);
      })
  },[openDeleteModal,delFlag,editFlag,addFlag,page,searchGrade,searchSubject])
      
  const handleDelete = (subj) => {
    setSubjectName(subj.subject.subject_name);
    handleOpenDeleteModal(subj.subject.id)
  }
 
  return (
    <>
    {loading ? <Loading message='Loading...' /> : null}
   <Layout>
    <div className="headerMaster">
      <div style={{ width: '95%', margin: '30px auto' }}>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Subject List'
        />
      </div>
      <div className={classes.buttonContainer}>
      
      { (addFlag || editFlag) &&
        <Button startIcon={<ArrowBackIcon />} size="medium" title="Go back to Subject List" onClick={handleGoBack}>
        Subject List
        </Button>
      }
      </div>
    </div>
   
    {!tableFlag && addFlag && !editFlag && <CreateSubject grades={grades} setLoading={setLoading}/> }
    {!tableFlag && !addFlag && editFlag && <EditSubject id={subjectId} desc={desc} name={subjectName} setLoading={setLoading} handleGoBack={handleGoBack}/> }
    
    
    {tableFlag && !addFlag && !editFlag && 
    <Grid container spacing={1} style={{ width: '95%', margin: '0px auto 30px auto'}}>
      <Grid item xs={12} sm={3}>
        <TextField
        style={{ width: '100%' }}
          id='subname'
          label='Subject Name'
          variant='outlined'
          size='small'
          name='subname'
          autoComplete="off"
          className={widthFlag?"mainWidth widthClass":"mainWidth"}
          onFocus={e=>setWidthFlag(true)}
          onBlur={e=>setWidthFlag(false)}
          onChange={e=>setSearchSubject(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Autocomplete
        style={{ width: '100%' }}
          size='small'
          onChange={handleGrade}
          id='grade'
          className="gradeDropClass"
          options={grades}
          getOptionLabel={(option) => option.grade_name}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              variant='outlined'
              label='Grades'
              placeholder='Grades'
            />
          )}
        />
      </Grid>
      <Grid item xs={0} sm={3} />
      <Grid item xs={0} sm={3}>
      {tableFlag && !addFlag && !editFlag &&
        <Button startIcon={<AddOutlinedIcon />} size="medium" title="Add Subject" onClick={handleAddSubject}>
          Add Subject
        </Button>
      }
        </Grid>
    </Grid>
    }

    <>
    {
      !isMobile
      ? <>
      {tableFlag && !addFlag && !editFlag && 
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
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
            {subjects.map((subject, index) => {
              return (
                <TableRow hover subject='checkbox' tabIndex={-1} key={index}>
                    <TableCell className={classes.tableCell}>
                      {subject.subject.subject_name}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {subject.subject.created_by}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {subject.subject.subject_description}
                    </TableCell>
                    <TableCell
                      className={classes.tableCell}
                    >
                      <IconButton
                        onClick={e=>handleEditSubject(subject.subject.id,subject.subject.subject_name,subject.subject.subject_description)}
                        title='Edit Subject'
                      >
                        <EditOutlinedIcon color='primary' />
                      </IconButton>
                      <IconButton
                      onClick={e=>{ handleDelete(subject) }}
                        title='Delete Subject'
                      >
                        <DeleteOutlinedIcon color='primary' />
                      </IconButton>
                    </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer> 
    </Paper>
    }
      </>
      : <>
      <>
      {tableFlag && !addFlag && !editFlag && 
      <>
      {
        subjects.map(subject => (
          <SubjectCard data={subject} handleDelete={handleDelete} handleEditSubject={handleEditSubject} />
        ))
      }
      </>
      }
      </>
      </>
    }
    </>
    <div className="paginate">
      {
        tableFlag && !addFlag && !editFlag && 
        <Pagination
        count={pageCount}
        color="primary"
        showFirstButton
        showLastButton
        page={page}
        onChange={handleChangePage}
        />
      }
    </div>
    <Dialog
      open={openDeleteModal}
      onClose={handleCloseDeleteModal}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
        Delete Subject
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
        {`Confirm Delete Subject ${subjectName}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCloseDeleteModal} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleDeleteSubject}>Confirm</Button>
      </DialogActions>
    </Dialog>
    
    </Layout>
    </>
  );
};

export default SubjectTable;
