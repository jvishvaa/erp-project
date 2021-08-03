import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';

import '../../teacherBatchView/style.scss';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';

export default function ResourceCardComponent(props) {
  const history = useHistory();

  const getClassName = () => {
    let classIndex = `${props.resourceData.class_type}`;

    return [
      `teacherBatchCardActive${classIndex}`,
      `teacherBatchCardInActive${classIndex}`,
      `viewMoreButton${classIndex}`,
    ];
  };

  return (
    <Grid container spacing={2} className='teacherbatchsCardMain'>
      <Grid item md={12} xs={12}>
        <Card
          className={
            props.selectedId === props.resourceData.id
              ? `teacherBatchCardActive ${getClassName()[0]}`
              : `teacherBatchCardInActive ${getClassName()[1]}`
          }
        >
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} style={{ padding: '5px' }}>
              <Typography className='teacherBatchCardLable'>
                {props.resourceData.online_class.title}
              </Typography>
            </Grid>

            <Grid item md={12} xs={12} style={{ padding: '2px' }}>
              <span className='teacherBatchCardLable'>
                {props.resourceData.online_class.subject &&
                  props.resourceData.online_class.subject.reduce((sub) =>
                    sub.subject_name.join()
                  )}
              </span>
            </Grid>
            <Grid item md={12} xs={12} style={{ padding: '2px' }}>
              <span className='teacherBatchCardLable1'>
                Start Date :{' '}
                {moment(props.resourceData.online_class.start_time).format('DD-MM-YYYY')}
              </span>
            </Grid>
            <Grid item md={12} xs={6} style={{ padding: '2px' }}>
              <span className='teacherBatchCardLable1'>
                End Date :{' '}
                {moment(props.resourceData.online_class.end_time).format('DD-MM-YYYY')}
              </span>
            </Grid>

            <Grid item md={12} xs={12} style={{ textAlign: 'right' }}>
              <Button
                variant='contained'
                color='secondary'
                className={`TeacherBatchCardViewMoreButton ${getClassName()[2]}`}
                style={{
                  visibility: props.selectedId === props.resourceData.id ? 'hidden' : 'visible',
                }}
                onClick={(e) => props.handleSelctedClass(props.resourceData)}

              >
                View more
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}

export const ResourceCard = React.memo(ResourceCardComponent);
