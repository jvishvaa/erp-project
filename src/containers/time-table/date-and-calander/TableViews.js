import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  OutlinedInput,
  TablePagination,
} from '@material-ui/core';
import moment from 'moment';
import BlockIcon from '@material-ui/icons/Block';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Loader from '../../../components/loader/loader';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import TimeTableDialog from '../date-and-calander/timeTableDialog'
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
  container: {
    maxHeight: 440,
  },
  formControl: {
    // margin: theme.spacing(1),
    // minWidth: 250,
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
    color: theme.palette.secondary.main,
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
  },
  cardsContainer: {
    width: '95%',
    margin: '0 auto',
  },
  downloadExcel: {
    float: 'right',
    padding: '8px 15px',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: 400,
    textDecoration: 'none',
    backgroundColor: '#fe6b6b',
    color: '#ffffff',
  },
}));

export default function TableViews(props) {
  const classes = useStyles();
  const [usersData, setUsersData] = useState([]);
  const themeContext = useTheme();
  const [excelData] = useState([]);
const [isEdit,setIsEdit] = useState(false)
const [selectedItem , setSelectedItem] = useState()

  
  const handleEdit = (e,value) => {
    debugger
    setSelectedItem(value)
 setIsEdit(true)
    // history.push(`/user-management/edit-user/${id}`);
  };

  const getUsersData = async () => {
    const result = props.TimeTableList;
    const resultUsers = [];
    excelData.length = 0;
    result.map((items) =>
      resultUsers.push({
        id: items?.id,
        ttname: items?.ttname, //username
        // erpId: items.erp_id,
        status: items?.status,
        created_at:  moment(items?.created_at).format('MMMM Do YYYY'), 
         //emails
        // role: items?.roles?.role_name,
        section_mapping_id : items?.section_mapping_id,
        active: items?.is_active,
        is_delete: items?.is_delete,
        start_date: items?.start_date,
        end_date: items?.end_date,
        school_start_time: items?.school_start_time,
        school_end_time: items?.school_end_time,
        status: items?.status,
        // id: items?.id
      })
    );
    setUsersData(resultUsers);
  };

  useEffect(() => {
    getUsersData();
  }, [props.TimeTableList]);


  return (
    <div>
      <Paper className={`${classes.root} common-table`}>
        {/* {loading && <Loader />} */}
        <TableContainer
          className={`table table-shadow view_users_table ${classes.container}`}
        >
          <Table stickyHeader aria-label='sticky table'>
            <TableHead className={`${classes.columnHeader} table-header-row`}>
              <TableRow>
                <TableCell className={classes.tableCell}>Table Name</TableCell>
                {/* <TableCell className={classes.tableCell}>ERP Id</TableCell> */}
                <TableCell className={classes.tableCell}>Created At</TableCell>
                {/* <TableCell className={classes.tableCell}>Role</TableCell> */}
                <TableCell className={classes.tableCell}>Status</TableCell>
                <TableCell className={classes.tableCell}>Action</TableCell>
                {/* <TableCell className={classes.tableCell}>Edit</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData.map((items, i) => (
                <TableRow
                  hover
                  role='checkbox'
                  tabIndex={-1}
                  key={`user_table_index${i}`}
                >
                  <TableCell className={classes.tableCell}>{items.ttname}-({`${moment(items?.start_date).format('MMMM D[,] YYYY')}`} -{' '}
            {`${moment(items?.end_date).format('MMMM D[,] YYYY')}`})</TableCell>
                  {/* <TableCell className={classes.tableCell}>{items.erpId}</TableCell> */}
                  <TableCell className={classes.tableCell}>{items.created_at}</TableCell>
                  {/* <TableCell className={classes.tableCell}>{items?.role}</TableCell> */}
                  <TableCell className={classes.tableCell}>
                    {items && items.active === true ? (
                      <div style={{ color: 'green' }}>Activated</div>
                    ) : items && items.status === 2 ? (
                      <div style={{ color: 'blue' }}>Published</div>
                    ) : (
                      <div style={{ color: 'red' }}>Draft</div>
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    className={classes.tableCell}
                  >
                    {items && items.status === 'deleted' ? (
                      'Restore'
                    ) : items.active === true ? (
                      <IconButton
                        aria-label='deactivate'
                        // onClick={() => handleDeactivate()}
                        onClick={() => props.handleOperation('deActive', items)}
                        title='Deactivate'
                      >
                        <BlockIcon style={{ color: themeContext.palette.primary.main }} />
                      </IconButton>
                    ) : (
                      <button
                        type='submit'
                        title='Activate'
                        // onClick={() => handleStatusChange(items.userId, i, '1')}
                        onClick={() => props.handleOperation('active', items)}
                        style={{
                          borderRadius: '50%',
                          backgroundColor: 'green',
                          border: 0,
                          width: '30px',
                          height: '30px',
                          color: '#ffffff',
                          cursor: 'pointer',
                        }}
                      >
                        A
                      </button>
                    )}
                    {items && items?.is_delete == false ? (
                      <>
                        <IconButton
                          title='Delete'
                          onClick={() => props.handleOperation('delete', items)}
                        >
                          <DeleteOutlinedIcon
                            style={{ color: themeContext.palette.primary.main }}
                          />
                        </IconButton>
                        <IconButton
                          //   title='Edit'
                          title='view'
                          //   onClick={() => handleEdit(items.userId)}
                          onClick={(e) => props.handleView(e, items, 'tableview')}
                        >
                          <VisibilityOutlinedIcon
                            style={{ color: themeContext.palette.primary.main }}
                          />
                        </IconButton>{' '}
                        <IconButton title='Edit' onClick={(e) => props.handleOperation('edit', items)}>
                       <EditOutlinedIcon
                         style={{ color: themeContext.palette.primary.main }}
                       />
                     </IconButton>
                      </>
                    ) : (
                      ''
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* { isEdit &&
       <TimeTableDialog
       selectedItem = {selectedItem}
       editTable = {isEdit}
       setIsEdit = {setIsEdit}
      />

      } */}
    </div>
  );
}
