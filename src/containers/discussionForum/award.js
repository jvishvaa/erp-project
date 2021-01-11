import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import endpoints from '../../config/endpoints';
import Award from '../../assets/images/awardnew.svg'
import { SvgIcon } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import './award.scss';

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));
const Awardlist = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { handleAward, list, awardRes } = props;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        handleAward(list)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;



    return (
        <div className="award-pop-up">
            <IconButton
                onClick={handleClick}
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
            </IconButton>
            <div className="award-pop-up">
            <Popover
            className="award-pop-up"
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                style={{border: '1px solid #0455A6'}}
            >
                {
                   awardRes ?  awardRes && awardRes.map((awardName, index) => {
                        return (
                            <>
                                <div className="line-name" key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', }}>
                                        <Avatar style={{
                                            width: ' 27px', height: ' 27px', margin: 10, fontSize: '14px',    marginTop: '20px',


                                            backgroundColor: '#F9AB5D'
                                        }}>{awardName.first_name && awardName.first_name.substring(0, 2)}</Avatar>
                                        <Typography className={classes.typography}>{awardName && awardName.first_name} {awardName && awardName.last_name}</Typography>
                                    </div>
                                    <Typography className={classes.typography}>{awardName && awardName.creation_ago}</Typography>
                                </div>
                                <div>

                                <img src={endpoints.discussionForum.s3 + awardName.award_file} style={{ width: '25px', marginLeft: '60px' }} />
                                </div>
                            </>
                        )
                    })
                : 'No Awards Found'}
            </Popover>
            </div>
        </div>
    )
}

export default Awardlist