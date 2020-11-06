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
import { Grid, TextField, Button} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import CreateGrade from './create-grade'
import EditGrade from './edit-grade'
import './master-management.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
  }
}));

const columns = [
  { id: 'grade_name', label: 'Grade', minWidth: 100 },
  { id: 'grade_by', label: 'Type', minWidth: 100 },
  { id: 'created_by', label: 'Created by', minWidth: 100 },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    labelAlign: 'center',
  },
];


const GradeTable = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = React.useState(1);
  const [grades,setGrades]=useState([])
  const [openDeleteModal,setOpenDeleteModal]=useState(false)
  const [gradeId,setGradeId]=useState()
  const [gradeName,setGradeName]=useState('')
  const [gradeType,setGradeType]=useState('')
  const [addFlag,setAddFlag]=useState(false)
  const [editFlag,setEditFlag]=useState(false)
  const [tableFlag,setTableFlag]=useState(true)
  const [dataCount,setDataCount]=useState()
  const [delFlag,setDelFlag]=useState(false)
  const [searchGrade,setSearchGrade]=useState('')
  const [widthFlag,setWidthFlag]=useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleAddGrade=()=>{
    setTableFlag(false)
    setAddFlag(true)
    setEditFlag(false)
  }

  const handleEditGrade=(id,name,type)=>{
    setTableFlag(false)
    setAddFlag(false)
    setEditFlag(true)
    setGradeId(id)
    setGradeName(name)
    setGradeType(type)
  }

  const handleGoBack=()=>{
    setTableFlag(true)
    setAddFlag(false)
    setEditFlag(false)
  }

    const handleDeleteGrade = () => {
    axiosInstance.put(endpoints.masterManagement.updateGrade,{
      'is_delete': true,
      'grade_id': gradeId
    }).then(result=>{
    if (result.status === 200) {
      {
        setAlert('success', result.data.message);
        setDelFlag(!delFlag)
      }
    } else {
      setAlert('error', result.data.message);
    }
    }).catch((error)=>{
      setAlert('error', error.message);
    })
    setOpenDeleteModal(false)
    };

    const handleOpenDeleteModal = (id) => {
    setGradeId(id)
    setOpenDeleteModal(true)
    };

    const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    };

    useEffect(()=>{
      axiosInstance.get(`${endpoints.masterManagement.grades}?page=${page}&page_size=15&grade_name=${searchGrade}`)
      .then(result=>{
        if (result.status === 200) {
          {
            setGrades(result.data.result.results);
            setDataCount(result.data.result.count)
          }
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error)=>{
        setAlert('error', error.message);
      })
  },[openDeleteModal,delFlag,editFlag,addFlag,page,searchGrade])
  
  return (
    <Layout>
    <div className="headerMaster">
      <div>
        <CommonBreadcrumbs
          componentName='Master Management'
          childComponentName='Grade List'
        />
      </div>
      <div className={classes.buttonContainer}>
      {tableFlag && !addFlag && !editFlag &&
        <Button startIcon={<AddOutlinedIcon />} size="medium" title="Add Grade" onClick={handleAddGrade}>
          Add Grade
        </Button>
      }
      { (addFlag || editFlag) &&
        <Button startIcon={<ArrowBackIcon />} size="medium" title="Go back to Grade List" onClick={handleGoBack}>
          Grade List
        </Button>
      }
      </div>
    </div>

    {!tableFlag && addFlag && !editFlag && <CreateGrade /> }
    {!tableFlag && !addFlag && editFlag && <EditGrade id={gradeId} name={gradeName} type={gradeType} 
    handleGoBack={handleGoBack}/> }

    {tableFlag && !addFlag && !editFlag && 
      <Grid container spacing={4} style={{marginBottom:'10px'}}>
        <Grid item>
          <TextField
            id='gradename'
            className={widthFlag?"mainWidth widthClass":"mainWidth"}
            onFocus={e=>setWidthFlag(true)}
            onBlur={e=>setWidthFlag(false)}
            label='Grade Name'
            variant='outlined'
            size='medium'
            name='gradename'
            onChange={e=>setSearchGrade(e.target.value)}
          />
        </Grid>
      </Grid>
    }

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
            {grades.map((grade, index) => {
              return (
                <TableRow hover grade='checkbox' tabIndex={-1} key={index}>
                    <TableCell className={classes.tableCell}>
                      {grade.grade_name}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {grade.grade_type}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {grade.created_by}
                    </TableCell>
                    <TableCell
                      className={classes.tableCell}
                    >
                      <IconButton
                        onClick={e=>handleEditGrade(grade.id,grade.grade_name,grade.grade_type)}
                        title='Edit Grade'
                      >
                        <EditOutlinedIcon color='primary' />
                      </IconButton>
                      <IconButton
                         onClick={e=>{setGradeName(grade.grade_name);handleOpenDeleteModal(grade.id);}}
                        title='Delete Grade'
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
      <div className="paginate">
        <Pagination
        count={Math.ceil(dataCount/15)}
        color="primary"
        showFirstButton
        showLastButton
        page={page}
        onChange={handleChangePage}
        />
      </div>
    </Paper>
    }
    <Dialog
      open={openDeleteModal}
      onClose={handleCloseDeleteModal}
      aria-labelledby='draggable-dialog-title'
    >
      <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
        Delete Grade
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
        {`Confirm Delete Grade ${gradeName}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCloseDeleteModal} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleDeleteGrade}>Confirm</Button>
      </DialogActions>
    </Dialog>
    
    </Layout>
  );
};

export default GradeTable;
