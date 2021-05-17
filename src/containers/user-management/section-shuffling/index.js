import React, {useContext, useRef, useState} from 'react';
import { Button, Grid, makeStyles, Paper, withStyles, Box, Input, Typography } from '@material-ui/core';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../../Layout';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import axiosInstance from '../../../config/axios';
import FileSaver from 'file-saver';

const useStyles = makeStyles({
    parentDiv: {

    },
    paperStyled: {
        height: '80vh',
        padding: '50px',
        marginTop: '15px',
    },
    guidelinesText: {
        fontSize: '20px',
        fontWeight: 'bold'
    }
});

const guidelines = [
    {
      name: '',
      field: "Please don't remove or manipulate any header in the file format",
    },
    { name: 'Erp Code', field: ' is a required field, Example: 2003970002_OLV' },
    { name: 'Current Grade', field: ' is a required field, Example: [3,7]' },
    { name: 'Current SectionMapping', field: ' is a required field, Example: [3,7]' },
    { name: 'Change Grade', field: ' is a mandatory field, Example: [24,25]' },
    { name: 'Change Section Mapping', field: ' is a mandatory field, Example: [70’0]' },
    { name: 'Change Subject', field: ' is a required field, Example: [6,9’’]' },
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

const SectionShuffling = () => {
    const classes = useStyles({});
    const fileRef = useRef();
    const {setAlert} = useContext(AlertNotificationContext);
    const [file, setFile] = useState(null);
    const [uploadFlag, setUploadFlag] = useState(false);

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
        const formData = new FormData();
        formData.append('file', file);
        if (file) {
          setUploadFlag(true);
          axiosInstance
            .put('/erp_user/update_bulk_users_grade/', formData)
            .then((result) => {
              //if (result.data.status_code === 200) {
                //onUploadSuccess();
                var blob = new Blob([result.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                FileSaver.saveAs(blob, 'error.xlsx');
                //setAlert('success', 'Excel file submited');
                setUploadFlag(false);
                fileRef.current.value = null;
            })
            .catch((error) => {
              setAlert('error', 'Something Wrong!');
              setUploadFlag(false);
            });
        } else {
            setAlert('error', 'Something Wrong!');
        }
    };
    
    return (
        <Layout>
            <div className={classes.parentDiv}>
                <div style={{ width: '95%', margin: '20px auto' }}>
                    <CommonBreadcrumbs
                        componentName='User Management'
                        childComponentName='Section Shuffling'
                    />
                </div>
                <Grid container>
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
                        <StyledButton
                            onClick={handleFileUpload}
                        >
                            Upload
                        </StyledButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paperStyled}>
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

export default SectionShuffling;