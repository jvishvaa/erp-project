import React from 'react';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import {
  CardHeader,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Chip,
  Avatar,
  Box,
} from '@material-ui/core';
import '../style.scss';
import ReportAction from './report-actions';
import { useStyles } from './useStyles';

const ReportStatsWidget = ({ avatar, title, data, ptitle, ntitle }) => {
  const classes = useStyles();
  const renderReportData = () => {
    if (data.length) {
      return (
        <List>
          {data.map((item) => (
            <ListItem>
              <ListItemText primary={item?.detail} />
              <ListItemSecondaryAction>
                {item?.positive >= 0 && (
                  <Chip
                    className={classes.positive_count}
                    size='small'
                    label={item?.positive}
                    title={ptitle || ''}
                  />
                )}
                {item?.negative >= 0 && (
                  <Chip
                    className={classes.negative_count}
                    size='small'
                    label={item?.negative}
                    title={ntitle || ''}
                  />
                )}
                {item?.info >= 0 && (
                  <Chip
                    className={classes.info_count}
                    size='small'
                    label={item?.info}
                    title={ntitle || ''}
                  />
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      );
    } else {
      return <Box className={classes.noDataTag}>No Data Available</Box>;
    }
  };

  return (
    <Card className={`dashboardWidget ${classes.root}`} variant='outlined'>
      <CardHeader
        className={classes.cardHeader}
        titleTypographyProps={{
          className: classes.title,
          variant: 'h6',
          color: 'secondary',
        }}
        title={title}
        action={<ReportAction title={title} />}
        avatar={
          <Avatar aria-label='report-title' className={classes.avatar}>
            {avatar ? React.createElement(avatar, { fontSize: 'small' }) : null}
          </Avatar>
        }
      />
      <CardContent className={classes.cardBody}>{renderReportData()}</CardContent>
    </Card>
  );
};

export default ReportStatsWidget;
