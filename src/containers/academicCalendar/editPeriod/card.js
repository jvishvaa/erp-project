import React from 'react';
import Button from '@material-ui/core/Button';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import VisibilityIcon from '@material-ui/icons/Visibility';
import classnames from 'classnames';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core';
import './academicStyles.scss';
import axiosInstance from '../../../config/axios';
import { AlertNotificationContext } from '../../.././context-api/alert-context/alert-state';

const useStyles = makeStyles(() => ({
  div: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttoncss: {
    borderRadius: '5px',
  },
  btnc: {
    display: 'flex',
    justifyContent: 'center',
  },
  status: {
    color: 'red',
    marginLeft: '8%',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  status1: {
    color: 'green',
    marginLeft: '8%',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  root: {
    padding: '0px',
    marginTop: '0px',
  },
  cardHeaderWrapper: {
    background: '#efeded',
    margin: '-10% -10% 6% -10%',
    padding: '4%',
  },
  topicHeader: {
    textAlign: 'left',
    fontWeight: 'bold',
    margin: '1% 2%',
  },
  subTopicHeader: {
    textAlign: 'left',
    margin: '3% 2% 0%',
    fontSize: '12px',
  },

  cardStatusWrapper: {
    textAlign: 'left',
    margin: '0% 0% 5% -4%',
  },

  cardVisibilityWrapper: {
    display: 'flex',
    jKCustifyContent: 'space-between',
    marginBottom: '-10%',
  },

  divsty: {
    border: '1px solid #4a90e2',
    padding: '2% 2% 0% 2%',
    borderRadius: '10%',
    // margin: '0% 50% 0% -4%',
    marginRight: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
}));
export default function Cards({
  setPeriodUI,
  periodId,
  uniqueIdd,
  setUniqueIdd,
  chapterId,
  setAssignedTopic,
  selectedChapter,
}) {
  const classes = useStyles();
  const [periodsList, setPeriosLists] = useState([]);
  const [showAssignButton, setShowAssignButton] = React.useState(false);
  const [uniqueIndex, setUniqueIndex] = React.useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const [result, setTopicResult] = useState(null);

  useEffect(() => {
    if (chapterId) {
      getLessonPlanTopic();
    }
  }, [selectedChapter]);

  const handleAssign = () => {
    axiosInstance
      .post(`/period/assign-topic-period/`, {
        period: periodId,
        topic_id: uniqueIdd,
      })
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          setTopicResult(result?.data?.result);
          setAssignedTopic(result?.data?.result?.id);
          setPeriodUI('lessonPlanTabs');
        } else if (result?.data?.status_code === 404) {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((err) => {
        setAlert('error', err?.message);
      });
  };

  const unique = () => {
    let abc = periodsList?.findIndex((item) => {
      return item.status === 'Yet To Start';
    });
    setUniqueIndex(periodsList[abc]?.id);
    setUniqueIdd(periodsList[abc]?.id);
  };

  const getLessonPlanTopic = () => {
    axiosInstance
      .get(`/period/lp-topic-view/?chapter=${selectedChapter?.id}&period_id=${periodId}`)
      .then((result) => {
        if (result?.data?.status_code === 200) {
          setAlert('success', result?.data?.message);
          const lists = result.data?.result;
          setPeriosLists(lists);
        } else {
          setAlert('error', result?.data?.message);
        }
      })
      .catch((error) => {
        setAlert('error', error?.message);
      });
  };

  useEffect(() => unique(), [periodsList, uniqueIdd]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Card className={classes.root}>
        <Card className={classes.root}>
          <CardContent style={{ boxSizing: 'border-box' }}>
            <Grid container xs={12} sm={12} md={12} spacing={1}>
              {periodsList?.map((data, index) => (
                <PeriodCard
                  key={index}
                  data={data}
                  showAssignButton={showAssignButton}
                  setShowAssignButton={setShowAssignButton}
                  periodsList={periodsList}
                  uniqueIndex={uniqueIndex}
                  uniqueIdd={uniqueIdd}
                />
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Card>
      {showAssignButton ? (
        <div className='assign'>
          <Button
            size='small'
            color='primary'
            onClick={handleAssign}
            style={{ backgroundColor: '#4a90e2', width: '10%', borderRadius: '5px' }}
          >
            {' '}
            Assign
          </Button>
        </div>
      ) : (
        ''
      )}
    </>
  );
}

function PeriodCard(props) {
  const [isAdded, setIsAdded] = useState(false);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid item xs={6} sm={3} md={3} spacing={2}>
      <Card className={classes.root}>
        <CardContent>
          <div className={classes.cardHeaderWrapper}>
            <div className={classes.topicHeader}>{props.data.period_name}</div>
            <div className={classes.subTopicHeader}>{props.data.period_name}</div>
          </div>
          <div className={classes.cardStatusWrapper}>
            Status:
            <span
              className={classnames({
                [classes.status]: props?.data?.status === 'Completed',
                [classes.status1]: props?.data?.status === 'Yet To Start',
              })}
            >
              {props?.data?.status}
            </span>
          </div>
          <div class={classes.cardVisibilityWrapper}>
            <div className={classes.divsty}>
              <VisibilityIcon style={{ height: 20 }} />
            </div>
            <div className='cardConditionBtn'>
              {props.data.id === props.uniqueIndex ? (
                <Button
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: '#4a90e2',
                  }}
                  size='small'
                  className={classes.buttoncss}
                  onClick={(e) => {
                    props.setShowAssignButton(true);
                    setIsAdded(true);
                  }}
                >
                  {' '}
                  <AddCircleOutlineIcon
                    style={{ width: '30%', marginRight: '20%' }}
                  />{' '}
                  {isAdded ? 'Added' : 'Add'}
                </Button>
              ) : (
                ''
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
}
