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
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import CreateSectionMapping from './create-section-mapping';
import EditSectionMapping from './edit-section-mapping';
import Loading from '../../../components/loader/loader';
import '../master-management.css';
import SectionMappingCard from './section-mapping-card';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    boxShadow: 'none',
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
  { id: 'session_year', label: 'Session Year', minWidth: 100 },
  { id: 'branch_name', label: 'Branch', minWidth: 100 },
  { id: 'grade_name', label: 'Grade', minWidth: 100 },
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
  const [delFlag, setDelFlag] = useState(false);
  const [searchSection, setSearchSection] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [yearDisplay, setYearDisplay] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [academicYearList, setAcademicYearList] = useState([]);
  const limit = 15;
  const [goBackFlag, setGoBackFlag] = useState(false);

  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleAddSection = () => {
    setTableFlag(false);
    setAddFlag(true);
    setEditFlag(false);
    setSearchSection('');
  };

  const handleEditSection = (sec) => {
    setTableFlag(false);
    setAddFlag(false);
    setEditFlag(true);
    setSectionData(sec);
  };

  const handleGoBack = () => {
    setPage(1);
    setTableFlag(true);
    setAddFlag(false);
    setEditFlag(false);
    setGoBackFlag(!goBackFlag);
    setSearchSection('');
    setSearchYear('');
    setSectionData({});
  };

  const handleDeleteSection = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.deleteSectionMapping}${sectionId}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setDelFlag(!delFlag);
          setLoading(false);
          setAlert('success', result.data?.message || result.data?.msg);
        } else {
          setLoading(false);
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAlert('error', error.response.data.msg);
      });
    setOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (id, sec) => {
    setSectionId(id);
    setSectionName(sec?.section_name);
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
  }, [page, delFlag, goBackFlag]);

  useEffect(() => {
    axiosInstance
      .get(`${endpoints.masterManagement.academicYear}`)
      .then((result) => {
        if (result.data.status_code === 200) {
          setAcademicYearList(result.data?.result?.results);
        } else {
          setAlert('error', result.data.message || result.data.msg);
        }
      })
      .catch((error) => {
        setAlert('error', error.response.data.message || error.response.data.msg);
      });
  }, []);

  useEffect(() => {
    let url = `${endpoints.masterManagement.sectionMappingTable}?page=${page}&page_size=${limit}`;
    if (searchSection) url += `&section_name=${searchSection}`;
    if(searchYear)url += `&session_year=${searchYear}`;
    // if(searchGrade)url += `&grade_name=${searchGrade}`;
    // if(searchBranch)url += `&branch_name=${searchBranch}`;

    axiosInstance
      .get(url)
      .then((result) => {
        if (result.data.status_code === 200) {
          setTotalCount(result.data?.data?.count);
          setSections(result.data?.data?.results);
        } else {
          setAlert('error', result.data?.message || result.data?.msg);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, [delFlag, goBackFlag, page, searchSection, searchYear]);

  const handleAcademicYear = (event, value) => {
    setSearchYear('')
    setYearDisplay(value)
    if (value) {
      setPage(1);
      setSearchYear(value.id);
    }
  };

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Master Management'
              childComponentName='Section Mapping List'
              childComponentNameNext={
                addFlag && !tableFlag
                  ? 'Add Section Mapping'
                  : editFlag && !tableFlag
                  ? 'Edit Section Mapping'
                  : null
              }
            />
          </div>
        </div>

        {!tableFlag && addFlag && !editFlag && (
          <CreateSectionMapping setLoading={setLoading} handleGoBack={handleGoBack} />
        )}

        {!tableFlag && !addFlag && editFlag && (
          <EditSectionMapping
            sectionData={sectionData}
            handleGoBack={handleGoBack}
            setLoading={setLoading}
          />
        )}

        {tableFlag && !addFlag && !editFlag && (
          <Grid
            container
            spacing={isMobile ? 3 : 5}
            style={{ width: widerWidth, margin: wider }}
          >
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
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
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
              <Autocomplete
                size='small'
                onChange={handleAcademicYear}
                style={{ width: '100%' }}
                id='session-year'
                options={academicYearList}
                value={yearDisplay}
                getOptionLabel={(option) => option?.session_year}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Session Year'
                    placeholder='Session Year'
                  />
                )}
              />
            </Grid>
            <Grid item xs sm={6} className={isMobile ? 'hideGridItem' : ''} />
            <Grid item xs={12} sm={3} className={isMobile ? '' : 'addButtonPadding'}>
              <Button
                startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                variant='contained'
                color='primary'
                size='small'
                style={{ color: 'white' }}
                title='Add Section Mapping'
                onClick={handleAddSection}
              >
                Add Section Mapping
              </Button>
            </Grid>
          </Grid>
        )}
        {tableFlag && !addFlag && !editFlag && (
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
                  {sections.map((sect, index) => {
                    const {
                      id,
                      section,
                      grade: { grade_name },
                      acad_session: {
                        branch: { branch_name },
                        session_year: { session_year },
                      },
                    } = sect;
                    return (
                      <TableRow hover section='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          {session_year}
                        </TableCell>
                        <TableCell className={classes.tableCell}>{branch_name}</TableCell>
                        <TableCell className={classes.tableCell}>{grade_name}</TableCell>
                        <TableCell className={classes.tableCell}>
                          {section?.section_name}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {section?.created_by}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <IconButton
                            onClick={() => handleOpenDeleteModal(id, section)}
                            title='Delete Section Mapping'
                          >
                            <DeleteOutlinedIcon style={{ color: '#fe6b6b' }} />
                          </IconButton>

                          {/* <IconButton
                            onClick={() =>
                              handleEditSection(section)
                            }
                            title='Edit Section'
                          >
                            <EditOutlinedIcon style={{color:'#fe6b6b'}} />
                          </IconButton> */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className='paginateData'>
              <TablePagination
                component='div'
                count={totalCount}
                rowsPerPage={limit}
                page={page - 1}
                onChangePage={handleChangePage}
                rowsPerPageOptions={false}
              />
            </div>
          </Paper>
        )}
        {/* {isMobile && tableFlag && !addFlag && !editFlag && (
          <>
            <Container className={classes.cardsContainer}>
              {sections.map((section, i) => (
                <SectionMappingCard
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
            <div className='paginateData paginateMobileMargin'>
              <TablePagination
                component='div'
                count={totalCount}
                rowsPerPage={limit}
                page={page - 1}
                onChangePage={handleChangePage}
                rowsPerPageOptions={false}
              />
            </div>
          </>
        )} */}
        <Dialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby='draggable-dialog-title'
        >
          <DialogTitle
            style={{ cursor: 'move', color: '#014b7e' }}
            id='draggable-dialog-title'
          >
            Delete Section
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Confirm Delete Section Mapping`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal} className='labelColor cancelButton'>
              Cancel
            </Button>
            <Button color='primary' onClick={handleDeleteSection}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

export default SectionTable;
