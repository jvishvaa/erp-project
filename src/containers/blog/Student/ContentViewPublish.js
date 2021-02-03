/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import moment from 'moment';

// import { connect } from 'react-redux';
import {
  Grid,
  Card,
  Button,
  Typography,
  CardActions,
  CardMedia,
  CardContent,
  Paper,
  CardHeader,
  Divider,
  TextField,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import Avatar from '@material-ui/core/Avatar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { withRouter } from 'react-router-dom';
import axios from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import CommonBreadcrumbs from '../../../components/common-breadcrumbs/breadcrumbs';
import SideBar from './sideBar';
import Layout from '../../Layout';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: 20,
  },
  cardRoot: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: 10,
    border: '1px solid #D5D5D5',
  },
  sideBlogs: {
    width: 200,
    height: 289,
    borderRadius: 16,
    marginBottom: 20,
  },
  media: {
    height: 300,
    borderRadius: 16,
  },
  author: {
    marginTop: 20,
    borderRadius: 16,
    border: '1px solid #D5D5D5',
  },
  reviewCard: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

          
class ContentViewPublish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relatedBlog: true,
      starsRating: 0,
      data: this.props.location.state.data && this.props.location.state.data,
      tabValue :this.props.location.state.tabValue && this.props.location.state.tabValue,
      roleDetails: JSON.parse(localStorage.getItem('userDetails')),


    };

  }
  




  
  render() {
    const { classes } = this.props;
    const { data,feedbackrevisionReq} = this.state;
   
    return (
      <div className='layout-container-div'>
        <Layout className='layout-container'>
          <div className='message_log_wrapper' style={{ backgroundColor: '#F9F9F9' }}>
            <div
              className='message_log_breadcrumb_wrapper'
              style={{ backgroundColor: '#F9F9F9' }}
            >
              <CommonBreadcrumbs componentName='Blog' />
              <div className='create_group_filter_container'>
                <div className={classes.root}>
                  <Grid container spacing={3}>
                  <Grid item xs={12}>
                      <Button
                        style={{ cursor: 'Pointer' }}
                        onClick={() => window.history.back()}
                        align='right'
                      >
                        <i>Back</i>
                      </Button>
                      </Grid>
                      <Grid item xs={9}>
                      <Card className={classes.cardRoot}>
                        <Typography
                          variant='h5'
                          component='h2'
                          style={{ marginBottom: 10 }}
                        >
                            {data.title}
                        </Typography>
                        <CardMedia className={classes.media} image={data.thumbnail} />
                        <CardContent> {tabValue  && data.comment ? 
                        <CardContent> <Typography
                        style={{color:'red', fontSize:'12px'}}
                      >Comment:{data.comment}
                     
                      </Typography>
                      <Typography> Commented By:{data && data.commented_by && data.commented_by.first_name}</Typography>
                      </CardContent>  :''}</CardContent>
                        <CardHeader
                          className={classes.author}
                          avatar={
                            <Avatar aria-label='recipe' className={classes.avatar}>
                              R
                            </Avatar>
                          }
                       
                          title={data.author.first_name}
                          subheader=
                          {data && moment(data.created_at).format('MMM DD YYYY')}

                        />
                        <CardContent>
                          <Typography variant='body2' color='textSecondary' component='p'>
                            {data.content}
                          </Typography>
                          <Typography component='p'  style={{paddingRight: '650px', fontSize:'12px'}}
>
                          TotalWords : {data.word_count}
                          </Typography>

                        </CardContent>
                        <CardActions>
                        
                       
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}
export default withRouter(withStyles(styles)(ContentViewPublish));
