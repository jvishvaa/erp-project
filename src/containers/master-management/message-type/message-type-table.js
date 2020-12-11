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
import { Grid, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TablePagination from '@material-ui/core/TablePagination';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import CreateMessageType from './create-message-type';
import EditMessageType from './edit-message-type';
import '../master-management.css';
import Loading from '../../../components/loader/loader';
import MessageTypeCard from './message-type-card';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    boxShadow:'none'
  },
  container: {
    maxHeight: '70vh',
  },
  buttonContainer: {
    background: theme.palette.background.secondary,
    paddingBottom: theme.spacing(2),
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
  { id: 'message_type', label: 'Message Type', minWidth: 100 },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
    labelAlign: 'center',
  },
];

const MessageTypeTable = () => {
  const classes = useStyles();
  const { setAlert } = useContext(AlertNotificationContext);
  const [page, setPage] = React.useState(1);
  const [messageType, setMessageType] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [messageTypeId, setMessageTypeId] = useState();
  const [categoryName,setCategoryName] = useState('');
  const [addFlag, setAddFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [tableFlag, setTableFlag] = useState(true);
  const [delFlag, setDelFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(15);
  const [goBackFlag,setGoBackFlag]=useState(false)
  
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider= isMobile?'-10px 0px':'-10px 0px 20px 8px'
  const widerWidth=isMobile?'98%':'95%'

  const handleChangePage = (event, newPage) => {
    setPage(newPage+1)
  }

  const handleAddMessageType = () => {
    setTableFlag(false);
    setAddFlag(true);
    setEditFlag(false);
  };

  const handleEditMessageType = (id, name) => {
    setTableFlag(false);
    setAddFlag(false);
    setEditFlag(true);
    setMessageTypeId(id);
    setCategoryName(name);
  };

  const handleGoBack = () => {
    setPage(1)
    setTableFlag(true);
    setAddFlag(false);
    setEditFlag(false);
    setGoBackFlag(!goBackFlag)
  };

  const handleDeleteMessageType = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .delete(`${endpoints.masterManagement.updateMessageType}${messageTypeId}/communicate-type/`)
      .then((result) => {
        if (result.data.status_code === 200) {
            setDelFlag(!delFlag);
            setLoading(false);
            setAlert('success', result.data.message);
        }
        else {
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

  const handleDelete = (msgtype) => {
    setCategoryName(msgtype.category_name);
    handleOpenDeleteModal(msgtype.id);
  }

  const handleOpenDeleteModal = (id) => {
    setMessageTypeId(id);
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
      .get(
        `${endpoints.masterManagement.messageTypeTable}?page=${page}&page_size=${limit}`
      )
      .then((result) => {
        if (result.data.status_code === 200) {
          {
            setTotalCount(result.data.data.count);
            setMessageType(result.data.data.results);
          }
        } else {
          setAlert('error', result.data.error_msg);
        }
      })
      .catch((error) => {
        setAlert('error', error.message);
      });
  }, [delFlag, goBackFlag, page]);

  return (
    <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <div>
          <div style={{ width: '95%', margin: '20px auto' }}>
            <CommonBreadcrumbs
              componentName='Master Management'
              childComponentName='Message Type List'
              childComponentNameNext={(addFlag&&!tableFlag)?'Add Message Type':(editFlag&&!tableFlag)?'Edit Message Type':null}
            />
          </div>
        </div>

        {!tableFlag && addFlag && !editFlag && (
        <CreateMessageType 
        setLoading={setLoading} 
        handleGoBack={handleGoBack}
        />
        )}
        {!tableFlag && !addFlag && editFlag && (
          <EditMessageType
            id={messageTypeId}
            category={categoryName}
            handleGoBack={handleGoBack}
            setLoading={setLoading}
          />
        )}

        {tableFlag && !addFlag && !editFlag && (
          <Grid container spacing={isMobile?3:5} style={{ width: widerWidth, margin: wider}}>
            <Grid item xs={12} sm={4} className='addButtonPadding'>
              <Button 
              startIcon={<AddOutlinedIcon style={{fontSize:'30px'}}/>} 
              variant='contained' 
              color='primary' 
              size="small" 
              style={{color:'white'}} 
              title="Add Message Type" 
              onClick={handleAddMessageType}>
                Add Message Type
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
                  {messageType.map((msgtype, index) => {
                    return (
                      <TableRow hover messagetype='checkbox' tabIndex={-1} key={index}>
                        <TableCell className={classes.tableCell}>
                          {msgtype.category_name}
                        </TableCell>
                        <TableCell className={classes.tableCell}>
                          <IconButton
                            onClick={e=>{ handleDelete(msgtype) }}
                            title='Delete Message Type'
                          >
                            <DeleteOutlinedIcon style={{color:'#fe6b6b'}} />
                          </IconButton>

                          <IconButton
                            onClick={(e) =>
                              handleEditMessageType(
                                msgtype.id,
                                msgtype.category_name,
                              )
                            }
                            title='Edit Message Type'
                          >
                            <EditOutlinedIcon style={{color:'#fe6b6b'}} />
                          </IconButton>      
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="paginateData">
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
        {isMobile && !addFlag && !editFlag && (
          <>
             {
              messageType.map(msgtype => (
                <MessageTypeCard
                msgtype={msgtype} 
                handleDelete={handleDelete} 
                handleEditMessageType={handleEditMessageType} />
              ))
            }
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
        )}
        <Dialog
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          aria-labelledby='draggable-dialog-title'
        >
          <DialogTitle style={{ cursor: 'move',color: '#014b7e' }} id='draggable-dialog-title'>
            Delete Message Type
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{`Confirm Delete Message Type ${categoryName}`}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button  onClick={handleCloseDeleteModal} className="labelColor cancelButton">
              Cancel
            </Button>
            <Button color="primary" onClick={handleDeleteMessageType}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

export default MessageTypeTable;
