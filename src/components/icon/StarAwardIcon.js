import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    a: {
        fill: '#0455a6',
    },
    b: {
        fill: '#fff',
    }
})

const StarAwardIcon = () => {
    const classes = useStyles({});
    return (
        <SvgIcon width="27" height="27" viewBox="0 0 27 27">
            <g transform="translate(0 0.368)" fill='#0455a6'>
                <circle className={classes.a} cx="13.5" cy="13.5" r="13.5" transform="translate(0 -0.368)"/>
                <path className={classes.b} d="M9,0l2.97,5.966L18,7.257l-4.194,4.979L14.562,19,9,16.111,3.438,19l.757-6.764L0,7.257,6.03,5.966Z" transform="translate(5 3.632)"/>
            </g>
        </SvgIcon>
    )
}

export default StarAwardIcon;