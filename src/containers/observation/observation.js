import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Layout from 'containers/Layout';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';

import DialogTitle from '@material-ui/core/DialogTitle';
import { Drawer, TextField } from '@material-ui/core';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import EditIcon from '@material-ui/icons/Edit';
// import Switch from '@material-ui/material/Switch';

import './observation.css';
import { Divider } from '@material-ui/core';

const drawerWidth = 300;

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

const headCells = [
  { id: 'Serial No', label: 'Serial No' },
  { id: 'Observation Area', label: 'Observation Area' },
  { id: 'Status', label: 'Status' },
  { id: 'Action', label: 'Action' },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className='styled__table-head'>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='center'
            padding='none'
            style={{ background: '#d9d9d9', height: '61px' }}
            // sortDirection={orderBy === headCell.id ? order : false}
          >
           
              {headCell.label}
             
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {`${numSelected} selected`}
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant='h6'
          id='tableTitle'
          component='div'
        ></Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    padding: 40,
  },
  table: {
    minWidth: 500,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Observation() {
  const classes = useStyles();
  const [order, setOrder] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(false);
  const [name, setName] = useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [deleteId, setDeleteId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [state, setState] = React.useState([
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
   
      let body = {
        observation_area_name: name,
        status: status,
      };
    
      axiosInstance
        .post(`${endpoints.observation.observationGet}`, body)
        .then((result) => {
          observationGet();
          handleClose();
          setName('');
          setStatus('');
        })
        .catch((error) => {
          console.log(error);
        });
    
  };

  const observationGet = () => {
    const result = axiosInstance
      .get(`${endpoints.observation.observationGet}`)
      .then((result) => {
          console.log(result,"resultresult")
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

  const handleStatus = (event) => {
    setStatus(event.target.value);
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

  const handleEdit = (id, name, status) => {
    setUpdateId(id);
    setEdit(true);
    setName(name);
    setStatus(status);
    handleClickOpen();

  };

  const handleDelete = (event, index) => {
    setDeleteId(event);

    const result = axiosInstance
      .delete(`${endpoints.observation.observationGet}${event}/`)
      .then((result) => {
          console.log(result,"resulttt")
        if (result.status === 204) {
          setAlert('success', 'successfully deleted');
          observationGet();
       
        } else {
          console.log('error');
        }
      });
  };


  const updateData = () => {
    let body = {
      observation_area_name: name,
      status: status,
    };
    axiosInstance
      .put(`${endpoints.observation.observationGet}${updateId}/`, body)
      .then((res) => {
        setName(res?.observation_area_name);
        setStatus(res?.status);
        observationGet();
        handleClose();
        
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    observationGet();
  }, []);

  return (
    <Layout>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container className='position-observer-second'>
            <Grid item style={{ fontWeight: 'bold', fontSize: '20px' }}>
              Observations
            </Grid>

            
            <Grid item style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              <Button
                variant='outlined'
                startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
                size='medium'
                style={{ color: 'white', background: '#014b7e', fontSize: '16px' }}
                onClick={handleClickOpen}
                color='secondary'
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <TableContainer>
            <Table
              className={`${classes.table} styled__table`}
              aria-labelledby='tableTitle'
              aria-label='enhanced table'
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected?.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={data?.length}
              />
              <TableBody className='styled__table-body'>
                {stableSort(addIndex(data), getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        
                       
                        tabIndex={-1}
                        key={row?.id}
                      >
                        <TableCell align='center'>{row?.sl}</TableCell>
                        <TableCell align='center'>{row?.observation_area_name}</TableCell>
                        <TableCell align='center' style={{ width: '1px' }}>
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
                        <TableCell align='center'>
                          <Button
                            variant='contained'
                            style={{ color: 'white', background: '#014b7e' }}
                            onClick={() => handleDelete(row.id, index)}
                            startIcon={<DeleteIcon />}
                          >
                            Delete
                          </Button>
                          <Button
                            variant='contained'
                            style={{  color: 'white', background: '#014b7e' ,marginLeft: '5px' }}
                            
                            onClick={() =>
                              handleEdit(row.id, row.observation_area_name, row.status)
                            }
                            startIcon={<EditIcon />}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[]}
            component='div'
            count={data?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      <Drawer
        className={classes.drawer}
        //variant="persistent"
        variant='temporary'
        anchor='right'
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={() => setOpen(false)}
      >
        <Divider />
        <List>
          <DialogTitle id='simple-dialog-title'>Create Observations</DialogTitle>
          <Grid
            container
           
            direction='column'
            justifyContent='flex-start'
            alignItems='flex-start'
            style={{ marginLeft: '15px' }}
          >
            <text>Observation Area</text>
            <TextField
              placeholder='observation area'
              value={name}
              onChange={handleName}
              id='outlined-size-normal'
              variant='outlined'
            />
            <text>Status</text>

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
            >
              {statusName.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={2} style={{ marginTop: '16px' }}>
            {updateId ? (<Button
              onClick={updateData}
              style={{ marginLeft: '14px', marginBottom: '9px',background: '#014b7e',color:'white'}}
              variant='outlined'
              
            >
              update
            </Button>):( <Button
              onClick={postData}
              style={{ marginLeft: '14px', marginBottom: '9px',background: '#014b7e' ,color:'white' }}
              variant='outlined'
              color='secondary'
            >
              Submit
            </Button>)}  
           
          </Grid>
        </List>
        <Divider />
      </Drawer>
    </Layout>
  );
}
