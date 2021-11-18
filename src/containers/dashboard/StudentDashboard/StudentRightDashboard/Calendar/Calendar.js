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
    border: `1px dotted ${theme.palette.secondary.main}`,
    // marginLeft: '5px',
  },
  parentContainer: {
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: "2px",
    // height: "250px",
    fontSize: "1em",
  },
}));

export default function Calendar() {
  const classes = useStyles();
  const [eveType, setEveType] = useState();
  const [eventList, setEventList] = useState([]);

  const getDisplayDate = (item) => {
    return item.holiday_start_date === item.holiday_end_date
      ? moment(item.holiday_start_date, 'YYYY-MM-DD').format("DD-MM-YYYY")
      : `${moment(item.holiday_start_date, 'YYYY-MM-DD').format("DD-MM-YYYY")} - ${moment(item.holiday_end_date, 'YYYY-MM-DD').format("DD-MM-YYYY")}`;
  };

  return (
    <div style={{ position: "relative", }}>
      <Grid container className={classes.parentContainer}>
        <Grid item xs={10}>
          {eveType ? (
            <Grid style={{ display: eveType ? "block" : "none" }}>
              <Card>
                <CardContent>
                  <Box className={classes.themeColor}>
                    {eventList.map((item) => {
                      return (
                        <Box>
                          <FiberManualRecordIcon
                            style={{ fontSize: '1rem', marginRight: '5px' }}
                          />
                          {/* maxWidth: '100px', overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: "nowrap" */}
                          <span style={{}}>{item.description.slice(0, 15)}</span>
                          <span style={{ float: 'right' }}>{getDisplayDate(item)}</span>
                        </Box>
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
            <RangeCalender setEventList={setEventList} />
          )}
        </Grid>
        <Grid item xs={2} style={{ display: 'flex', position: 'relative', backgroundColor: 'white' }}>
          <div className={classes.divider}></div>
          <Grid container direction='row' justifyContent='center' alignItems='center'>
            <Grid className={classes.themeColor}>
              <Box
                onClick={() => {
                  setEveType('events');
                }}
                style={{ textAlign: 'center', padding: '5px', cursor: 'pointer' }}
              >
                <h2 style={{ lineHeight: '1.5rem' }}>{eventList.length}</h2>
                <p>Holidays</p>
              </Box>
            </Grid>
            {/* <Grid className={classes.themeColor}>
              <Box
                onClick={() => {
                  setEveType('birthdays');
                }}
                style={{ textAlign: 'center', padding: '10px', cursor: 'pointer' }}
              >
                <h1 style={{ lineHeight: '1.5rem' }}>5</h1>
                <p>Birthdays</p>
              </Box>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
