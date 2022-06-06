import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Button, Box, Card, CardContent, CardActions } from '@material-ui/core';
import RangeCalender from '../../../../../components/RangeCalendar';
import { makeStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  themeColor: {
    color: theme.palette.secondary.main,
  },
  divider: {
    height: '90%',
    top: '5%',
    position: 'absolute',
    // border: `1px dotted ${theme.palette.secondary.main}`,
    // marginLeft: '5px',
  },
  parentContainer: {
    border: '1px solid #d3d1d1',
    borderRadius: '5px',
    overflow: 'hidden',
    marginTop: '2px',
    // height: "250px",
    fontSize: '1em',
    display: 'flex',
    flexDirection: 'column'
  },
}));

export default function Calendar() {
  const classes = useStyles();
  const [eveType, setEveType] = useState();
  const [eventList, setEventList] = useState([]);

  const getDisplayDate = (item) => {
    return item.holiday_start_date === item.holiday_end_date
      ? moment(item.holiday_start_date, 'YYYY-MM-DD').format('DD-MM-YYYY')
      : `${moment(item.holiday_start_date, 'YYYY-MM-DD').format('DD-MM-YYYY')} - ${moment(
        item.holiday_end_date,
        'YYYY-MM-DD'
      ).format('DD-MM-YYYY')}`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <Grid container className={classes.parentContainer}>
        <div>
          {eveType ? (
            <Grid style={{ display: eveType ? 'block' : 'none' }}>
              <Card>
                <CardContent>
                  <Box className={classes.themeColor}>
                    {eventList.map((item) => {
                      return (
                        <Grid container spacing={2}>
                          <Grid item xs={1}>
                            <FiberManualRecordIcon
                              style={{ fontSize: '1rem', marginRight: '5px' }}
                            />
                          </Grid>
                          <Grid item xs={5}>
                            {item.title}
                          </Grid>
                          <Grid item xs={6} style={{ fontSize: '12px', margin: 'auto 0' }} >
                            {getDisplayDate(item)}
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Box>
                </CardContent>
                <CardActions>
                  <Box style={{ marginLeft: 'auto' }}>
                    <Button
                      color='secondary'
                      style={{
                        backgroundColor: 'transparent',
                        fontSize: '1rem',
                        padding: '0px 15px',
                      }}
                      variant='outlined'
                      onClick={() => {
                        setEveType(null);
                      }}
                    >
                      Back
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ) : (
            <div>
              <div style={{textAlign : 'center', fontSize: '20px',fontWeight: '600' , color: '#464D57'}} >
                Calendar
              </div>
            <RangeCalender setEventList={setEventList} />
            </div>
          )}
      </div>
      <div style={{ display: 'flex', position: 'relative', backgroundColor: 'white' , padding: '5px' }}>
       
            <Box
              onClick={() => {
                setEveType('events');
              }}
              style={{ textAlign: 'center', padding: '5px', cursor: 'pointer',minWidth: '30%' , border : '1px solid #2DC8A8' , display: 'flex' , justifyContent: 'space-between' , margin: 'auto 0', borderRadius: '10px' }}
            >
              <h2 style={{ fontSize: '15px' , background: '#2DC8A8' , borderRadius: '25px' , minWidth: '25%' , color: 'white' }}>{eventList.length}</h2>
              <p  style={{ fontSize: '15px' , color: '#2DC8A8'  , marginLeft: '1%'}}>Holidays</p>
            </Box>   
      </div>
    </Grid>
    </div >
  );
}
