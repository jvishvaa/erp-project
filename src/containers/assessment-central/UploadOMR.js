import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  withStyles,
  useTheme,
  Box,
  Input,
  Typography,
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  SvgIcon,
} from '@material-ui/core';
import axiosInstance from 'config/axios';
import endpoints from 'config/endpoints';
import { useHistory } from 'react-router-dom';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import Layout from '../Layout';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import { Autocomplete, Pagination } from '@material-ui/lab';
import unfiltered from '../../assets/images/unfiltered.svg';
import NoFilterData from 'components/noFilteredData/noFilterData';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { AttachmentPreviewerContext } from './../../components/attachment-previewer/attachment-previewer-contexts/attachment-previewer-contexts';
import BackupOutlined from '@material-ui/icons/BackupOutlined';
import FileValidators from 'components/file-validation/FileValidators';
import { uploadOMRFile } from 'redux/actions';
import SyncIcon from '@material-ui/icons/Sync';
import Loader from 'components/loader/loader';

const useStyles = makeStyles((theme) => ({
  root: theme.commonTableRoot,
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
  tablePaginationCaption: {
    fontWeight: '600 !important',
  },
  tablePaginationSpacer: {
    flex: 0,
  },
  tablePaginationToolbar: {
    justifyContent: 'center',
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
  omrButton: {
    color: theme.palette.secondary.main,
    // position: 'absolute',
    right: '30px',
    top: '-50px',
  },
  listcontainer: {
    padding: '0 2% 1% 2%',
  },
}));

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

const StyledButtonUnblock = withStyles({
  root: {
    backgroundColor: '#228B22',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#228B22 !important',
    },
  },
})(Button);

const StyledButtonBlock = withStyles({
  root: {
    backgroundColor: '#FF2E2E',
    color: '#FFFFFF',
    padding: '2px 8px',
    fontSize: '10px',
    '&:hover': {
      backgroundColor: '#FF2E2E !important',
    },
  },
})(Button);

const StyledClearButton = withStyles((theme) => ({
  root: {
    backgroundColor: '#E2E2E2',
    color: '#8C8C8C',
    padding: '8px 15px',
    marginLeft: '30px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
}))(Button);

const UploadOMR = () => {
  const classes = useStyles({});
  const history = useHistory();
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false);

  const { openPreview, closePreview } =
    React.useContext(AttachmentPreviewerContext) || {};
  const [studentList, setStudentList] = useState([]); //need to make empty array by default
  const fileUploadInput = useRef(null);

  const handleFileUpload = async (file) => {
    // console.log('file11', file);
    // console.log('data12345', history?.location?.state);
    if (!file) {
      return null;
    }
    // const isValid = FileValidators(file);
    try {
      const fd = new FormData();

      for (let i = 0; i < file.length; i++) {
        if (
          !(
            file[i].name.toLowerCase().lastIndexOf('.jpeg') > 0 ||
            file[i].name.toLowerCase().lastIndexOf('.jpg') > 0 ||
            file[i].name.toLowerCase().lastIndexOf('.png') > 0
          )
        ) {
          setAlert('error', 'File Not Supported');
          return;
        }
        fd.append('file', file[i]);
      }
      fd.append('section_mapping_id', history?.location?.state?.section?.id);
      fd.append('test_id', history?.location?.state?.test_id?.id);

      // setFileUploadInProgress(true);
      setLoading(true);
      const filePath = await uploadOMRFile(fd);
      // const final = Object.assign({}, filePath);

      if (filePath?.status_code === 200) {
        setAlert('success', filePath?.message);
        setLoading(false);
      } else {
        setAlert('error', 'File upload failed');
        setLoading(false);
      }
    } catch (e) {
      setAlert('error', 'File upload failed');
      setLoading(false);
      // console.log(e);
    }
  };

  // const uploadMarks = (data) => {
  //   console.log('data12', data);
  // };

  const getData = () => {
    setLoading(true);
    axiosInstance
      .get(
        `${endpoints.assessment.OMRResponse}?section_mapping=${history?.location?.state?.section?.id}`
      )
      .then((result) => {
        setLoading(false);
        setStudentList(result?.data?.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (history?.location?.state?.section?.id) {
      getData();
    }
  }, []);

  return (
    <Layout className='accessBlockerContainer'>
      {loading && <Loader />}
      <div className={classes.parentDiv}></div>
      <CommonBreadcrumbs
        componentName='Assessment'
        childComponentName='Upload OMR'
        isAcademicYearVisible={true}
      />
      <div className={classes.listcontainer}>
        <div style={{display: '-webkit-box'}}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <StyledButton
              onClick={() => fileUploadInput.current.click()}
              style={{ width: '200px' }}
            >
              Upload OMR Sheet
            </StyledButton>
            <small>.png, .jpg, .jpeg, .PNG, .JPG, .JPEG format</small>
          </div>
          <StyledButton
            style={{marginLeft: '20px'}}
            onClick={() => getData()}
            startIcon={<SyncIcon style={{ fontSize: '30px' }} />}
          >
            Refresh
          </StyledButton>
        </div>

        <input
          className='file-upload-input'
          type='file'
          multiple
          name='attachments'
          accept='.png, .jpg, .jpeg, .pdf, .PNG, .JPG, .JPEG, .PDF'
          style={{ display: 'none' }}
          onChange={(e) => {
            // handleFileUpload(e);
            handleFileUpload(e.target.files);
            e.target.value = null;
            // onChange('attachments', Array.from(e.target.files)[]);
          }}
          ref={fileUploadInput}
        />
      </div>
      <Paper className={`${classes.root} common-table`} id='singleStudent'>
        {studentList?.length > 0 ? (
          <TableContainer
            className={`table table-shadow view_users_table ${classes.container}`}
          >
            <Table stickyHeader aria-label='sticky table'>
              <TableHead className={`${classes.columnHeader} table-header-row`}>
                <TableRow>
                  <TableCell className={classes.tableCell}>Serial No.</TableCell>
                  <TableCell className={classes.tableCell}>Erp Id</TableCell>
                  <TableCell className={classes.tableCell}>Name</TableCell>
                  <TableCell className={classes.tableCell}>Upload Status</TableCell>
                  <TableCell className={classes.tableCell}>File Name</TableCell>
                  <TableCell className={classes.tableCell}>Scan Status</TableCell>
                  <TableCell className={classes.tableCell}>Tools</TableCell>
                  {/* <TableCell className={classes.tableCell}>Edit</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {studentList.map((items, i) => (
                  <TableRow key={items.id}>
                    <TableCell className={classes.tableCell}>{i + 1}</TableCell>
                    <TableCell className={classes.tableCell}>{items?.erp_id}</TableCell>
                    <TableCell className={classes.tableCell} id='blockArea'>
                      {items?.name}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {items?.omr_sheet !== '' ? <>Yes</> : <>No</>}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {items?.omr_sheet !== '' ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                          }}
                        >
                          {items?.file_name}
                          <SvgIcon
                            component={() => (
                              <VisibilityOutlinedIcon
                                style={{ width: 30, height: 30 }}
                                onClick={() => {
                                  const fileSrc = `${endpoints.lessonPlan.s3erp}${items?.omr_sheet}`;
                                  openPreview({
                                    currentAttachmentIndex: 0,
                                    attachmentsArray: [
                                      {
                                        src: fileSrc,
                                        // src: 'https://www.w3schools.com/html/pic_trulli.jpg',
                                        name: fileSrc.split('.')[
                                          fileSrc.split('.').length - 2
                                        ],
                                        extension:
                                          '.' +
                                          fileSrc.split('.')[
                                            fileSrc.split('.').length - 1
                                          ],
                                      },
                                    ],
                                  });
                                }}
                                color='primary'
                              />
                            )}
                          />
                        </div>
                      ) : (
                        <>--</>
                      )}
                    </TableCell>

                    <TableCell className={classes.tableCell}>
                      {items?.scan_status !== '' ? items?.status : <>--</>}
                    </TableCell>

                    <TableCell className={classes.tableCell} id='blockArea'>
                      {items?.omr_sheet === '' ? (
                        <StyledButton
                          // onClick={() => uploadMarks(items)}
                          onClick={() => fileUploadInput.current.click()}
                          startIcon={<BackupOutlined style={{ fontSize: '30px' }} />}
                        >
                          Upload
                        </StyledButton>
                      ) : (
                        <> -- </>
                      )}
                    </TableCell>
                    {/* <TableCell className={classes.tableCell}>
                      {items?.test_details?.total_marks != null ? (
                        <StyledButton
                          //   onClick={() => uploadMarks(items)}
                          startIcon={<BackupOutlined style={{ fontSize: '30px' }} />}
                        >
                          Edit Marks
                        </StyledButton>
                      ) : (
                        'Marks'
                      )}
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <>
            <NoFilterData data={'Upload OMR Sheets'} />
          </>
        )}
      </Paper>
    </Layout>
  );
};

export default UploadOMR;
