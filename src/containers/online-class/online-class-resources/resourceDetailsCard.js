import React from 'react';
import { Divider, makeStyles,Grid, withStyles, Typography, Button } from '@material-ui/core';
import moment from 'moment';
import ResourceClass from './resourceClass';
import { useHistory } from 'react-router-dom';
import '../../teacherBatchView/style.scss';
import '../erp-view-class/admin/index.css'
import { useLocation } from 'react-router-dom';
import { ResourceDialog } from './resourceDialog';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CloseIcon from '@material-ui/icons/Close';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import APIREQUEST from "../../../config/apiRequest";

const useStyles = makeStyles({
  
  classHeaderText: {
    display: 'inline-block',
    color: '#014B7E',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    lineHeight: '25px',
  },
  closeDetailCard: {
    float: 'right',
    fontSize: '20px',
    color: '#014B7E',
  },
  
});

const StyledButton = withStyles({
  root: {
    marginTop: '6px',
    height: '31px',
    width: '100%',
    fontSize: '18px',
    fontFamily: 'Poppins',
    fontWeight: '',
    lineHeight: '27px',
    textTransform: 'capitalize',
    backgroundColor: '#ff6b6b',
    borderRadius: '10px',
  },
})(Button);

export default function ResourceDetailsCardComponent(props) {
  const classes = useStyles({});
  const location = useLocation();
  const { setAlert } = React.useContext(AlertNotificationContext);
  const [noOfPeriods, setNoOfPeriods] = React.useState([]);
  const startDate = new Date(props.resourceData.online_class.start_time);
  const endDate = new Date(props.resourceData.online_class.end_time);
  const Difference_In_Time = endDate.getTime() - startDate.getTime();
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  let periods;
  if (moment(startDate).format('ll') === moment(endDate).format('ll')) {
    periods = 0;
  } else {
    periods = Math.floor(Difference_In_Days + 1);
  }

  let dateArray = [];
  for (var i = 0; i <= periods; i++) {
    let day;
    if (i === 0) {
      day = startDate.setDate(startDate.getDate());
    } else {
      day = startDate.setDate(startDate.getDate() + 1);
    }
    dateArray.push(day);
  }
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };
  const getClassName = () => {
    let classIndex = `${props.resourceData.class_type}`;
   

    return [
      `teacherBatchFullViewMainCard${classIndex}`,
      `teacherBatchFullViewHeader${classIndex}`,
      `addTextColor${classIndex}`,
      `darkButtonBackground${classIndex}`,
    ];
  };

  const handleSetData = (response) => {
    const bifuracionArray = ['today', 'upcoming', 'completed', 'cancelled'];
    return (
      response.filter((element) => element?.class_status?.toLowerCase() === bifuracionArray[props.tabValue]) ||
      []
    );
  };

  const msApiOnclsDetails = () =>{
    APIREQUEST("get", `/oncls/v1/${props?.resourceData?.id}/oncls-details/`)
    .then((res)=>{
      const result = handleSetData(res.data.data)
      setNoOfPeriods(result);
    })
    .catch((error) => setAlert('error', error.message));
  }

  React.useEffect(() => {
    if (props.resourceData) {
      setNoOfPeriods([]);
      if(JSON.parse(localStorage.getItem('isMsAPI'))){
        msApiOnclsDetails();
        return;
      }
      axiosInstance
        .get(
          `erp_user/${props.resourceData && props.resourceData.id}/online-class-details/`
        )
        .then((res) => {
          const result = handleSetData(res.data.data)
          setNoOfPeriods(result);
        })
        .catch((error) => setAlert('error', error.message));
    }
  }, [props.resourceData]);

  return (
    <Grid container spacing={2} className='teacherBatchFullViewMainParentDiv'>
      <Grid item md={12} xs={12} className='teacherBatchFullViewMainDiv'>
      <Card className={`teacherBatchFullViewMainCard ${getClassName()[0]}`}>
        <Grid
          container
          spacing={2}
          className={`teacherBatchFullViewHeader ${getClassName()[1]}`}
        >
          <Grid item xs={10}>
            <Typography className={classes.classHeaderText} style={{ color: 'white' }}>
              {props.resourceData.online_class.title}
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right' }}>
            <CloseIcon
            style={{ color: 'white' }}
              onClick={(e) => props.hendleCloseDetails()}
             
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item md={12} xs={12} className='detailCardViewContainer'>
            <Divider className='fullViewDivider' />
            {noOfPeriods &&
              noOfPeriods.length > 0 &&
              noOfPeriods.map((data) => (
                <ResourceClass
                  key={data.zoom_id}
                  date={data.date}
                  resourceId={props.resourceData.online_class.id}
                  classIndex={props.resourceData.class_type}
                />
              ))}
          </Grid>
        </Grid>

        <ResourceDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          title={props.resourceData.online_class.title}
          resourceId={props.resourceData.online_class.id}
          startDate={props.resourceData.online_class.start_time}
          endDate={props.resourceData.online_class.end_time}
          hendleCloseDetails={props.hendleCloseDetails}
        />
      </Card>
    </Grid>
    </Grid>
  );
}

export const ResourceDetailsCard = React.memo(ResourceDetailsCardComponent);
