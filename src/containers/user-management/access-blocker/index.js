import React, {useContext, useRef, useState , useEffect} from 'react';
import { Button, Grid, makeStyles, Paper, withStyles, Box, Input, Typography } from '@material-ui/core';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import {
    Divider,
    TextField,
  } from '@material-ui/core';
import axiosInstance from '../../../config/axios';
import endpoints from 'config/endpoints';
import FileSaver from 'file-saver';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
//import exportFromJSON from 'export-from-json';
import { CSVLink } from "react-csv";

const useStyles = makeStyles({
    parentDiv: {

    },
    paperStyled: {
        minHeight: '80vh',
        height: '100%',
        padding: '50px',
        marginTop: '15px',
    },
    guidelinesText: {
        fontSize: '20px',
        fontWeight: 'bold'
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
    }
});

const guidelines = [
    {
      name: '',
      field: "Please don't remove or manipulate any header in the file format",
    },
    { name: 'Erp Code', field: ' is a mandatory field, Example: 2003970002_OLV' },
    { name: 'Is_lesson_plan', field: ' is a mandatory field' },
    { name: 'Is_online_class', field: ' is a mandatory field' },
    { name: 'Is_ebook', field: ' is a mandatory field' },
    { name: 'Is_ibook', field: ' is a mandatory field' },
    { field: ' If access is need please mention as “0”' },
    { field: ' If access has to remove mention as “1”' },
  ];

const StyledButton = withStyles({
    root: {
        backgroundColor: '#FF6B6B',
        color: '#FFFFFF',
        padding: '8px 15px',
        '&:hover': {
            backgroundColor: '#FF6B6B !important',
          },
    }
})(Button);

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

const AccessBlocker = () => {
    const classes = useStyles({});
    const fileRef = useRef();
    const {setAlert} = useContext(AlertNotificationContext);
    const [file, setFile] = useState(null);
    const [uploadFlag, setUploadFlag] = useState(false);
    const [data, setData] = useState([]);
    const [failed, setFailed] = useState(false);
    const [excelData] = useState([]);
    const [ academicYear , setAcademicYear ] = useState();
    const [moduleId, setModuleId] = useState('');
    const [selectedAcademicYear, setSelectedAcadmeicYear] = useState('');
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};


    useEffect(() => {
      if (NavData && NavData.length) {
        NavData.forEach((item) => {
          if (
            item.parent_modules === 'User Management' &&
            item.child_module &&
            item.child_module.length > 0
          ) {
            item.child_module.forEach((item) => {
              if (item.child_name === 'Access-Blocker') {
                setModuleId(item.child_id);
              }
            });
          }
        });
      }
    }, []);


    const headers = [
        { label: "ERP Code", key: "erp_id" },
        { label: "Error", key: "error_msg" },
      ];

      useEffect(() => {
          if (moduleId) {
        axiosInstance
        .get(
            `erp_user/list-academic_year/?module_id=${moduleId}`,
          )
          .then((res) => {
            setAcademicYear(res?.data?.data)
            console.log(res.data.data , "academic");
            const defaultValue=res?.data?.data?.[0];
            handleAcademicYear(defaultValue);
          })
          .catch((error) => {
            setAlert('error', 'Something Wrong!');
          });
        }
      }, [moduleId]);

      const handleYear = (event, value) => {
        setSelectedBranch([]);
        setSelectedAcadmeicYear(value);
        if (value?.id) {
            axiosInstance
            .get(`erp_user/branch/?session_year=${value?.id}&module_id=${moduleId}`)
            .then((result) => {
                setBranchList(result?.data?.data?.results)
                console.log(result?.data?.data?.results , "branch");
            })
            .catch((error) => {
              console.log('');
            });
        }
      };

      const handleAcademicYear = (value)=>{
   
        setSelectedAcadmeicYear(value);
        console.log(selectedAcademicYear, 'test');
        if (value?.id) {
            axiosInstance
            .get(`erp_user/branch/?session_year=${value?.id}&module_id=${moduleId}`)
            .then((result) => {
                setBranchList(result?.data?.data?.results)
                console.log(result?.data?.data?.results , "branch");
            })
            .catch((error) => {
              console.log('');
            });
        }
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
        setSelectedAcadmeicYear()
        setSelectedBranch()
    };

    const branchCheck = () => {
        if (selectedBranch.length === 0 ) {
            setAlert('warning', 'Please select branch');
            console.log(selectedBranch.length);
        } else {
            setAlert('warning', 'mil gya');
            
        }
    }

    const handleFileUpload = () => {
    let token = JSON.parse(localStorage.getItem('userDetails')).token || {};
        setFailed(false);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('academic_year',selectedAcademicYear?.id)
        formData.append('branch',selectedBranch?.id)
        console.log(file , "file");
        if (selectedBranch.length === 0 ) {
            setAlert('warning', 'Please select branch');
            console.log(selectedBranch.length);
        } else {
        if (file ) {
            console.log(formData , "formdata");
          setUploadFlag(true);
          axiosInstance
            .post(`/erp_user/block-user-bulk-upload/`, formData ,{
                headers: {
                  Authorization: 'Bearer ' + token
                }
            })
            .then((result) => {
                setAlert('success', 'Excel file submited successfully');
                function addDataToExcel(xlsData){
                    xlsData.map((record) => {
                        excelData.push({erp_id: Object.keys(record) ,error_msg: Object.values(record)})
                    })
                }
                if(result.data?.data.length > 0){
                    setFailed(true);
                    setData(result.data.data);
                    addDataToExcel(result.data.data)
                }
                setUploadFlag(false);
                fileRef.current.value = null;
                setSelectedBranch([]);
                setSelectedAcadmeicYear([])
            })
            .catch((error) => {
              setAlert('error', 'Something Wrong!');
              setUploadFlag(false);
            });
        } else {
            setAlert('warning', 'Please select file');
        }
    }
    };

    // const fileName = 'error_list'  
    // const exportType = 'xls'

    // const ExportToExcel = () => {  
    //     exportFromJSON({ data, fileName, exportType })  
    // }
    
    return (
        <Layout>
            <div className={classes.parentDiv}>
                <div style={{ width: '95%', margin: '20px auto' }}>
                    <CommonBreadcrumbs
                        componentName='User Management'
                        childComponentName='Access Blocker'
                    />
                </div>
                <Grid container>
                    <Grid item md={3} xs={12} style={{ margin: '0 20px' }}>
                    <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleYear}
              id='branch_id'
              className='dropdownIcon'
              value={selectedAcademicYear || ''}
              options={academicYear || ''}
              getOptionLabel={(option) => option?.session_year || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Academic Year'
                  placeholder='Academic Year'
                />
              )}
            />
                    </Grid>

                    <Grid item md={3} xs={12}>
            <Autocomplete
              // multiple
              style={{ width: '100%' }}
              size='small'
              onChange={(event, value) => {
                setSelectedBranch([]);
                if (value) {
                  setSelectedBranch(value);
                  console.log(value , "branch id");
            }}
        }
              id='branch_id'
              className='dropdownIcon'
              value={selectedBranch || ''}
              options={branchList || ''}
              getOptionLabel={(option) => option?.branch?.branch_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Branch'
                  placeholder='Branch'
                />
              )}
            />
          </Grid>
                    <Grid item sm={4} xs={12}>
                        <Box display='flex' flexDirection='column' style={{marginLeft: '30px'}}>
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
                                    href='/assets/download-format/access.xlsx'
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
                        <StyledButton
                            onClick={handleFileUpload}
                        >
                            Upload
                        </StyledButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paperStyled}>
                            {failed && (
                                <div style={{ marginBottom: '30px'}}>
                                    <Typography className={classes.errorText}>
                                        Error: <span style={{color:'#014b7e'}}>Failed records</span>
                                    </Typography>
                                    <CSVLink data={excelData} headers={headers} filename={"error_list.xls"} className={classes.downloadExcel}>Download Excel</CSVLink>
                                    {/* <StyledButton onClick={(e) => ExportToExcel()} style={{float: 'right'}}>Download Excel</StyledButton> */}
                                    
                                    <TableContainer component={Paper}>
                                        <Table className={classes.table} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="left">ERP Code</TableCell>
                                                    <TableCell>Error Message</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.map((row) => (
                                                    <TableRow key={row.name}>
                                                        <TableCell component="th" scope="row" align="left">
                                                            {Object.keys(row)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span style={{color: 'red'}}>
                                                                {Object.values(row)}
                                                            </span>
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
                                    <div style={{ color: '#014b7e', fontSize: '16px', padding: '10px' }}>
                                        {i + 1}. 
                                        <span style={{ color: '#fe6b6b', fontWeight: '600' }}>
                                            {val.name}
                                        </span>
                                        <span>{val.field}</span>
                                    </div>
                                );
                            })}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    )
}

export default AccessBlocker;