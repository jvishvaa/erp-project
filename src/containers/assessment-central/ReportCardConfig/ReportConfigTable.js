import React, { useEffect, useState } from 'react';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Loading from '../../../components/loader/loader';
import Layout from '../../Layout';
import { Grid, TextField, Button, makeStyles, Paper, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, IconButton } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: theme.commonTableRoot,
    container: {
      maxHeight: '70vh',
      width: '100%',
    },
    columnHeader: {
      color: `${theme.palette.secondary.main} !important`,
      fontWeight: 600,
      fontSize: '1rem',
      backgroundColor: `#ffffff !important`,
    },
    tableCell: {
      color: theme.palette.secondary.main,
      maxWidth: '200px',
      wordBreak: 'break-all',
    },
    buttonContainer: {
      width: '95%',
      margin: '0 auto',
      background: theme.palette.background.secondary,
      paddingBottom: theme.spacing(2),
    },
  }));
  
  const columns = [
    {
      id: 'subject_name',
      label: 'Category Name',
      minWidth: 100,
      align: 'center',
      labelAlign: 'center',
    },
    {
      id: 'desc',
      label: 'Description',
      minWidth: 100,
      align: 'center',
      labelAlign: 'center',
    },
    {
      id: 'optional',
      label: 'Delete',
      minWidth: 50,
      align: 'center',
      labelAlign: 'center',
    },
    {
      id: 'created_by',
      label: 'Subject Dependent',
      minWidth: 100,
      align: 'center',
      labelAlign: 'center',
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 170,
      align: 'center',
      labelAlign: 'center',
    },
  ];

const ReportConfigTable = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.questionBank.reportConfig}`)
      .then((res) => {
        if (res?.data) {
          setConfigData(res?.data?.result);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleCreate = () => {
    history.push('/report-config/create');
  }

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Assessment'
              childComponentName='Report Card Config'
              //   childComponentNameNext={
              // addFlag && !tableFlag
              //   ? 'Add Category'
              //   : editFlag && !tableFlag
              //   ? 'Edit Category'
              //   : null
              //   }
            />
          </div>
        </div>

        <Grid container spacing={5} style={{ margin: '0px' }}>
          <Grid item xs={12} sm={3} className={'addButtonPadding'}>
            <Autocomplete
              style={{ width: 350 }}
              // value={selectedCentralCategory}
              id='tags-outlined'
              options={'centralCategory'}
              getOptionLabel={(option) => option.category_name}
              filterSelectedOptions
              size='small'
              renderInput={(params) => (
                <TextField {...params} variant='outlined' label='Grade' />
              )}
              onChange={(e, value) => {
                // setSelectedCentralCategory(value);
              }}
              getOptionSelected={(option, value) => value && option.id == value.id}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ margin: '0px' }}>
          <Grid item xs={3} sm={2} className={'addButtonPadding'}>
            <Button
              // startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              color='primary'
              size='medium'
              style={{ color: 'white', width: '120px' }}
              title='Filter'
              //   onClick={handleAddSubject}
            >
              Filter
            </Button>
          </Grid>
          <Grid item xs={3} sm={3} className={'addButtonPadding'}>
            <Button
              startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
              variant='contained'
              color='primary'
              size='medium'
              style={{ color: 'white' }}
              title='Create'
                onClick={handleCreate}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        <hr />
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
                {configData.map((subject, index) => {
                  return (
                    <TableRow hover subject='checkbox' tabIndex={-1} key={index}>
                      <TableCell className={classes.tableCell}>
                        {configData?.category_name}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {configData?.description}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {configData?.is_delete ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {configData?.is_subject_dependent ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <IconButton
                          onClick={(e) => {
                            // handleOpenDeleteModal(configData);
                          }}
                          title='Delete'
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                        <IconButton
                        //   onClick={(e) => handleEditSubject(configData)}
                          title='Edit'
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <div className='paginateData'>
                  <TablePagination
                    component='div'
                    count={totalCount}
                    className='customPagination'
                    rowsPerPage={limit}
                    page={page - 1}
                    onChangePage={handleChangePage}
                    rowsPerPageOptions={false}
                  />
                </div> */}
        </Paper>
      </Layout>
    </>
  );
}

export default ReportConfigTable;
