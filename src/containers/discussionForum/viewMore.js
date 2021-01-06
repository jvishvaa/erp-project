import React from 'react';
import Grid from '@material-ui/core/Grid';
import Usericon from '../../assets/images/user.svg'
import { SvgIcon, Typography, Divider, Button } from '@material-ui/core';
import moment from 'moment';
import Award from '../../assets/images/award.svg'
import Answer from '../../assets/images/answer.svg'
import LikeIcon from '../../assets/images/Likesmall.svg';
import './discussionForum.scss';



const Viewmore = (props) => {

    const { viewMoreList } = props;
    console.log(viewMoreList, "viewMoreList")
    return (
        <div className="view-more-info">
            <Grid container spacing={3}>
                <Grid item xs={10}>
                    <div className="env-name" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E2E2' }}>
                        <span style={{ color: '#FF6B6B', fontSize: '16px' }}>Enviroment</span>
                    </div>
                    <div className="header-view" >
                        <Grid item xs={5}>
                            <div className="header-view-text">
                                <strong >Impact of Covid on learning</strong>
                            </div>
                        </Grid>
                        <Grid item xs={5} className="textView-header">
                            <div className="text-name-view">
                                <p className="covid-19-view">Covid-19 </p> < p>|</p>
                                <p className="online-learning-view"> Online learning</p >  < p>|</p>
                                <p className="student-view"> Students</p>
                            </div>
                        </Grid>
                    </div>
                    <div className="view-more-user-info-view">
                        <Typography className={"user-info-view"} color="textSecondary" >
                            <div className="user-name-icon-view">
                                <Grid item xs={5} className="icon-headers">
                                    <SvgIcon
                                        component={() => (
                                            <img
                                                style={{ width: '30px', marginTop: '20px' }}
                                                src={Usericon}
                                                alt='given'
                                            />
                                        )}
                                    ></SvgIcon><p style={{ marginLeft: 27, marginTop: 36, color: '#042955' }} className="user-name">{viewMoreList.post_by.first_name} {viewMoreList.post_by.last_name}</p>
                                </Grid>
                                <Grid item xs={5} className="icon-header" >
                                    <div className="time-hours">
                                        <p className="online-learning">{moment.duration(viewMoreList && viewMoreList.post_at).hours()}</p >
                                        <p className="view-more-date">{moment(viewMoreList && viewMoreList.post_at).format('DD-MM-YYYY')}</p>
                                    </div>
                                </Grid>

                            </div>
                        </Typography>
                    </div>
                    <div className="view-more-desciption">
                        <Typography className={"desciption-view"} color="textSecondary" style={{
                            fontSize: '16px',
                            color: '#042955'
                        }}>
                            {viewMoreList.description}
                        </Typography>

                    </div>
                    <Grid item xs={8} className="like-ans">
                        <Divider variant="middle" className="divider" />
                        <div className="like-ans-button">
                            <div className="like-button-view">
                            <Button variant="contained" className="like-clear" >
                                    <SvgIcon
                                        component={() => (
                                            <img
                                                style={{ width: '31px', marginRight: '5px' }}
                                                src={LikeIcon}
                                                alt='given'
                                            />
                                        )}
                                    />
                                    </Button>
                            </div>
                            <div className="ans-button-view">
                            <Button variant="contained" className="ans-clear" >
                                    <SvgIcon
                                        component={() => (
                                            <img
                                                style={{ width: '70px', marginRight: '5px', }}
                                                src={Answer}
                                                alt='given'
                                            />
                                        )}
                                    />
                                    </Button>
                            </div>
                            <div className="award-button-view">
                            <Button variant="contained" className="award-clear" >
                                    <SvgIcon
                                        component={() => (
                                            <img
                                                style={{ width: '70px', marginRight: '5px' }}
                                                src={Award}
                                                alt='given'
                                            />
                                        )}
                                    />
                                    </Button>
                            </div>
                        </div>
                    </Grid>

                </Grid>
            </Grid>
        </div>
    )
}

export default Viewmore;