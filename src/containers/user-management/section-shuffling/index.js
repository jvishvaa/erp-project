import React, { useContext, useRef, useState } from 'react';
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
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../config/axios';
import FileSaver from 'file-saver';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
//import exportFromJSON from 'export-from-json';
import { CSVLink } from 'react-csv';

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
  { name: 'Current Grade', field: ' is a mandatory field, Example: [3,7]' },
  { name: 'Current Section Mapping', field: ' is a mandatory field, Example: [3,7]' },
  { name: 'Change Grade', field: ' is a mandatory field, Example: [24,25]' },
  { name: 'Change Section Mapping', field: ' is a mandatory field, Example: [700]' },
  { name: 'Change Subject', field: ' is a required field, Example: [6,9]' },
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

const SectionShuffling = () => {
  const classes = useStyles({});
  const fileRef = useRef();
  const { setAlert } = useContext(AlertNotificationContext);
  const [file, setFile] = useState(null);
  const [uploadFlag, setUploadFlag] = useState(false);
  const [data, setData] = useState([]);
  const [failed, setFailed] = useState(false);
  const [excelData] = useState([]);

  const headers = [
    { label: 'ERP Code', key: 'erp_id' },
    { label: 'Error', key: 'error_msg' },
  ];

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
    formData.append('file', file);
    if (file) {
      setUploadFlag(true);
      axiosInstance
        .put('/erp_user/update_bulk_users_grade/', formData)
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
          setAlert('error', 'Something Wrong!');
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
          componentName='User Management'
          childComponentName='Section Shuffle'
        />
        <Grid container>
          <Grid item sm={4} xs={12}>
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
                    href='/assets/download-format/Sections_Shuffle.xlsx'
                    download='format.xlsx'
                  >
                    Download format
                  </a>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid sm={2} xs={6}>
            <StyledClearButton onClick={handleClearAll}>Clear All</StyledClearButton>
          </Grid>
          <Grid sm={2} xs={6}>
            <StyledButton onClick={handleFileUpload}>Upload</StyledButton>
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default SectionShuffling;
