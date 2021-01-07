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
import './discussionForum.scss';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import Greatericon from '../../assets/images/greatericon.svg';
import IconButton from '@material-ui/core/IconButton';
import UpdateDeltePopoverClick from './updateAndDeletPopoverClick';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import useInfiniteScroll from "./infiniteScroll";


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
    // const [isFetching, setIsFetching] = useState(false);
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);


    const handleClick = (event, list) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        fetchPostLike(list)
    };

    function fetchMoreListItems() {
        setTimeout(() => {
            setLikelist(prevState => ([...prevState, ...Array.from(Array(20).keys(), n => n + prevState.length + 1)]));
            setIsFetching(false);
        }, 2000);
    }




    const open = Boolean(anchorEl);
    const id = open ? 'transitions-popper' : undefined;

    const fetchPostLike = (list) => {

        axiosInstance.get(`${endpoints.discussionForum.postLike}?post=${list.id}&&type=1`).then((res) => {
            setLikelist(res.data.result.results)
        }).catch(err => {
            console.log(err)
        })


    }
    const setTrueLikeFasle = () => {
        setCallLike(false)
    }


    const { list, index, handleViewmore } = props;
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

                                    style={{ margin: ' 0px 0px 0px 30px', color: "red" }}
                                >
                                    <UpdateDeltePopoverClick />
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
                        <IconButton onClick={(e) => handleClick(e, list)}>
                            <SvgIcon
                                component={() => (
                                    <img

                                        style={{ width: '20px', marginLeft: 20 }}
                                        src={Likeicon}
                                        alt='given'

                                    />
                                )}
                            />
                            <Popper id={id} open={open} anchorEl={anchorEl} transition className="tool-tip">
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
                                                            {isFetching && 'Fetching more list items...'}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Fade>
                                )}
                            </Popper>
                        </IconButton>
                        <SvgIcon
                            component={() => (
                                <img
                                    style={{ width: '50px', marginLeft: 30 }}
                                    src={Answer}
                                    alt='given'
                                />
                            )}
                        />
                        <SvgIcon
                            component={() => (
                                <img

                                    style={{ width: '50px', marginLeft: 30 }}
                                    src={Award}
                                    alt='given'
                                />
                            )}
                        />
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
