import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Likeicon from '../../assets/images/Likenew.svg';
import { SvgIcon } from '@material-ui/core';
import Answer from '../../assets/images/answernew.svg';
import Award from '../../assets/images/awardnew.svg'
// import Usericon from '../../assets/images/user.svg'
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import Greatericon from '../../assets/images/greatericon.svg';
import IconButton from '@material-ui/core/IconButton';
import UpdateDeltePopoverClick from './updateAndDeletPopoverClick';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Popper from '@material-ui/core/Popper';
import './discussionForum.scss';
import Fade from '@material-ui/core/Fade';
import useInfiniteScroll from "./infiniteScroll";
import Popover from '@material-ui/core/Popover';
import Awardlist from './award';

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
        paddingTop: 7
    }

}));

export default function Enviroment(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const [callLike, setCallLike] = React.useState(false);
    const [likeList, setLikelist] = useState(Array.from(Array(30).keys(), n => n + 1));;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [popoverShow, setpopoverShow] = React.useState(false);
    // const [isFetching, setIsFetching] = useState(false);
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
    const [showPeriodIndex, setShowPeriodIndex] = useState();
    const [showMenu, setShowMenu] = useState(false);
    const [awardRes, setAwardListRes] = React.useState([]);
    const [awardPop, setawardPop] = React.useState(null);
    const [awardPopIndex, setawardPopIndex] = React.useState(null);




    const handleClick = (event, list, index) => {
        setShowPeriodIndex(index)
        setAnchorEl(anchorEl ? null : event.currentTarget);
        setpopoverShow(!popoverShow)
        fetchPostLike(list)
    };

    function fetchMoreListItems() {
        setTimeout(() => {
            setLikelist(prevState => ([...prevState, ...Array.from(Array(20).keys(), n => n + prevState.length + 1)]));
            setIsFetching(false);
        }, 2000);
    }

    const handlePeriodMenuClose = (index) => {
        setShowMenu(false);
        setShowPeriodIndex();
    };




    const open = Boolean(anchorEl);
    const id = open ? 'transitions-popper' : undefined;

    const fetchPostLike = (list) => {

        axiosInstance.get(`${endpoints.discussionForum.postLike}?post=${list.id}&&type=1`).then((res) => {
            setLikelist(res.data.result.results)
        }).catch(err => {
            console.log(err)
        })


    }
    const handleAward = (list) => {
        // var popup = document.getElementById("myPopup");
        // popup.classList.toggle("show");
        axiosInstance.get(`${endpoints.discussionForum.AwardListAPI}${list.id}/award-users-list/`).then(res => {
            if (res.data.status_code === 200) {
                console.log(res.data.result.results, "res.data.result.results")
                setAwardListRes(res.data.result.results);
            }
        }).catch(err => {
            console.log(err)
        })
    }

  

    


    const { list, index, handleViewmore, deletPost } = props;
    const awardOpen = Boolean(awardPop);
    const awardId = awardOpen ? 'simple-popover' : null;
    return (
        <div className="env-card">
            <Card className={classes.root} style={{ border: index % 2 === 0 ? '1px solid #FEE4D4' : '1px solid #DDEF96' }}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" >
                        <div className="text-name">
                            <div style={{ display: 'flex' }}>
                                <p className="covid-19">{list.categories.category_name} </p>
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={{ width: '7px', marginLeft: 10, marginBottom: '8px' }}
                                            src={Greatericon}
                                            alt='given'
                                        />
                                    )}
                                />
                            </div>
                            <div style={{ display: 'flex', marginLeft: 10, }}>
                                <p className="online-learning">UI</p >
                                <SvgIcon
                                    component={() => (
                                        <img
                                            style={{ width: '7px', marginLeft: 10, marginBottom: '8px' }}
                                            src={Greatericon}
                                            alt='given'
                                        />
                                    )}
                                />
                            </div>
                            <div style={{ display: 'flex', marginLeft: 10, justifyContent: 'space-between' }}>
                                <p className="student"> Students</p>
                                <IconButton
                                    aria-label='show more'
                                    aria-haspopup='true'

                                    style={{
                                        margin: ' 0px 0px 0px 60px', color: "red",

                                    }}
                                >
                                    <UpdateDeltePopoverClick deletPost={deletPost} list={list}  index={index} />
                                </IconButton>
                            </div>

                        </div>
                    </Typography>

                </CardContent>
                <CardContent style={{ backgroundColor: index % 2 === 0 ? '#FEE4D4' : '#DDEF96' }}>
                    <Typography className={"user-info"} color="textSecondary" >
                        <div className="user-name-icon">
                            <Avatar style={{ width: ' 25px', marginTop: 7, height: ' 25px', fontSize: '16px', }}>{list.post_by.first_name.substring(0, 2)}</Avatar>
                            <span style={{ marginLeft: -34, marginTop: 10, fontSize: 14, color: '#042955', fontWeight: 600 }}>{list.post_by.first_name} {list.post_by.last_name}</span>
                            <span className="online-learning" style={{ marginTop: 10, fontSize: 14, color: '#042955' }}>{moment.duration(list && list.post_at).hours()}</span >
                            <span className="student" style={{ marginTop: 10, fontSize: 14, color: '#042955' }}>

                                {moment(list && list.post_at).format('MMMM d, YYYY')}
                            </span>

                        </div>
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography className={"desciption"} color="textSecondary" >
                        <strong style={{ fontSize: 16, color: '#042955' }}>{list && list.title}</strong>
                        <p style={{ fontSize: 13, width: 238, color: '#042955' }}>{list && list.description.substring(0, 150)}</p>
                    </Typography>
                </CardContent>
                <Divider variant="middle" />
                <CardActions>
                    <div className="env-icns tooltip" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <IconButton onClick={(e) => handleClick(e, list, index)} 
                        onMouseLeave={handlePeriodMenuClose}
                        >
                            <SvgIcon
                                component={() => (
                                    <img

                                        style={{ width: '20px', marginLeft: 20, backgroundColor: list.is_like === true ? 'red' : '' }}
                                        src={Likeicon}
                                        alt='given'

                                    />

                                )}

                            />
                            {showPeriodIndex === index && likeList ? <Popper id={index} open={open} anchorEl={anchorEl} transition className="tool-tip" >
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
                                                            {isFetching && 'Fetching more list items...'}
                                                        </div>
                                                    )
                                                })
                                            : <span style={{fontSize: 16, color:'#042955', padding: 8}}>No Likes Found</span>}
                                        </div>
                                    </Fade>
                                )}
                            </Popper> : ''}

                        </IconButton>

                        <IconButton onClick={() => handleViewmore(list, true)}>
                            <SvgIcon
                                component={() => (
                                    <img
                                        style={{ width: '50px', marginLeft: 30 }}
                                        src={Answer}
                                        alt='given'
                                    />
                                )}
                            />
                        </IconButton>
                       <>
                       {list && list.awards && <Awardlist handleAward={handleAward} list={list} awardRes={awardRes} />}
                       </>
                            {/* <IconButton className="awardPopup" onClick={(event) => handleAward(event, list, index)}
                           >
                                <SvgIcon
                                    component={() => (
                                        <img

                                            style={{ width: '50px', marginLeft: 30 }}
                                            src={Award}
                                            alt='given'
                                        />
                                    )}
                                />
                                <Popover
                                    id={awardId}
                                    open={awardOpen}
                                    anchorEl={awardPop}
                                    onClose={(e)=>handleCloseAward(e, null)}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Typography className={classes.typography}>The content of the Popover.</Typography>
                                </Popover> */}
                                {/* <span class="simplePopup" id="myPopup">
                                {
                                    awardRes && awardRes.map((awardName, index) => {
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
                                                <img src={endpoints.discussionForum.s3 + awardName.award_file} style={{ width: '28px', marginRight: '100px' }} />
                                            </>
                                        )
                                    })
                                }
                            </span> */}

                            {/* </IconButton> */}
                    </div>

                </CardActions>
                <Divider variant="middle" />
                <CardActions className="view-more-btn">
                    <Button size="small" onClick={() => handleViewmore(list)} className="v-btn">View More</Button>
                </CardActions>

            </Card>
        </div>
    );
}
