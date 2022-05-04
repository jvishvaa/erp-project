import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  makeStyles,
  Paper,
  withStyles,
  Typography,
  TextField,
  Box,
  Grid,
  Dialog,
} from '@material-ui/core';
import FileViewer from 'react-file-viewer';
import axios from 'axios';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import folder from 'assets/images/Folder.png';
import Layout from '../../Layout';
import { Autocomplete } from '@material-ui/lab';
import './resorces.scss';
import ResourceDetailViewer from './resources_details';

const useStyles = makeStyles((theme) => ({
  FeedbackFormDialog: {
    marginLeft: '6px',
  },
  filters: {
    marginLeft: '15px',
  },
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
}));

const Resources = () => {
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const classes = useStyles({});;
  const [resourceList, setResourceList] = useState([]);
  const folderDetails = JSON.parse(sessionStorage.getItem('folderDetails'));
  const [selectedDocmentToView, setSelectedDocumentToView] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;

  const handleOpenResourceDetail = (docs) => {
    setSelectedDocumentToView(docs);
    setOpenResourceDialog(true)
  };

  const handleCloseResourceDetail = () => {
    setSelectedDocumentToView(null);
    setOpenResourceDialog(false)
  }

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        if (item.module_name === 'Resources_data') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId !== null) {
      getResourcesFolder(folderDetails.id);
    }
  }, [moduleId]);

  const getResourcesFolder = (folderDetails) => {
    axios
      .get(`${endpoints.sureLearning.GetAllResources}?folder_id=${folderDetails}`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setResourceList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Resource Files'
          isAcademicYearVisible={true}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            {/* <Typography
            className="folder-heading"
            style={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
              margin: "auto",
              fontWeight: "bolder",
              fontSize: "20px",
              textTransform: "uppercase",
            }}
          >
            Resources
          </Typography> */}
            <Grid
              className='folder-list'
              style={{ margin: '2% 0 0 0' }}
              container
              item
              spacing={3}
            >
              {resourceList &&
                resourceList.map((eachData, index) => {
                  return (
                    <>
                      <Grid item xs={3}>
                        <div
                          className='folders'
                          style={{ cursor: 'pointer' }}
                          // onClick={() => handleResourceList(eachData)}

                          // onClick={handleResourceList}
                        >
                          <Grid
                            onClick={(e) => {
                              // window.open(eachData?.documents, "_blank");
                              handleOpenResourceDetail(eachData?.documents);
                            }}
                          >
                            {eachData?.documents?.endsWith('.mp4') ||
                            eachData?.documents?.endsWith('.mp3') ||
                            eachData?.documents?.includes('.mp4') ||
                            eachData?.documents?.includes('.mp3') ? (
                              <video
                                id='documents-iframe'
                                style={{
                                  width: '150px',
                                  // objectFit: 'contain',
                                  height: '150px',
                                  // height: fullscreen ? '92vh' : '69vh',
                                }}
                                controls
                                // autoPlay
                                controlsList='nodownload'
                              >
                                {eachData?.documents?.endsWith('.mp4') ||
                                eachData?.documents?.includes('.mp4') ? (
                                  <source src={eachData?.documents} type='video/mp4' />
                                ) : (
                                  <source src={eachData?.documents} type='audio/mp3' />
                                )}
                                Your browser does not support HTML5 video.
                              </video>
                            ) : eachData?.documents?.endsWith('.docx') ||
                              eachData?.documents?.endsWith('.doc') ||
                              eachData?.documents?.endsWith('.xlsx') ||
                              eachData?.documents?.endsWith('.pdf') ||
                              eachData?.documents?.endsWith('.csv') ? (
                              <div style={{ height: '100px', width: '250px' }}>
                                <FileViewer
                                  fileType={
                                    eachData?.documents?.endsWith('.docx')
                                      ? 'docx'
                                      : eachData?.documents?.endsWith('.doc')
                                      ? 'doc'
                                      : eachData?.documents?.endsWith('.xlsx')
                                      ? 'xlsx'
                                      : eachData?.documents?.endsWith('.pdf')
                                      ? 'pdf'
                                      : 'csv'
                                  }
                                  filePath={eachData?.documents}
                                />
                              </div>
                            ) : eachData?.documents?.endsWith('.pptx') ||
                              eachData?.documents?.endsWith('.ppt') ? (
                              <iframe
                                id='documents-iframe'
                                title='documents-iframe'
                                src={
                                  eachData?.documents?.endsWith('.pptx')
                                    ? `https://view.officeapps.live.com/op/embed.aspx?src=${eachData?.documents}`
                                    : `https://view.officeapps.live.com/op/embed.aspx?src=${eachData?.documents}`
                                }
                                // src={isPPt ? pptFileSrc : `${src}#toolbar=0&navpanes=0&scrollbar=0`}
                                // src={isPPt ? pptFileSrc : `http://docs.google.com/gview?url=${src}&embedded=true#toolbar=0&navpanes=0&scrollbar=0`}
                                className='documents-viewer-frame-preview-iframe'
                              />
                            ) : (
                              <img
                                style={{ height: '100px', width: '200px' }}
                                src={eachData?.documents}
                              />
                            )}
                          </Grid>
                          {/* <img
                        style={{ height: "50px", width: "100px" }}
                        src={folder}
                      /> */}
                          <Grid item>
                            <Typography
                              // align="center"
                              // display="block"
                              // variant="caption"
                              style={{
                                margin:
                                  eachData?.documents?.endsWith('.mp4') ||
                                  eachData?.documents?.endsWith('.mp3') ||
                                  eachData?.documents?.includes('.mp4') ||
                                  eachData?.documents?.includes('.mp3') ||
                                  eachData?.documents?.endsWith('.docx') ||
                                  eachData?.documents?.endsWith('.doc') ||
                                  eachData?.documents?.endsWith('.xlsx') ||
                                  eachData?.documents?.endsWith('.pdf') ||
                                  eachData?.documents?.endsWith('.csv') ||
                                  eachData?.documents?.endsWith('.pptx') ||
                                  eachData?.documents?.endsWith('.ppt')
                                    ? '0px 0px 0px 35%'
                                    : '0px 0px 0px 15%',
                              }}
                              key={eachData.id}
                            >
                              {eachData.resources_title}
                            </Typography>
                          </Grid>
                        </div>
                      </Grid>
                    </>
                  );
                })}
            </Grid>
          </Grid>
        </Box>
      </div>
      <Dialog
        maxWidth='xl'
        open={openResourceDialog}
        onClose={handleCloseResourceDetail}
      >
        <ResourceDetailViewer
          close={handleCloseResourceDetail}
          resource={selectedDocmentToView}
          eachData={resourceList}
        />
      </Dialog>
    </Layout>
  );
};

export default Resources;
