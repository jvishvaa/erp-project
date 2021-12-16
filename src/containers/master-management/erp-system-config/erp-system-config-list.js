/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Paper,
  IconButton,
  Button,
  Grid,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import '../master-management.css';
import useStyles from './useStyles';
import { getErpSystemConfig, deleteErpSystemConfig } from './apis';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Pagination from '../../../components/PaginationComponent';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeletionModal from './deletion-modal';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';

const pageSize = 10;

const isSuccess = (status) => status > 199 && status < 300;

const columns = [
  {
    id: 'config_key',
    label: 'Config Key',
    minWidth: 50,
    align: 'center',
    labelAlign: 'center',
  },
  {
    id: 'config_value',
    label: 'Config Value',
    minWidth: 170,
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

const ERPSystemConfigList = ({ setLoading, isMobile, setConfigUI, setEditDetails }) => {
  const classes = useStyles();
  const [updateFlag, setUpdateFlag] = useState(false);
  const { setAlert } = useContext(AlertNotificationContext);
  const history = useHistory();
  const [mappingList, setMappingList] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState();
  const wider = isMobile ? '10px auto' : '-10px 0px 20px 8px';
  const widerWidth = isMobile ? '98%' : '95%';

  const handleDeleteConfig = async (id) => {
    setLoading(true);
    try {
      const { status = 400, message = 'Error' } = await deleteErpSystemConfig({
        erpsysconfig_id: id,
      });
      const isSuccesful = isSuccess(status);
      setAlert(isSuccesful ? 'success' : 'error', message);
      if (isSuccesful) {
        setUpdateFlag((prev) => !prev);
      }
    } catch (err) {
    } finally {
      setOpenDeleteModal();
      setLoading(false);
    }
  };

  const fetchERPSystemConfig = async () => {
    setLoading(true);
    try {
      const {
        result = {},
        message = 'Error',
        status = 400,
      } = await getErpSystemConfig(currentPage, pageSize);
      const { results = [], total_pages: totalPages = 0 } = result || {};
      setMappingList(results);
      setTotalPages(totalPages);
      const isSuccesful = isSuccess(status);
      setAlert(isSuccesful ? 'success' : 'error', message);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    if (currentPage) {
      fetchERPSystemConfig();
    }
  }, [updateFlag, currentPage]);

  return (
    <>
      {/* <Grid container style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3} className={isMobile ? '' : 'addButtonPadding'}>
          <Button
            startIcon={<AddOutlinedIcon style={{ fontSize: '30px' }} />}
            variant='contained'
            color='primary'
            size='medium'
            style={{ color: 'white' }}
            title='Add Subject'
            onClick={() => {
              setEditDetails({
                config_key: '',
                config_value: '',
              });
              setConfigUI('create');
            }}
          >
            Create Config
          </Button>
        </Grid>
      </Grid> */}

      <Paper
        className={`${classes.root} common-table`}
        style={{ width: widerWidth, margin: '0 auto' }}
      >
        <Grid container>
          <Grid item xs={12}>
            <TableContainer className={classes.containerGenerated}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead className='table-header-row'>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column?.minWidth }}
                        className={classes.columnHeader}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mappingList?.map(
                    (
                      { id = '', is_delete = false, config_key = '', config_value = '' },
                      index
                    ) => {
                      return (
                        <TableRow hover academicyear='checkbox' tabIndex={-1} key={index}>
                          <TableCell className={classes.tableCell}>
                            {config_key}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {JSON.stringify(config_value)}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            <IconButton
                              onClick={() => setOpenDeleteModal(id)}
                              title='Delete'
                            >
                              <DeleteOutlinedIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setEditDetails({ id, config_key, config_value });
                                setConfigUI('create');
                              }}
                              title='Edit'
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </Grid>
        </Grid>
      </Paper>
      {openDeleteModal && (
        <DeletionModal
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          handleDelete={(id) => handleDeleteConfig(id)}
        />
      )}
    </>
  );
};

export default ERPSystemConfigList;
