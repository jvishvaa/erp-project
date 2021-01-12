import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Usericon from '../../assets/images/user.svg'
import { SvgIcon, Typography, Divider, Button, } from '@material-ui/core';
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
        fontSize: 12
    }

}));

const Viewmore = (props) => {
    const classes = useStyles();

    // const [hoverDiv, setHover] = React.useState(false);
    const [inputBox, setInputBox] = React.useState(false);
    const [likeList, setLikelist] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [answers, setAnswers] = React.useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [showPeriodIndex, setShowPeriodIndex] = useState();
    const [ansChangeValue, setAnsChangeValue] = useState('');
    const [awardRes, setAwardListRes] = React.useState([]);


    const { viewMoreList } = props;
    const open = Boolean(anchorEl);
    const id = open ? 'transitions-popper' : undefined;

    const fetchPostLike = (event, list) => {
        var popup = document.getElementById("myPopup");
        popup.classList.remove("show");
        setAnchorEl(anchorEl ? null : event.currentTarget);
        axiosInstance.get(`${endpoints.discussionForum.postLike}?post=${list.id}&&type=1`).then((res) => {
            setLikelist(res.data.result.results);
            setInputBox(false)
        }).catch(err => {
            console.log(err)
        })


    }


    const getAwardList = (event,list) => {
        var popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
        axiosInstance.get(`${endpoints.discussionForum.AwardListAPI}${list.id}/award-users-list/`).then(res => {
            if (res.data.status_code === 200) {
                setAwardListRes(res.data.result.results);
                setAnchorEl(anchorEl ? null :'');
                setInputBox(false);
            }
        }).catch(err => {
            console.log(err)
        })

    }



    const openAnswerBox = (e, viewMoreList) => {
      
        axiosInstance.get(`${endpoints.discussionForum.postLike}?post=${viewMoreList.id}&&type=2`).then((res) => {
            if (res.data.status_code === 200) {
                setAnchorEl(anchorEl ? null : '');
                setAnswers(res.data.result.results);
                var popup = document.getElementById("myPopup");
                popup.classList.remove("show");
                setInputBox(!inputBox);
            }
        }).catch(err => {
            console.log(err)
        })
    }




    React.useEffect(() => {
        setInputBox(props.anstrue);
    }, []);

    const handleAnswerChange = (event) => {
        setAnsChangeValue(event.target.value)
    }
    // const submitReplay = () => {
    //    if(!ansChangeValue){
    //        alert("Enter Value")
    //    } else{
    //        console.log(ansChangeValue, "ansChangeValue")
    //    }
    // }
    // const openLikeBox = () => {
    //     console.log(viewMoreList, "viewMoreList")
    //     setAnchorEl(anchorEl ? null : '');
    // }

    //   const handlePeriodMenuClose = (index) => {
    //     setShowMenu(false);
    //     setShowPeriodIndex();
    //   };
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
                            <IconButton onClick={(event) => fetchPostLike(event, viewMoreList)}>
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={{ width: '36px', marginRight: '5px' }}
                                            src={LikeIcon}
                                            alt='given'
                                        />
                                    )}
                                />
                                <Popper id={id} open={open} anchorEl={anchorEl} transition className="tool-tip" arrow={true} style={{ marginLeft: 60, }}>
                                    {({ TransitionProps }) => (
                                        <Fade {...TransitionProps} timeout={350}>
                                            <div className={classes.paper}>
                                                {
                                                   likeList && likeList.length > 0 ?  likeList && likeList.map((name, index) => {
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
                                                : <span style={{fontSize: 16, color:'#042955', padding: 8}}>No Likes Found</span> }
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
                            <IconButton onClick={(e) => openAnswerBox(e, viewMoreList)}>
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
                        <div className="post-award" >
                            <IconButton onClick={(event) => getAwardList(event, viewMoreList)} className="popup">
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={{ width: '80px', marginRight: '5px' }}
                                            src={Award}
                                            alt='given'
                                        />
                                    )}
                                />
                                <span class="popuptexts" id="myPopup">
                                    {
                                        awardRes && awardRes.length > 0 ? awardRes && awardRes.map((awardName, index) => {
                                            return (
                                                <>
                                                    <div className="line-name" key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex', }}>
                                                            <Avatar style={{
                                                                width: ' 27px', height: ' 27px', margin: 10, fontSize: '14px',

                                                                backgroundColor: '#F9AB5D'
                                                            }}>{awardName.first_name && awardName.first_name.substring(0, 2)}</Avatar>
                                                            <Typography className={classes.typography}>{awardName && awardName.first_name} {awardName && awardName.last_name}</Typography>
                                                        </div>
                                                        <Typography className={classes.typography}>{awardName && awardName.creation_ago}</Typography>
                                                    </div>
                                                    <img src={endpoints.discussionForum.s3 + awardName.award_file} style={{width: '28px', marginRight:'100px'}} />
                                                </>
                                            )
                                        })
                                    : <span style={{fontSize: 16, color:'#042955', padding: 8}}>No Awards Found</span>}
                                </span>

                            </IconButton>
                        </div>

                    </div>
                </Grid>
                {inputBox === true &&
                    <Grid item xs={9}>
                        <div class="form-group">
                            <span className="input-name">
                                <Avatar style={{ width: ' 25px', height: ' 25px', fontSize: '16px', }}>
                                    {viewMoreList.post_by.first_name.substring(0, 2)}
                                </Avatar>
                                <span className="user-view-name-nfo">
                                    {viewMoreList.post_by.first_name} {viewMoreList.post_by.last_name}
                                </span>
                            </span>

                            <input class="form-field" type="text" placeholder="Type comment your comment here..." onChange={handleAnswerChange} />

                        </div>
                        <div className="comment-box">
                            {
                                answers ? answers && answers.map((ans, index) => {

                                    return (
                                        <>
                                            <div className="comment-avatar" key={index}>
                                                <div className="comment-avatar-lastseen">
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} style={{ display: 'flex' }}>
                                                            <Grid item xs={4} style={{ display: 'flex' }} className="fname-last">
                                                                <Avatar style={{ width: ' 25px', height: ' 25px', fontSize: '16px', }}>
                                                                    {ans.first_name.substring(0, 2)}
                                                                </Avatar>

                                                                <span className="user-view-name-nfo-avatar" style={{ width: ' 100%', }}>
                                                                    {ans.first_name} {ans.last_name}
                                                                </span>
                                                            </Grid>
                                                            <Grid item xs={4} className="ans-creation_ago">
                                                                <div className="last-seen"><span>{ans.creation_ago}</span></div>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                </div>


                                            </div>
                                            <div className="comment">
                                                <p className="comment-pragraph">{ans.answer}</p>
                                            </div>
                                            <div className="replay">
                                                <a href="#" className="re-btn" >Reply</a>
                                                <IconButton>
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
                                        </>

                                    )
                                })
                                    : ''}

                        </div>
                    </Grid>
                }
            </Grid>
        </div>
    )
}

export default Viewmore;
