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
import Autocomplete from '@material-ui/lab/Autocomplete';
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
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import CreateSection from './create-section'
import EditSection from './edit-section'
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
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  }
}));

const columns = [
  { id: 'section_name', label: 'Section', minWidth: 100 },
  { id: 'created_by', label: 'Created by', minWidth: 100 },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    labelAlign: 'center',
  },
];


const SectionTable = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [page, setPage] = React.useState(1);
  const [sections,setSections]=useState([])
  const [openDeleteModal,setOpenDeleteModal]=useState(false)
  const [sectionId,setSectionId]=useState()
  const [sectionName,setSectionName]=useState('')
  const [addFlag,setAddFlag]=useState(false)
  const [editFlag,setEditFlag]=useState(false)
  const [tableFlag,setTableFlag]=useState(true)
  const [grades,setGrades]=useState([])
  const [dataCount,setDataCount]=useState()
  const [delFlag,setDelFlag]=useState(false)
  const [searchGrade,setSearchGrade]=useState('')
  const [searchSection,setSearchSection]=useState('')
  const [widthFlag,setWidthFlag]=useState(false)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleGrade = (event, value) => {
    if(value)
    setSearchGrade(value.id)
    else
    setSearchGrade('')
  };

  const handleAddSection=()=>{
    setTableFlag(false)
    setAddFlag(true)
    setEditFlag(false)
  }

  const handleEditSection=(id,name)=>{
    setTableFlag(false)
    setAddFlag(false)
    setEditFlag(true)
    setSectionId(id)
    setSectionName(name)
  }

  const handleGoBack=()=>{
    setTableFlag(true)
    setAddFlag(false)
    setEditFlag(false)
  }

  const handleDeleteSection = () => {
    axiosInstance.put(endpoints.masterManagement.updateSection,{
      'section_id': sectionId,
      'is_delete': true,
    },{
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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
    setSectionId(id)
    setOpenDeleteModal(true)
    };

    const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    };

    useEffect(()=>{
      axiosInstance.get(`${endpoints.masterManagement.sections}?page=${page}&page_size=15&section=${searchSection}&grade=${searchGrade}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(result=>{
        if (result.status === 200) {
          setSections(result.data.result.results);
          setDataCount(result.data.result.count)
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error)=>{
        setAlert('error', error.message);
      })

      axiosInstance.get(endpoints.masterManagement.gradesDrop,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
  },[openDeleteModal,delFlag,addFlag,editFlag,page,searchGrade,searchSection])


  return (
    <Layout>
    {(addFlag||editFlag)  && 
    <div style={{float:'right',marginTop:'15px',marginRight:'15px'}}>
      <Button startIcon={<ArrowBackIcon />} size="large" title="Go back to Section List" onClick={handleGoBack}>
        Section List
      </Button>
    </div>
    }
    {!tableFlag && addFlag && !editFlag && <CreateSection grades={grades}/> }
    {!tableFlag && !addFlag && editFlag && <EditSection id={sectionId} name={sectionName} handleGoBack={handleGoBack}/> }

    {tableFlag && !addFlag && !editFlag && 
    <div className="headerMaster">
    <div style={{color:'#014B7E'}}>
      <h1>Section List</h1>
    </div>
    <div className={classes.buttonContainer}>
      <Button startIcon={<AddOutlinedIcon />} onClick={handleAddSection}>
        Add Section
      </Button>
    </div>
    </div>
    }
    {tableFlag && !addFlag && !editFlag && 
    <Grid container spacing={4} style={{marginBottom:'10px'}}>
      <Grid item xs={12} sm={3}>
        <TextField
          id='secname'
          label='Section Name'
          className={widthFlag?"mainWidth widthClass":"mainWidth"}
          onFocus={e=>setWidthFlag(true)}
          onBlur={e=>setWidthFlag(false)}
          variant='outlined'
          size='medium'
          name='secname'
          onChange={e=>setSearchSection(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Autocomplete
          size='medium'
          onChange={handleGrade}
          id='grade'
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
            {sections.map((section, index) => {
              return (
                <TableRow hover section='checkbox' tabIndex={-1} key={index}>
                    <TableCell className={classes.tableCell}>
                      {section.section.section_name}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {section.section.created_by}
                    </TableCell>
                    <TableCell
                      className={classes.tableCell}
                    >
                      <IconButton
                        onClick={e=>handleEditSection(section.section.id,section.section.section_name)}
                        title='Edit Section'
                      >
                        <EditOutlinedIcon color='primary' />
                      </IconButton>
                      <IconButton
                         onClick={e=>{setSectionName(section.section.section_name);handleOpenDeleteModal(section.section.id);}}
                        title='Delete Section'
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
        Delete Section
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
        {`Confirm Delete Section ${sectionName}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCloseDeleteModal} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleDeleteSection}>Confirm</Button>
      </DialogActions>
    </Dialog>

    </Layout>
  );
};

export default SectionTable;
