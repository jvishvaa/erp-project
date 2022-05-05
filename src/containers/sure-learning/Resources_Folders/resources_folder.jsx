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
} from '@material-ui/core';
import axios from 'axios';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import folder from 'assets/images/Folder.png'
import Layout from '../../Layout';
import { Autocomplete } from '@material-ui/lab';
import './resorces_folder.scss';

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
    marginLeft: '20px',
    '&:hover': {
      backgroundColor: '#E2E2E2 !important',
    },
  },
}))(Button);

const ResourcesFolderList = ({history}) => {
  const classes = useStyles({});
  const [resourcesFolder, setResourcesFolder] = useState([]);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;
  const [moduleId, setModuleId] = useState(null);

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
      getResourcesFolder();
    }
  }, [moduleId]);

  const getResourcesFolder = () => {
    axios
      .get(`${endpoints.sureLearning.getResourceFolder}`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        setResourcesFolder(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleResourceList = (eachData) => {
    history.push("/sure_learning/resources_containt");
    sessionStorage.setItem("folderDetails", JSON.stringify(eachData));
    // console.log(eachData);
  };


  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Resource Folders'
          isAcademicYearVisible={true}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Typography
              className='folder-heading'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'center',
                margin: 'auto',
                fontWeight: 'bolder',
                fontSize: '20px',
                textTransform: 'uppercase',
              }}
            >
              Resource Folders
            </Typography>
            <Grid
              className='folder-list'
              style={{ margin: '2% 0 0 0' }}
              container
              item
              spacing={3}
            >
              {resourcesFolder &&
                resourcesFolder.map((eachData, index) => {
                  return (
                    <Grid item xs={3}>
                      <div
                        className='folders'
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleResourceList(eachData)}

                        // onClick={handleResourceList}
                      >
                        <img style={{ height: '50px', width: '100px' }} src={folder} />
                        <Typography style={{ margin: '0 0 0 8%' }} key={eachData.id}>
                          {eachData.folder_name}
                        </Typography>
                      </div>
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        </Box>
      </div>
    </Layout>
  );
};

export default ResourcesFolderList;
