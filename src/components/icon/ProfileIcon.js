import React from 'react';
import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
    root: {
        display: 'inline',
        '& > *': {
          margin: '0 8px',
        },
    },
    profileIcon: {
        display: 'inline-flex',
        color: '#FFFFFF',
        height: '31px',
        width: '31px',
        fontSize: '15px',
        backgroundColor: '#14B800',
    },
})

const ProfileIcon = ({firstname, lastname, bgColor}) => {
    const classes = useStyles({});
    const firstChar = firstname.charAt(0);
    const secondChar = lastname.charAt(0);
    const userText = firstChar.concat(secondChar);

    return (
        <span className={classes.root}>
            <Avatar
                className={classes.profileIcon}
                style={{backgroundColor: bgColor? bgColor : '#CECECE'}}
            >
                {userText}
            </Avatar>
        </span>
    )
}

export default ProfileIcon;