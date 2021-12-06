import { Drawer, FormControlLabel, Paper, Switch, TableCell, TableContainer, TableHead, TextField, Typography,} from '@material-ui/core';
import Layout from 'containers/Layout';
import React, { useState, useEffect, useContext } from 'react';
import { CardContent, Divider, Icon } from 'semantic-ui-react';
import './observation.css';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import endpoints from 'config/endpoints';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axiosInstance from 'config/axios';
import clsx from 'clsx';
import Loading from 'components/loader/loader';
import { Autocomplete } from '@material-ui/lab';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import TablePagination from '@material-ui/core/TablePagination';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useStyles} from './observationAreaStyle'


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function Observationarea(props) {
  const classes = useStyles(props);
  const [order, setOrder] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [statusEdit, setStatusEdit] = useState(false);
  const [observationStatus, setObservationStatus] = useState([]);
  const [nameEdit, setNameEdit] = useState('');
  const [observationAreaValue, setObservationAreaValue] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setUpdateId('');
    setOpen(true);
  };
  const handleClose = (value) => {
    setOpen(false);
  };

  const addIndex = () => {
    return data.map((student, index) => ({ ...student, sl: index + 1 }));
  };

  const postData = () => {
    if(nameEdit===""){
      setAlert('error','fill observation name')
      return
    }
    if (observationAreaValue.id === undefined || null){
      setAlert('error','select observation area')
      return
    }
    setLoading(true);
    let body = {
      observation: nameEdit,
      status: statusEdit,
      observation_area: observationAreaValue.id,
    };

    axiosInstance
      .post(`${endpoints.observationName.observationGet}`, body)
      .then((result) => {
        setLoading(false);
        observationGet();
        handleClose();
        setNameEdit('')
        setStatusEdit(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const observationGet = () => {
    updateDropData();
    const result = axiosInstance
      .get(`${endpoints.observationName.observationGet}`)
      .then((result) => {
        if (result.status === 200) {
          setData(result?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNameEdit = (event) => {
    setNameEdit(event.target.value);
  };

  const handleStatusEdit = (event) => {
    setStatusEdit(event.target.value);
  };

  const statusName = [
    {
      value: 'true',
    },
    {
      value: 'false',
    },
  ];
  const [updateId, setUpdateId] = useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  const handleEditButton = (id, observation, stat, observationname) => {
    setUpdateId(id);
    setNameEdit(observation);
    setStatusEdit(stat);
    setObservationAreaValue(id)
    handleDrawerOpen();
  };

  const handleDelete = (event, index) => {
    setDeleteId(event);
    setDeleteAlert(true);
  };
  const clearAll =()=>{
    setNameEdit('');
    handleClose();
  }

  const handleDeleteConfirm = () => {
    const result = axiosInstance
      .delete(`${endpoints.observationName.observationGet}${deleteId}/`)
      .then((result) => {
        if (result.status === 204) {
          setAlert('success', 'successfully deleted');
          setDeleteAlert(false);
          observationGet();
        } else {
          console.log('error');
        }
      });
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setDeleteAlert(false);
  };

  const updateData = () => {
    let body = {
      observation: nameEdit,
      status: statusEdit,
      observation_area: observationAreaValue.id,
    };
    axiosInstance
      .put(`${endpoints.observationName.observationGet}${updateId}/`, body)
      .then((res) => {
        setNameEdit(res?.observation);
        // setStat(res?.stat);
        observationGet();
        handleClose();
       
      })

      .catch((error) => console.log(error));
  };

  const updateDropData = () => {
    const result = axiosInstance
      .get(`${endpoints.observationName.observationArea}`)
      .then((result) => {
        if (result.status === 200) {
          setObservationStatus(result?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    observationGet();
  }, []);
  return (
    <div>
      <Layout>
        <Grid container className='position-observer-second' style={{ paddingTop: '33px' }} >
          <Grid item style={{ fontWeight: 'bold', fontSize: '20px', paddingLeft: '60px' }} > Observation </Grid>
          <Grid item style={{ fontWeight: 'bold', marginBottom: '5px', marginRight: '61px' }} >
            <Button className={classes.button} variant='contained' startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
              size='medium' style={{ color: 'white', fontSize: '16px' }} onClick={handleClickOpen} color='primary' > Add </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} style={{ paddingLeft: '57px', paddingRight: '57px', paddingTop: '5px' }} >
          <Table className={classes.table} aria-label='simple table'>
            <TableBody>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Observation Area</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
              {stableSort(addIndex(data), getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={row?.id}>
                      <TableCell align='center'>{index + 1}</TableCell>
                      <TableCell align='center'>{row?.observation}</TableCell>
                      <TableCell align='center'>{row?.observation_area?.observation_area_name}</TableCell>
                      <TableCell align='center' style={{ width: '1px' }}>
                        <Grid item md={1} className={classes.tableGrid}>
                          <FormControlLabel checked={row?.status} onChange={handleStatusEdit} control={<Switch name='status' />} />
                        </Grid>
                      </TableCell>
                      <TableCell className={classes.tableMargin}>
                        <Grid item>
                          <Button id='edit' variant='contained' color='primary'
                            onClick={() => handleEditButton(row.id,row.observation,row.status,row.observation_area.observation_area_name)}
                            className={clsx(classes.button,classes.editButton)} endIcon={<Icon>edit</Icon>} >Edit </Button>
                          <Button variant='contained' color='primary' onClick={() => handleDelete(row.id, index)} className={clsx(classes.button,classes.deleteButton)} endIcon={<Icon>delete</Icon>} > Delete </Button>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[]} component='div' count={data?.length} rowsPerPage={rowsPerPage} page={page} onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage}/>
        <Dialog open={deleteAlert} onClose={handleDeleteCancel}>
          <DialogTitle id='draggable-dialog-title'>Delete Observation</DialogTitle>
          <DialogContent>
            <DialogContentText> Are you sure you want to delete this Observation ?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} variant='contained' color='secondary'> Cancel </Button>
            <Button color='primary' variant='contained' className={classes.buttonColor}onClick={handleDeleteConfirm} > Confirm </Button>
          </DialogActions>
        </Dialog>
        <Drawer  className={classes.drawer} variant='temporary' anchor='right' open={open} classes={{ paper: classes.drawerPaper }} onClose={() => {setOpen(false); setUpdateId('');}} >
          <div className={classes.drawerHeader}></div>
          <List>
            <CardContent>
              <Typography variant='body2' component='h1' className={classes.observationheading} > Observation </Typography>
              <TextField id='outlined-basic' variant='outlined' size='small' multiline value={nameEdit} fullWidth className={classes.observationinput} onChange={handleNameEdit} />
            </CardContent>
            <Typography variant='body2' component='h1' className={classes.statustyle} > Status </Typography>
            <TextField id='standard-select-currency-native' select size='small' value={statusEdit} fullWidth onChange={handleStatusEdit} className={classes.statusfield} variant='filled' SelectProps={{ native: true }} helperText='Please select one of the status'>
              {statusName.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))} </TextField>

            <Grid item xs={12}>
              <Autocomplete className={classes.dropdowndata} id='create__class-subject' fullWidth options={observationStatus || []} getOptionLabel={(option) => option.observation_area_name || ''} onChange={(event, newValue) => {setObservationAreaValue(newValue)}} value={observationAreaValue } required renderInput={(params) => (
              <TextField size='large'  className='create__class-textfield' {...params} variant='outlined' label='Observation Area' fullWidth placeholder='Observation Area' required /> )} />
            </Grid>
            <Grid item  xs={12} className="position-observer-second" style={{paddingTop:'15px'}} >
            <Grid item xs={12} md={3} style={{paddingLeft:'18px'}}>
            <Button onClick={clearAll} variant='contained' color='primary'> Cancel </Button>
              </Grid>{updateId ? 
              (<Button onClick={updateData} style={{  marginRight:'246px'}} variant='contained' color='primary' > Update </Button>):( 
              <Button onClick={postData} style={{ marginRight:'246px' }} variant="contained" color="primary" > Submit </Button>)} 
            </Grid>
          </List>
          <List></List>
        </Drawer>
      </Layout>
    </div>
  );
}

export default Observationarea;