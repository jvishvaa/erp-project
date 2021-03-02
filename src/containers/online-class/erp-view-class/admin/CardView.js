import React from 'react';
import moment from 'moment';
// import './style.scss';
import { Grid, Card, Button, Typography } from '@material-ui/core';

const CardView = ({ fullData, handleViewMore, selectedViewMore ,viewMoreRef }) => {
  return (
    <>
      <Grid container spacing={2} className='teacherbatchsCardMain'>
        <Grid item md={12} xs={12}>
          <Card
            className={
              (fullData && fullData.id) === (selectedViewMore && selectedViewMore.id)
                ? 'teacherBatchCardActive'
                : 'teacherBatchCardInActive'
            }
          >
            <Grid container spacing={2}>
              <Grid item md={9} xs={9} style={{ padding: '5px' }}>
                {fullData && fullData.online_class && fullData.online_class.course_name && (
                  <span className='teacherBatchCardLable'>{fullData.online_class.course_name}</span>
                )}
                {fullData && fullData.online_class && fullData.online_class.title && (
                  <span className='teacherBatchCardLable'>{fullData.online_class.title}</span>
                )}
              </Grid>
              <Grid item xs={3}>
                <Typography>{moment(fullData.online_class ? fullData.online_class.start_time : '').format('hh:mm A')}</Typography>
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: '5px' }}>
                <span className='teacherBatchCardLable'>
                  {(fullData &&
                    fullData.online_class &&
                    fullData.online_class.subject &&
                    fullData.online_class.subject.length !== 0 &&
                    fullData.online_class.subject.map((item) => (
                      <span>
                        {item.subject_name || ''}
                        &nbsp;
                      </span>
                    ))) ||
                    ''}
                </span>
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: '5px' }}>
                <span className='teacherBatchCardLable1'>
                  Start Date:&nbsp;
                  {/*(fullData &&
                    fullData.online_class &&
                    fullData.online_class.start_time &&
                    new Date(fullData.online_class.start_time)
                      .toString()
                      .split('G')[0]
                      .substring(0, 16)) ||
                  ''*/}
                  {fullData.online_class ? moment(fullData.online_class.start_time).format('DD-MM-YYYY') : ''}
                </span>
              </Grid>
              <Grid item md={12} xs={12} style={{ padding: '5px' }}>
                <span className='teacherBatchCardLable1'>
                  End Date:&nbsp;
                  {/*(fullData &&
                    fullData.online_class &&
                    fullData.online_class.end_time &&
                    new Date(fullData.online_class.end_time)
                      .toString()
                      .split('G')[0]
                      .substring(0, 16)) ||
                  '' */}
                  {fullData.online_class ? moment(fullData.online_class.end_time).format('DD-MM-YYYY') : ''}
                </span>
              </Grid>
              <Grid item md={12} xs={12} style={{ textAlign: 'right' }}>
                <Button
                  variant='contained'
                  color='secondary'
                  className='TeacherBatchCardViewMoreButton'
                  style={{
                    display:
                      (fullData && fullData.id) ===
                      (selectedViewMore && selectedViewMore.id)
                        ? 'none'
                        : '',
                  }}
                  onClick={() => handleViewMore(fullData)}
                >
                  View More
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default CardView;
