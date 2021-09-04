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
} from '@material-ui/core';
import '../style.scss';
import ReportAction from './report-actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingBottom: 15,
  },
  cardHeader: {
    paddingBottom: 0,
  },
  avatar: {
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardBody: {
    padding: 0,
    height: 150,
    maxHeight: 150,
    overflowY: 'auto',
    '& .MuiChip-root': {
      marginRight: 5,
    },
    '& .MuiListItemText-primary': {
      display: 'block',
      width: '75%',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  positive_count: {
    backgroundColor: '#228B22',
    color: '#ffffff',
  },
  negative_count: {
    backgroundColor: '#FF2E2E',
    color: '#ffffff',
  },
}));

const ReportStatsWidget = ({ avatar, title, data, ptitle, ntitle, branchIds }) => {
  const classes = useStyles();
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
        action={<ReportAction title={title} branchIds={branchIds} />}
        avatar={
          <Avatar aria-label='report-title' className={classes.avatar}>
            {avatar ? React.createElement(avatar, { fontSize: 'small' }) : null}
          </Avatar>
        }
      />
      <CardContent className={classes.cardBody}>
        <List>
          {data.map((item) => (
            <ListItem>
              <ListItemText primary={item?.detail} />
              <ListItemSecondaryAction>
                <Chip
                  className={classes.positive_count}
                  size='small'
                  label={item?.positive}
                  title={ptitle || ''}
                />
                <Chip
                  className={classes.negative_count}
                  size='small'
                  label={item?.negative}
                  title={ntitle || ''}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ReportStatsWidget;
