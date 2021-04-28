import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Divider, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import BlockOutlined from '@material-ui/icons/BlockOutlined';
//import useStyles from './useStyles';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    padding: '1rem',
    borderRadius: '10px',
    width: '94%',
    margin: '1.5rem auto',
  },
  title: {
    fontSize: '1.1rem',
  },
  content: {
    fontSize: '0.9rem',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
  },
  textRight: {
    textAlign: 'right',
  },
}));

const SubjectCard = (props) => {
    const {
        data,
        handleDelete,
        handleEditSubject,
    } = props;

    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <Grid container spacing={2}>
                <Grid container item>
                    <Grid item xs={6}>
                        <Box>
                            <Typography
                                className={classes.title}
                                variant='p'
                                component='p'
                                color='secondary'
                            >
                                Topic Name
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                className={classes.content}
                                variant='p'
                                component='p'
                                color='secondary'
                                title={data?.topic_name}
                                noWrap
                            >
                                {data.topic_name? data.topic_name : ''}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className={classes.textRight}>
                        <Box>
                            <Typography
                                className={classes.title}
                                variant='p'
                                component='p'
                                color='secondary'
                            >
                                Cahpter Name
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                className={classes.content}
                                variant='p'
                                component='p'
                                color='secondary'
                                align='right'
                            >
                                {data.chapter?.chapter_name}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item container>
                    <Grid item xs={6}>
                        <Box style={{ width: '100%', display: 'flex', justifyContent: 'left' }}>
                            <IconButton
                                className='removePadding'
                                onClick={() => {
                                    handleEditSubject(
                                        data.id,
                                        data.chapter.id,
                                        data.topic_name
                                )}}
                            >
                                <EditOutlinedIcon color='primary' />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className={classes.textRight}>
                        <IconButton
                            className='removePadding'
                            onClick={() => {
                                handleDelete(props.data);
                            }}
                        >
                            <DeleteOutlineIcon color='primary' />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default SubjectCard;
