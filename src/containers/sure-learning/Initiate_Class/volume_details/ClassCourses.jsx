import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  makeStyles,
  Paper,
  withStyles,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import axios from 'axios';
import MediaCard from '../../components/volumecards'
import CommonBreadcrumbs from '../../../../components/common-breadcrumbs/breadcrumbs';
import { AlertNotificationContext } from '../../../../context-api/alert-context/alert-state';
import endpoints from 'config/endpoints';
import Layout from '../../../Layout';
import './class_courses.scss';
import { Autocomplete } from '@material-ui/lab';

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

const ClassCourses = ({history}) => {
  const classes = useStyles({});
  const { setAlert } = useContext(AlertNotificationContext);
  const [volumes, setValumes] = useState([]);
  const [moduleId, setModuleId] = useState(null);
  const udaanDetails = JSON.parse(localStorage.getItem('udaanDetails')) || [];
  const udaanToken = udaanDetails?.personal_info?.token;
  const moduleData = udaanDetails?.role_permission?.modules;

  useEffect(() => {
    if (moduleData && moduleData.length) {
      moduleData.forEach((item) => {
        if (item.module_name === 'Self_Courses') {
          setModuleId(item.module);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (moduleId !== null) {
      const classId = sessionStorage.getItem('Initiate_Class_Id');
      getAllCoursesInformation(classId);
    }
  }, [moduleId]);

  const getAllCoursesInformation = async (id) => {
    axios
      .get(`${endpoints.sureLearning.filterSubject}?trainer=true&class_id=${id}`, {
        headers: {
          Authorization: `Bearer ${udaanToken}`,
          module: moduleId,
        },
      })
      .then((response) => {
        // response.data.results.map((eachResult) => {
          setValumes(response.data);
        // });
      })
      .catch((error) => {
        setAlert('error', 'Something went worng try again');
      });
  };

  const startTrain = (volumeData) => {
    console.log(volumeData.id, 'volume');
    if (volumes && volumes.length) {
      volumes.forEach((con, index) => {
        if (con.id === volumeData.id && index > 0) {
          console.log(index - 1, 'index');
          let int = index - 1;
          console.log(volumes[int], 'prev typ');
          console.log(int, 'prev');
          if (volumes[index - 1].is_completed) {
            sessionStorage.setItem('selected_volume', volumeData.id);
            // history.push('/allchapters');
            history.push({
              pathname: '/allchaptersInduction',
              state: volumeData,
              module: 'inductionTraining',
            });
            
          } else {
            setAlert('warning', 'please complete previous chapter');
          }
        }
        if (con.id === volumeData.id && index < 1) {
          sessionStorage.setItem('selected_volume', volumeData.id);
          // history.push('/allchapters');
          history.push({
            pathname: '/sure-learning/allchaptersInduction',
            state: volumeData,
            module: 'inductionTraining',
          });
          
        }
      });
    }
  };


  return (
    <Layout className='accessBlockerContainer'>
      <div className={classes.parentDiv}>
        <CommonBreadcrumbs
          componentName='Sure Learning'
          childComponentName='Scheduled Classes'
          isAcademicYearVisible={true}
        />

        <div className='listcontainer'>
          <div className='filterStudent' style={{ marginLeft: '20px' }}></div>

          <div className='listcontainer'>
            <div className='filterStudent' style={{ width: '100%' }}>
              <Typography
                color='primary'
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                Scheduled Classes
              </Typography>
            </div>
          </div>
          <div style={{ width : '100%' }}>
          {volumes &&
            <MediaCard allVolumes = {volumes} startTrain = {startTrain}/>
          }
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClassCourses;
