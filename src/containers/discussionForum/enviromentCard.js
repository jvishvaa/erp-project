import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Likeicon from '../../assets/images/LikeIcon.svg';
import Usericon from '../../assets/images/user.svg'
import { SvgIcon } from '@material-ui/core';
import './discussionForum.scss';
import moment from 'moment';

const useStyles = makeStyles({
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
});

export default function Enviroment(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

 
    const { list , handleViewmore} = props;
    return (
        <div className="env-card">
            <Card className={classes.root} >
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" >
                        <div className="text-name">
                            <p className="covid-19">Covid-19 </p> < p>|</p>
                            <p className="online-learning"> Online learning</p >  < p>|</p>
                            <p className="student"> Students</p>

                        </div>
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography className={"user-info"} color="textSecondary" >
                        <div className="user-name-icon">
                            <SvgIcon
                                component={() => (
                                    <img
                                        style={{ width: '20px', }}
                                        src={Usericon}
                                        alt='given'
                                    />
                                )}
                            ></SvgIcon><p style={{ marginRight: 25 }}>{list.post_by.first_name} {list.post_by.last_name}</p>
                            <p className="online-learning">{moment.duration(list && list.post_at).hours()}</p >
                            <p className="student">{moment(list && list.post_at).format('DD-MM-YYYY')}</p>

                        </div>
                    </Typography>
                </CardContent>
                <CardContent>
                    <Typography className={"desciption"} color="textSecondary" >
                        <strong style={{ fontSize: 16, color: '#042955' }}>Impact of Covid on learning</strong>
                        <p style={{ fontSize: 13, width: 238, color: '#042955' }}>{list && list.description.substring(0, 150)}</p>
                    </Typography>
                </CardContent>
                <Divider variant="middle" />
                <CardActions className="view-more-btn">
                    <SvgIcon
                        component={() => (
                            <img
                                style={{ width: '40px', marginLeft: 20 }}
                                src={Likeicon}
                                alt='given'
                            />
                        )}
                    />

                    <Button size="small" onClick={()=>handleViewmore(list)}>View More</Button>
                </CardActions>

            </Card>
           

        </div>
    );
}
