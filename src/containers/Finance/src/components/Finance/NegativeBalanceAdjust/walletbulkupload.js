import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  Box,
  Input,
  Typography,
} from '@material-ui/core';
import CommonBreadcrumbs from 'components/common-breadcrumbs/breadcrumbs';
import Layout from 'containers/Layout';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import axiosInstance from 'config/axios';
import FileSaver from 'file-saver';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { urls } from 'containers/Finance/src/urls';
//import exportFromJSON from 'export-from-json';
import { CSVLink } from 'react-csv';
import Select from 'react-select';
import axios from 'axios';
import './walletbulk.scss';

const useStyles = makeStyles((theme) => ({
  parentDiv: {},
  paperStyled: {
    minHeight: '80vh',
    height: '100%',
    padding: '50px',
    marginTop: '15px',
  },
  guidelinesText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  errorText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fe6b6b',
    marginBottom: '30px',
    display: 'inline-block',
  },
  table: {
    minWidth: 650,
  },
  downloadExcel: {
    float: 'right',
    fontSize: '16px',
    // textDecoration: 'none',
    // backgroundColor: '#fe6b6b',
    // color: '#ffffff',
  },
  guidelineval: {
    color: theme.palette.primary.main,
    fontWeight: '600',
  },
  guideline: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    padding: '10px',
  },
}));

const guidelines = [
  {
    name: '',
    field: "Please don't remove or manipulate any header in the file format",
  },
  { name: 'Erp Code', field: ' is a mandatory field, Example: 2003970002_OLV' },
  { name: 'Adjusted Amount', field: ' is a mandatory field, Example: [1500]' },
  { name: 'Paid Date', field: ' is a mandatory field, Example: [03/07/20]' },
  { name: 'Transaction ID', field: ' is a mandatory field, Example: [#1234567NMAOJF]' },
  { name: 'Payment Mode', field: ' is a required field, Example: [Credit Card]' },
];

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
    padding: '8px 15px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(Button);

const StyledClearButton = withStyles({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    padding: '8px 15px',
    marginLeft: '30px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
})(Button);

const WalletBulk = () => {
  const classes = useStyles({});
  const fileRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const [file, setFile] = useState(null);
  const [uploadFlag, setUploadFlag] = useState(false);
  const [data, setData] = useState([]);
  const [failed, setFailed] = useState(false);
  const [excelData] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [sessionSelected, setSessionSelected] = useState(null);

  const [branchData, setBranchData] = useState(null);
  const [branchSelected, setBranchSelected] = useState(null);

  const [ walletType , setWalletType ] = useState('');

  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const headers = [
    { label: 'ERP Code', key: 'erp_id' },
    { label: 'Error', key: 'error_msg' },
  ];

  useEffect(() => {
    console.log(token, 'user');
    axios
      .get(`${urls.UTILACADEMICSESSION}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSessionData(res.data);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  const handleClickSessionYear = (e) => {
    console.log(e, 'year');
    setSessionSelected(e);
    axios
      .get(`${urls.MiscFeeClass}?session_year=${e.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBranchData(res.data);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const branchHandle = (e) => {
    setBranchSelected(e)
  }

  const walletTypeHandle = (e) => {
    setWalletType(e);
  }

  const handleFileChange = (event) => {
    const { files } = event.target;
    const fil = files[0] || '';
    if (fil.name.lastIndexOf('.xls') > 0 || fil.name.lastIndexOf('.xlsx') > 0) {
      setFile(fil);
    } else {
      setFile(null);
      fileRef.current.value = null;
      setAlert(
        'error',
        'Only excel file is acceptable either with .xls or .xlsx extension'
      );
    }
  };

  const handleClearAll = () => {
    fileRef.current.value = null;
  };

  const handleFileUpload = () => {
    setFailed(false);
    const formData = new FormData();
    formData.append('file', file );
    formData.append('branch_id', branchSelected.value );
    formData.append('wallet_amount_type', walletType.value);

    if (file) {
      setUploadFlag(true);
      axiosInstance
        .post(`${urls.WalletBulk}`, formData)
        .then((result) => {
          setAlert('success', 'Excel file submited successfully');
          function addDataToExcel(xlsData) {
            xlsData.map((record) => {
              console.log(Object.keys(record) + ': ' + Object.values(record));
              excelData.push({
                erp_id: Object.keys(record),
                error_msg: Object.values(record),
              });
            });
          }
          if (result.data?.data.length > 0) {
            setFailed(true);
            setData(result.data.data);
            addDataToExcel(result.data.data);
          }
          setUploadFlag(false);
          fileRef.current.value = null;
        })
        .catch((error) => {
          // setAlert('error', 'Something Wrong!');
          setUploadFlag(false);
        });
    } else {
      setAlert('warning', 'Please select file');
    }
  };

  return (
    <Layout>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Student Wallet'
          childComponentName='Wallet Bulk Upload'
        />
        <div className="wallet-container">
          <div className="dropGrid">
            <div className="yearGrid">
              <label>Academic Year*</label>
              <Select
                placeholder='Select Academic Year'
                value={sessionSelected}
                options={
                  sessionData
                    ? sessionData.session_year.map((session) => ({
                        value: session,
                        label: session,
                      }))
                    : []
                }
                onChange={handleClickSessionYear}
              />
            </div>
            <div className="brandGrid">
              <label>Branch*</label>
              <Select
                placeholder='Select Branch'
                value={branchSelected}
                options={
                  branchData?.length
                    ? branchData.map(branch => ({
                      value: branch.branch ? branch.branch.id : '',
                      label: branch.branch ? branch.branch.branch_name : ''
                    }))
                    : []
                }
                onChange={branchHandle}
              />
            </div>
            <div className="yearGrid">
              <label>Wallet Type*</label>
              <Select
                placeholder='Select Wallet Type'
                value={walletType}
                options={[
                 { value: "1", label: "Store" }
                ]}
                onChange={walletTypeHandle}
              />
            </div>
          <div>
            <Box display='flex' flexDirection='column' style={{ marginLeft: '30px' }}>
              <Input
                type='file'
                inputRef={fileRef}
                inputProps={{ accept: '.xlsx,.xls' }}
                onChange={handleFileChange}
              />
              <Box display='flex' flexDirection='row' style={{ color: 'gray' }}>
                <Box p={1}>
                  {`Download Format: `}
                  <a
                    style={{ cursor: 'pointer' }}
                    href='/assets/download-format/bulk_wallet.xlsx'
                    download='format.xlsx'
                  >
                    Download format
                  </a>
                </Box>
              </Box>
            </Box>
          </div>
          </div>
<div className="button-area">
          <div className="clearALl" >
            <StyledClearButton onClick={handleClearAll}>Clear All</StyledClearButton>
          </div>
          <div className='upload-btn' >
            <StyledButton onClick={handleFileUpload}>Upload</StyledButton>
          </div>
          </div>
          <div>
            <Paper className={classes.paperStyled}>
              {failed && (
                <div style={{ marginBottom: '30px' }}>
                  <Typography className={classes.errorText}>
                    Error: <span style={{ color: '#014b7e' }}>Failed records</span>
                  </Typography>
                  <CSVLink
                    data={excelData}
                    headers={headers}
                    filename={'error_list.xls'}
                    className={classes.downloadExcel}
                  >
                    Download Excel
                  </CSVLink>
                  {/* <StyledButton onClick={(e) => ExportToExcel()} style={{float: 'right'}}>Download Excel</StyledButton> */}

                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label='simple table'>
                      <TableHead>
                        <TableRow>
                          <TableCell align='left'>ERP Code</TableCell>
                          <TableCell>Error Message</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((row) => (
                          <TableRow key={row.name}>
                            <TableCell component='th' scope='row' align='left'>
                              {Object.keys(row)}
                            </TableCell>
                            <TableCell>
                              <span style={{ color: 'red' }}>{Object.values(row)}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
              <Typography className={classes.guidelinesText}>Guidelines:</Typography>
              {guidelines.map((val, i) => {
                return (
                  <div className={classes.guideline}>
                    {i + 1}. 
                    <span className={classes.guidelineval}>{val.name}</span>
                    <span>{val.field}</span>
                  </div>
                );
              })}
            </Paper>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WalletBulk;
