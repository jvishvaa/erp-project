import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  Grid,
  OutlinedInput,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputLabel,
  makeStyles,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Layout from 'containers/Layout';
import NoFilterData from 'components/noFilteredData/noFilterData';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Loader from 'components/loader/loader';
import { useHistory } from 'react-router-dom';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
    width: '95%',
    margin: 'auto',
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
      marginLeft: '5px',
      marginTop: '5px',
    },
  },
  container: {
    maxHeight: 440,
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
    color: '#ffffff',
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: `${theme.palette.secondary.main} !important`,
  },
  tablebody: {
    color: `${theme.palette.secondary.main} !important`,
  },
}));

const Gradingview = () => {
  const classes = useStyles();
  const history = useHistory();
  const [gradingData, setGradingData] = useState([]);
  const [gradingId, setGradingId] = useState();
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [gradingDataCopy, setGradingDataCopy] = useState();
  const { setAlert } = useContext(AlertNotificationContext);


  useEffect(() => {
    fetchgradingData();
  }, []);

  const fetchgradingData = () => {
    setLoading(true);
    axiosInstance
      .get(`${endpoints.gradingSystem.GradingData}`)
      .then((res) => {
        setLoading(false);
        setGradingData(res.data.result);
        setGradingDataCopy(res.data.result);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error); // to give set Alert later
      });
  };

  const handleDelete = (groupId, index) => {
    setDeleteAlert(true);
    setGradingId(groupId);
    setDeleteIndex(index);
  };
  const handleCreate = () => {
    history.push('./grading-create');
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const status = await axiosInstance.delete(
        `${endpoints.gradingSystem.deleteGrading}${gradingId}/`
      );
      if (status?.data?.status_code === 200) {
        setLoading(false);
        setAlert('success', status?.data?.message);
        const tempGroupData = gradingData.slice();
        tempGroupData.splice(deleteIndex, 1);
        setGradingData(tempGroupData || []);
        // setDeleteId(null);
        setDeleteIndex(null);
        setDeleteAlert(false);
      } else {
        setAlert('error', status?.data?.message || 'Operation Failed');
        setLoading(false);
      }
    } catch (error) {
        setAlert('error', error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    // setDeleteId(null);
    setDeleteIndex(null);
    setDeleteAlert(false);
  };

  const handleTextSearch = (e) => {
    setSearchText(e?.target?.value);
    if (e?.target?.value?.length > 0) {
      let filterData = gradingDataCopy?.filter((item) => {
        let grade_name = item.grading_system_name.toLowerCase();
        return grade_name?.includes(e?.target?.value.toLowerCase());
      });
      setGradingData(filterData);
    } else {
      setGradingData(gradingDataCopy);
    }
  };

  const handleEdit = (data) => {
    if (data) {
      history.push({
        pathname: './grading-create',
        state: {
          gradeData: data,
          isEdit: true,
        },
      });
    }
  };

  return (
    <Layout>
      {loading && <Loader />}
      <Grid item>
        <Grid item container xs={12} style={{ margin: '2% 0' }}>
          <Grid item container justifyContent='center' xs={12} md={2}>
            <Button color='primary' onClick={handleCreate} variant='contained'>
              Create
            </Button>
          </Grid>
          <Grid item xs={10}>
            <Grid item sm={8} md={8} xs={12}>
              <FormControl
                variant='outlined'
                className={'searchViewUser'}
                fullWidth
                size='small'
              >
                <InputLabel>Search</InputLabel>
                <OutlinedInput
                  endAdornment={<SearchOutlined color='primary' />}
                  placeholder='Search'
                  label='Search'
                  value={searchText}
                  onChange={handleTextSearch}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {gradingData?.length === 0 ? (
            <NoFilterData data='No Data Found' />
          ) : (
            <Paper className={` view_group_table_wrapper ${classes.root}`}>
              <TableContainer
                className={`table table-shadow view_group_table ${classes.container}`}
              >
                <Table stickyHeader aria-label='sticky table'>
                  <TableHead className={`${classes.columnHeader} view_groups_header`}>
                    <TableRow>
                      <TableCell className={classes.tableCell}>S.No</TableCell>
                      <TableCell className={classes.tableCell}>
                        Grade System Name
                      </TableCell>
                      <TableCell>Grade & Percentage</TableCell>
                      {/* <TableCell></TableCell> */}
                      {/* <TableCell className={classes.tableCell}>Description</TableCell> */}
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={classes.tablebody}>
                    {gradingData?.map((items, i) => (
                      <TableRow
                        hover
                        role='checkbox'
                        tabIndex={-1}
                        key={`group_table_index${i}`}
                      >
                        <TableCell className={classes.tableCell}> {i + 1} </TableCell>
                        <TableCell className={classes.tableCell}>
                          {items?.grading_system_name}
                        </TableCell>
                        {items?.grade_data?.map((grade) => (
                          <TableRow style={{display : 'flex', justifyContent : 'center'}}>
                            <TableCell>{grade?.grade_name}</TableCell>
                            <TableCell>
                              {`${grade?.start_mark}% - ${grade?.end_mark}%`}
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* <TableCell>{items?.grading_system_description}</TableCell> */}
                        <TableCell>
                          <IconButton
                            title='Delete'
                            onClick={() => handleDelete(items?.id, i)}
                          >
                            <DeleteOutlinedIcon color='primary' />
                          </IconButton>
                          <IconButton
                            title='Edit'
                            style={{ padding: '5px' }}
                            onClick={() => handleEdit(items)}
                            // onClick={() => handleEdit(items.groupId, i)}
                          >
                            <EditOutlinedIcon color='primary' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>
      </Grid>

      {
        <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
          <DialogTitle id='draggable-dialog-title'>Delete Grade</DialogTitle>
          <DialogContent>
            <DialogContentText>Do you want to Delete the Grading</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={handleDeleteCancel}
              className='labelColor cancelButton'
            >
              Cancel
            </Button>
            <Button
              color='primary'
              variant='contained'
              style={{ color: 'white' }}
              onClick={handleDeleteConfirm}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      }
    </Layout>
  );
};

export default Gradingview;
