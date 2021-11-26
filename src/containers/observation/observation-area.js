import { Card, CardActions, Drawer, FormControlLabel, Paper, Switch, TableCell, TableContainer, TableHead, TextField, Typography } from '@material-ui/core'
import Layout from 'containers/Layout'
import React, { useState, useEffect, useContext } from 'react'
import { CardContent, Divider, Icon } from 'semantic-ui-react'
import './observation.css'
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
import Loading from 'components/loader/loader';
import { Autocomplete } from '@material-ui/lab'


const drawerWidth = 300;

const useStyles = makeStyles({

});

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



function Observationarea() {
  const classes = useStyles();
  const [order, setOrder] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const { setAlert } = useContext(AlertNotificationContext);
  const [status, setStatus] = useState(false);
  const [statusEdit, setStatusEdit] = useState(false);
  const [stat, setStat] = useState(false);
  const [branchDisplay, setBranchDisplay] = useState({});
  const [observationStatus, setObservationStatus] = useState([]);
  const [name, setName] = useState('');
  const [nameEdit, setNameEdit] = useState('');
  const [observationArea, setObservationArea] = useState([]);
  const [observationAreaValue, setObservationAreaValue] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [observationAreaId, setObservationAreaId] = useState([]);
  const [state, setState] = useState([
    {
      checkedA: true,
    },
    {
      checkedB: false,
    },
  ]);

  const theme = useTheme();


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (value) => {
    setOpen(false);
  };

  const addIndex = () => {
    return data.map((student, index) => ({ ...student, sl: index + 1 }));
  };



  const postData = () => {
    setLoading(true);
    let body = {
      observation: name,
      status: status,
      observation_area: observationArea.id,
    };

    axiosInstance
      .post(`${endpoints.observationName.observationGet}`, body)
      .then((result) => {
        setLoading(false);
        observationGet();
        handleClose();
        setName('');
        setStatus('');
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
        console.log(result, "resultresult")
        if (result.status === 200) {
          setData(result?.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handleNameEdit = (event) => {
    setNameEdit(event.target.value);
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
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

  const handleEdit = (id, name, stat) => {
    setUpdateId(id);
    setEdit(true);
    setName(name);
    setStat(stat);
    handleClickOpen();

  };

  const handleDelete = (event, index) => {
    setDeleteId(event);

    const result = axiosInstance
      .delete(`${endpoints.observationName.observationGet}${event}/`)
      .then((result) => {
        console.log(result, "resulttt")
        if (result.status === 204) {
          setAlert('success', 'successfully deleted');
          observationGet();

        } else {
          console.log('error');
        }
      });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleEditButton = (id, observation_area, stat) => {
    console.log(id, observation_area, stat, "13131313")
    handleDrawerOpen();
    handleEdit(id, observation_area, stat)
  };


  const updateData = () => {
    setLoading(true);
    let body = {
      observation: nameEdit,
      status: statusEdit,
      observation_area: observationAreaValue.id,
    };
    axiosInstance
      .put(`${endpoints.observationName.observationGet}${updateId}/`, body)
      .then((res) => {
        console.log(res,"res")
        setNameEdit(res?.observation);
        setStatusEdit(res?.stat);
        handleClose();
        setLoading(false);
        observationGet();
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

  const dropData = (e) => {
    let index = observationStatus.indexOf(e);
    console.log(index, "index")
    console.log(e.target.value, "valueid")
  }

  useEffect(() => {
    observationGet();
  }, []);

  return (
    <div>
      <Layout>

        <Card className={classes.root} style={{ width: "210px", height: "27em", marginLeft: "20px", marginTop: "20px", float: "left", padding: "15px" }}>
          <CardContent >
            <h3>
              Observations
            </h3>
            <Typography variant="body2" component="p" style={{ marginTop: "10px" }}>
              Create Observations
            </Typography>
            <TextField id="outlined-basic" placeholder="Observation Name" variant="outlined" size="small" style={{ width: "180px", marginTop: "5px" }} value={name} onChange={handleName} />
          </CardContent>
          <Typography variant="body2" component="p" style={{ marginTop: "10px" }}>Status</Typography>

          <TextField
            id='standard-select-currency-native'
            select
            value={status}
            onChange={handleStatus}
            variant='filled'
            SelectProps={{
              native: true,
            }}
            helperText='Please select your status'
            size="small"
          >
            {statusName.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </TextField>
          <Grid item md={3} xs={12}>
            <Autocomplete
              style={{ width: "173px", marginTop: "5px" }}
              id='create__class-subject'
              className='dropdownIcon'
              options={observationStatus || []}
              getOptionLabel={(option) => option.observation_area_name || ''}
              onChange={(event, newValue) => setObservationArea(newValue)}
              value={observationArea || ''}
              required
              renderInput={(params) => (
                <TextField
                  size='large'
                  className='create__class-textfield'
                  {...params}
                  variant='outlined'
                  label='Observation'
                  placeholder='Area'
                  required
                />
              )}
            />
          </Grid>
          <CardActions >
            <Button size="small" style={{ marginLeft: "110px" }} onClick={postData} >Submit</Button>
          </CardActions>
        </Card>


        <TableContainer component={Paper} style={{ width: "70%", float: "right", marginLeft: "25px", marginTop: "25px", marginRight: "80px" }}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  S. No.
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Observation Area
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Action
                </TableCell>
              </TableRow>
              {stableSort(addIndex(data), getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row?.id}>
                      <TableCell align='center'>
                        {index + 1}
                      </TableCell>
                      <TableCell align='center'>
                        {row?.observation}
                      </TableCell>
                      <TableCell align='center'>
                        {row?.observation_area}
                      </TableCell>
                      <TableCell align='center' style={{width:"1px" }}>
                      <Grid
                            item
                            md={1}
                            style={{ position: 'relative', left: '118px' }}
                          >

                        <FormControlLabel
                          checked={row?.status}
                          onChange={handleStatus}
                          control={<Switch name='status' />}
                        />
                        </Grid>

                      </TableCell>
                      <TableCell style={{ width: "1px" }}>
                        <Grid item>
                          <Button
                            id="edit"
                            variant="contained"
                            color="primary"
                            onClick={() => handleEditButton(row.id, row.observation_area_name, row.status)}
                            className={classes.button}
                            style={{ padding: "0px", paddingLeft: "10px", paddingRight: "10px", marginBottom: "5px" }}
                            endIcon={<Icon>edit</Icon>}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDelete(row.id, index)}
                            className={classes.button}
                            style={{ padding: "0px", paddingLeft: "10px", paddingRight: "10px" }}
                            endIcon={<Icon>delete</Icon>}
                          >
                            Delete
                          </Button>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Drawer
          className={classes.drawer}
          variant="temporary"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={() => setOpen(false)}
        >
          <div className={classes.drawerHeader}>
          </div>
          <List>

            <CardContent>
              <Typography variant="body2" component="h1" style={{ marginTop: "80px", marginLeft: "20px" }}>
                Edit Observation
              </Typography>
              <TextField id="outlined-basic" variant="outlined" size="small" style={{ marginTop: "20px", marginLeft: "20px", marginRight: "20px" }} onChange={handleNameEdit} />
            </CardContent>
            <Typography variant="body2" component="h1" style={{ marginTop: "10px", marginLeft: "20px" }}>
              Status
            </Typography>
            <TextField
              id='standard-select-currency-native'
              select
              size="small"
              value={stat}
              onChange={handleStatusEdit}
              style={{ marginLeft: "20px", marginTop: "20px" }}
              variant='filled'
              SelectProps={{
                native: true,
              }}
              helperText='Please select one of the status'
            >
              {statusName.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </TextField>

            <Grid item md={3} xs={12}>
              <Autocomplete
                style={{ width: "220px", marginTop: "20px", marginLeft: "20px" }}
                id='create__class-subject'
                className='dropdownIcon'
                options={observationStatus || []}
                getOptionLabel={(option) => option.observation_area_name || ''}
                onChange={(event, newValue) => setObservationAreaValue(newValue)}
                value={observationAreaValue || ''}
                required
                renderInput={(params) => (
                  <TextField
                    size='large'
                    className='create__class-textfield'
                    {...params}
                    variant='outlined'
                    label='Observation'
                    placeholder='Area'
                    required
                  />
                )}
              />
           </Grid>
            <CardActions style={{ marginLeft: '20px' }}>
              <Button onClick={updateData} size="small" >Update</Button>
            </CardActions>
          </List>
          <List>
          </List>
        </Drawer>
      </Layout>
    </div>
  );
}

export default Observationarea
