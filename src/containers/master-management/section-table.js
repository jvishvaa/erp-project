/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
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
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import CreateSection from './create-section';
import EditSection from './edit-section';
import Loading from '../../components/loader/loader';
import './master-management.css';
import SectionCard from '../../components/section-card';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '70vh',
  },
  buttonContainer: {
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
  },
  cardsPagination: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '1rem',
    backgroundColor: '#ffffff',
    zIndex: 100,
  },
  centerInMobile: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
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
  const [page, setPage] = React.useState(1);
  const [sections, setSections] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [sectionId, setSectionId] = useState();
  const [sectionName, setSectionName] = useState('');
  const [addFlag, setAddFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [grades, setGrades] = useState([]);
  const [pageCount, setPageCount] = useState();
  const [delFlag, setDelFlag] = useState(false);
  const [searchGrade, setSearchGrade] = useState('');
  const [searchSection, setSearchSection] = useState('');
  const [widthFlag, setWidthFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(15);

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const wider= isMobile?'10px 0px 10px 0px':'20px 0px 20px 8px'
  const widerWidth=isMobile?'98%':'95%'

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangePageScreen = (event,value) => {
    setPage(value+1)
  }


  const handleGrade = (event, value) => {
    if (value) setSearchGrade(value.id);
    else setSearchGrade('');
  };

  const handleAddSection = () => {
    setTableFlag(false);
    setAddFlag(true);
    setEditFlag(false);
    setSearchGrade('');
    setSearchSection('');
  };

  const handleEditSection = (id, name) => {
    setTableFlag(false);
    setAddFlag(false);
    setEditFlag(true);
    setSectionId(id);
    setSectionName(name);
  };

  const handleGoBack = () => {
    setTableFlag(true);
    setAddFlag(false);
    setEditFlag(false);
  };

  const handleDeleteSection = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .put(endpoints.masterManagement.updateSection, {
        section_id: sectionId,
        is_delete: true,
      })
      .then((result) => {
        if (result.status === 200) {
          {
            setDelFlag(!delFlag);
            setLoading(false);
            setAlert('success', result.data.message);
          }
        } else {
          setLoading(false);
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.message);
      });
    setOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (id) => {
    setSectionId(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  }, [page, delFlag, editFlag, addFlag, searchGrade]);

  useEffect(() => {
    axiosInstance
      .get(
        `${endpoints.masterManagement.sections}?page=${page}&page_size=${limit}&section=${searchSection}&grade=${searchGrade}`
      )
      .then((result) => {
        if (result.status === 200) {
          setTotalCount(result.data.result.count);
          setSections(result.data.result.results);
          setPageCount(result.data.result.total_pages);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });

    axiosInstance
      .get(endpoints.masterManagement.gradesDrop)
      .then((result) => {
        if (result.status === 200) {
          setGrades(result.data.data);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, [openDeleteModal, delFlag, addFlag, editFlag, page, searchGrade, searchSection]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
      <div>
        <div style={{ width: '95%', margin: '20px auto' }}>
          <CommonBreadcrumbs
            componentName='Master Management'
            childComponentName='Section List'
          />
        </div>
      </div>

      {!tableFlag && addFlag && !editFlag && (
        <CreateSection grades={grades} setLoading={setLoading} handleGoBack={handleGoBack}/>
      )}

      {!tableFlag && !addFlag && editFlag && (
        <EditSection
          id={sectionId}
          name={sectionName}
          handleGoBack={handleGoBack}
          setLoading={setLoading}
        />
      )}

      {tableFlag && !addFlag && !editFlag && (
        <Grid container spacing={isMobile?3:5} style={{ width: widerWidth, margin: wider}}>
          <Grid item xs={12} sm={3}>
            <Box className={classes.centerInMobile}>
              <TextField
                id='secname'
                style={{ width: '100%' }}
                label='Section Name'
                variant='outlined'
                size='small'
                autoComplete='off'
                name='secname'
                onChange={(e) => setSearchSection(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box className={classes.centerInMobile}>
              <Autocomplete
                size='small'
                style={{ width: '100%' }}
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
            </Box>
          </Grid>
          <Grid item xs sm className={isMobile?'hideGridItem':''}/>
          <Grid item xs={12} sm={3}>
             <Button startIcon={<AddOutlinedIcon />}  variant='contained' color='primary' size="medium" style={{color:'white'}}  title="Add Section" onClick={handleAddSection}>
                Add Section
             </Button>
          </Grid>
        </Grid>
      )}
      {!isMobile && tableFlag && !addFlag && !editFlag && (
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
                  {sections.map((section, index) => {
                    return (
                      <TableRow hover section='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          {section.section.section_name}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {section.section.created_by}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <IconButton
                            onClick={(e) =>
                              handleEditSection(
                                section.section.id,
                                section.section.section_name
                              )
                            }
                            title='Edit Section'
                          >
                            <EditOutlinedIcon color='primary' />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              setSectionName(section.section.section_name);
                              handleOpenDeleteModal(section.section.id);
                            }}
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
            <TablePagination
              component='div'
              count={totalCount}
              rowsPerPage={limit}
              page={page - 1}
              onChangePage={handleChangePageScreen}
              rowsPerPageOptions={false}
              className='table-pagination'
            />
          </Paper>
        )}
        {isMobile && tableFlag && !addFlag && !editFlag && (
          <>
            <Container className={classes.cardsContainer}>
              {sections.map((section, i) => (
                <SectionCard
                  section={section.section}
                  onEdit={(section) => {
                    handleEditSection(section.id, section.section_name);
                  }}
                  onDelete={(section) => {
                    setSectionName(section.section_name);
                    handleOpenDeleteModal(section.id);
                  }}
                />
              ))}
            </Container>
            <div className='paginate'>
              <Pagination
                page={page}
                count={pageCount}
                showFirstButton
                showLastButton
                onChange={handleChangePage}
                color='primary'
                className='pagination-white'
              />
            </div>
          </>
        )}
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
    </>
  );
};

export default SectionTable;
