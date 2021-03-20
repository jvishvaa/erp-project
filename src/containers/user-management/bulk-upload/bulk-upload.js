/* eslint-disable react/jsx-no-duplicate-props */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Grid, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import TablePagination from '@material-ui/core/TablePagination';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    boxShadow: 'none',
  },
  container: {
    maxHeight: '70vh',
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
  { id: 'data', label: 'Date - Time', minWidth: 100 },
  { id: 'success_count', label: 'Success Count', minWidth: 100 },
  { id: 'failure_count', label: 'Failure Count', minWidth: 100 },
  { id: 'uploaded_excel', label: 'Uploaded Excel', minWidth: 100 },
];

const BulkUpload = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = React.useState(1);
  const [academicYear, setAcademicYear] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchAcademicYear, setSearchAcademicYear] = useState('');
  const [searchBranch, setSearchBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(15);
  const [bulkData, setBulkData] = useState([]);
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));

  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
  const [moduleId, setModuleId] = useState('');

  useEffect(() => {
    if (NavData && NavData.length) {
      NavData.forEach((item) => {
        if (
          item.parent_modules === 'User Management' &&
          item.child_module &&
          item.child_module.length > 0
        ) {
          item.child_module.forEach((item) => {
            if (item.child_name === 'Bulk Upload Status') {
              setModuleId(item.child_id);
            }
          });
        }
      });
    }
  }, []);

  const wider = isMobile ? '-10px 0px' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleBranch = (event, value) => {
    setSearchBranch('');
    if (value) {
      setPage(1);
      setSearchBranch(value.id);
    }
  };

  const handleAcademicYear = (event, value) => {
    setSearchAcademicYear('');
    if (value) {
      setPage(1);
      setSearchAcademicYear(value.id);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 450);
  }, [page]);

  useEffect(() => {
    if (moduleId) {
      axiosInstance
        .get(`${endpoints.academics.branches}?module_id=${moduleId}`)
        .then((result) => {
          if (result.status === 200) {
            setBranches(result.data.data);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });

      axiosInstance
        .get(`${endpoints.userManagement.academicYear}?module_id=${moduleId}`)
        .then((result) => {
          if (result.status === 200) {
            setAcademicYear(result.data.data);
          } else {
            setAlert('error', result.data.message);
          }
        })
        .catch((error) => {
          setAlert('error', error.message);
        });
    }
  }, [moduleId]);

  useEffect(() => {
    let request = `${endpoints.userManagement.bulkUpload}?page=${page}&page_size=${limit}`;
    if (searchAcademicYear) request += `&academic_year=${searchAcademicYear}`;
    if (searchBranch) request += `&branch=${searchBranch}`;

    axiosInstance
      .get(request)
      .then((result) => {
        if (result.status === 200) {
          setTotalCount(result.data.result.count);
          setBulkData(result.data.result.results);
        } else {
          setAlert('error', result.data.message);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, [page, searchAcademicYear, searchBranch]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='User Management'
              childComponentName='Bulk Upload Status'
            />
          </div>
        </div>

        <Grid
          container
          spacing={isMobile ? 3 : 5}
          style={{ width: widerWidth, margin: wider }}
        >
          <Grid item xs={12} sm={3} className={isMobile ? '' : 'filterPadding'}>
            <Box className={classes.centerInMobile}>
              <Autocomplete
                size='small'
                style={{ width: '100%' }}
                onChange={handleBranch}
                id='branch'
                options={branches}
                getOptionLabel={(option) => option?.branch_name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Branch'
                    placeholder='Branch'
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} style={isMobile ? { margin: '0 0 20px 0' } : {}}>
            <Box className={classes.centerInMobile}>
              <Autocomplete
                size='small'
                style={{ width: '100%' }}
                onChange={handleAcademicYear}
                id='year'
                options={academicYear}
                getOptionLabel={(option) => option?.session_year}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='outlined'
                    label='Academic Year'
                    placeholder='Academic Year'
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
        {/* {!isMobile && ( */}
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
                {bulkData &&
                  bulkData.map((data, index) => {
                    return (
                      <TableRow hover bulkdata='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          {data.created_at?.substring(0, data.created_at.indexOf('T'))}
                          &nbsp;
                          <span style={{ color: '#fe6b6b', fontWeight: '600' }}>-</span>
                          &nbsp;
                          {data.created_at?.substring(
                            data.created_at.indexOf('T') + 1,
                            data.created_at.indexOf('T') + 6
                          )}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {data.success_count}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          {data.failure_count}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <a
                            href={`${data.user_file}`}
                            target='_blank'
                            title='Download Excel Sheet'
                          >
                            {' '}
                            <GetAppIcon color='primary' />
                          </a>
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
        {/* )} */}
        {/* {isMobile && tableFlag && !addFlag && !editFlag && (
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
            <div className="paginateData paginateMobileMargin">
            <TablePagination
              component='div'
              count={totalCount}
              rowsPerPage={limit}
              page={page-1}
              onChangePage={handleChangePage}
              rowsPerPageOptions={false}
            />
            </div>
          </>
        )} */}
      </Layout>
    </>
  );
};

export default BulkUpload;
