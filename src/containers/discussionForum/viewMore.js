import React from 'react';
import Grid from '@material-ui/core/Grid';
import Usericon from '../../assets/images/user.svg'
import { SvgIcon, Typography, Divider, Button } from '@material-ui/core';
import moment from 'moment';
import Award from '../../assets/images/award.svg'
import Answer from '../../assets/images/answer.svg'
import LikeIcon from '../../assets/images/Likesmall.svg';
import Hoverlist from './hoverList';
import Reactangular from '../../assets/images/Rectangle 2667.svg';
import './discussionForum.scss';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        // minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    paper: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
    typography: {
        margin: 1,
        paddingTop: 12,
        fontSize:12
    }

}));

const Viewmore = (props) => {
    const classes = useStyles();

    // const [hoverDiv, setHover] = React.useState(false);
    const [inputBox, setInputBox] = React.useState(false);
    const [likeList, setLikelist] =  React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { viewMoreList } = props;
    const open = Boolean(anchorEl);
    const id = open ? 'transitions-popper' : undefined;

    const fetchPostLike = (event, list) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        axiosInstance.get(`${endpoints.discussionForum.postLike}?post=${list.id}&&type=1`).then((res) => {
            setLikelist(res.data.result.results)
            console.log(res, "ppopo")
        }).catch(err => {
            console.log(err)
        })


    }

    const openAnswerBox = () => {
        setInputBox(!inputBox)
    }
    return (
        <div className="view-more-info">
            <Grid container spacing={3}>
                <Grid item xs={10}>
                    <div className="env-name" style={{ display: 'flex', justifyContent: 'space-between', }}>
                        <span style={{ color: '#FF6B6B', fontSize: '16px' }}>Enviroment</span>
                    </div>
                    <div className="view-cont">
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
                                    <Grid item xs={5} className="icon-headers" style={{ paddingleft: '5px' }}>
                                        <SvgIcon
                                            component={() => (
                                                <img
                                                    style={{ width: '24px', }}
                                                    src={Usericon}
                                                    alt='given'
                                                />
                                            )}
                                        ></SvgIcon><p style={{ color: '#042955' }} className="user-name">{viewMoreList.post_by.first_name} {viewMoreList.post_by.last_name}</p>
                                    </Grid>
                                    <Grid item xs={5} className="icon-header" >
                                        <div className="time-hours">
                                            <p className="online-learning">{moment(viewMoreList.post_at).format('HH:mm')}</p >
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
                    </div>
                </Grid>
                <Grid item xs={8}>
                    <div className="view-more-post">
                        <div className="post-like">
                            <IconButton onClick={(event)=>fetchPostLike(event, viewMoreList)}>
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={{ width: '36px', marginRight: '5px' }}
                                            src={LikeIcon}
                                            alt='given'
                                        />
                                    )}
                                />
                                  <Popper id={id} open={open} anchorEl={anchorEl} transition className="tool-tip" arrow={true} style={{marginLeft: 60,}}>
                                {({ TransitionProps }) => (
                                    <Fade {...TransitionProps} timeout={350}>
                                        <div className={classes.paper}>
                                            {
                                                likeList && likeList.map((name, index) => {
                                                    return (
                                                        <div className="line-name" key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex', }}>
                                                                <Avatar style={{
                                                                    width: ' 27px', height: ' 27px', margin: 10, fontSize: '14px',

                                                                    backgroundColor: '#F9AB5D'
                                                                }}>{name.first_name && name.first_name.substring(0, 2)}</Avatar>
                                                                <Typography className={classes.typography}>{name && name.first_name} {name && name.last_name}</Typography>
                                                            </div>
                                                            <Typography className={classes.typography}>{name && name.like_creation_ago}</Typography>
                                                            {/* {isFetching && 'Fetching more list items...'} */}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Fade>
                                )}
                            </Popper>
                            </IconButton>
                        </div>
                        <div>
                            <SvgIcon
                                component={() => (
                                    <img
                                        style={{ width: '31px', marginRight: '5px', height: '15px', marginTop: 13 }}
                                        src={Reactangular}
                                        alt='given'
                                    />
                                )}
                            />
                        </div>
                        <div className="post-answer">
                            <IconButton onClick={openAnswerBox}>
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={{ width: '80px', marginRight: '5px', }}
                                            src={Answer}
                                            alt='given'
                                        />
                                    )}
                                />

                            </IconButton>
                        </div>
                        <div>
                            <SvgIcon
                                component={() => (
                                    <img
                                        style={{ width: '31px', marginRight: '5px', height: '15px', marginTop: 13 }}
                                        src={Reactangular}
                                        alt='given'
                                    />
                                )}
                            />
                        </div>
                        <div className="post-award">
                            <IconButton onClick={openAnswerBox}>
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={{ width: '80px', marginRight: '5px' }}
                                            src={Award}
                                            alt='given'
                                        />
                                    )}
                                />
                            </IconButton>
                        </div>

                    </div>
                </Grid>
                {inputBox &&
                    <Grid item xs={9}>
                        <div class="form-group">
                            <span className="input-name">
                                <Avatar style={{ width: ' 25px', height: ' 25px', fontSize: '16px', }}>
                                    {viewMoreList.post_by.first_name.substring(0, 2)}
                                </Avatar>
                                <span className="user-view-name-nfo">
                                    {viewMoreList.post_by.first_name} {viewMoreList.post_by.last_name}
                                </span></span>

                            <input class="form-field" type="text" placeholder="Type comment your comment here..." />

                        </div>
                        <div className="comment-box">
                            <div className="comment-avatar">
                                <div className="comment-avatar-lastseen">
                                    <Avatar style={{ width: ' 25px', height: ' 25px', fontSize: '16px', }}>
                                        {viewMoreList.post_by.first_name.substring(0, 2)}
                                    </Avatar>
                                </div>
                                <div className="last-seen">
                                    <div>{moment(viewMoreList.post_at).format('d')} days ago</div>
                                </div>

                            </div>
                            <div className="comment">
                                <p className="comment-pragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros,
                                pulvinar facilisis justo mollis, auctor consequat urna. Morbi a bibendum metus.
                                Donec scelerisque sollicitudin enim eu venenatis. Duis tincidunt laoreet ex,
                                in pretium orci vestibulum eget. Class aptent taciti sociosqu ad litora torquent
                                per conubia nostra, per inceptos himenaeos. Duis pharetra luctus lacus ut
                                vestibulum. Maecenas ipsum lacus, lacinia quis posuere ut, pulvinar vitae dolor.
                                Integer eu nibh at nisi ullamcorper sagittis id vel leo. Integer feugiat
                                faucibus libero, at maximus nisl suscipit posuere. Morbi nec enim nunc.
                                Phasellus bibendum turpis ut ipsum egestas, sed sollicitudin elit convallis.
                                Cras pharetra mi tristique sapien vestibulum lobortis. Nam eget bibendum metus,
                            non dictum mauris. Nulla at tellus sagittis, viverra est a, bibendum metus.</p>

                            </div>
                            <div className="replay">
                                <a href="#" className="re-btn">Replay</a>
                                <IconButton onClick={openAnswerBox}>
                                    <SvgIcon
                                        component={() => (
                                            <img
                                                style={{ width: '36px', marginRight: '5px' }}
                                                src={LikeIcon}
                                                alt='given'
                                            />
                                        )}
                                    />
                                </IconButton>

                            </div>
                        </div>
                    </Grid>
                }
            </Grid>
        </div>
    )
}

export default Viewmore;