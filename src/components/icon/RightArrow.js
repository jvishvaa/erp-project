import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    a: {
        fill: '#014b7e',
        stroke: '#014b7e',
        strokeWidth: '2px',
    }
})

const RightArrow = () => {
    const classes = useStyles({});
    return (
        <SvgIcon width="35.56" height="35.56" viewBox="0 0 35.56 35.56">
            <g transform="translate(18.077 33.858) rotate(-135)">
                <g transform="translate(0.007)">
                    <g transform="translate(0)">
                        <path className={classes.a} d="M22.737.82,21.918,0,1.168,20.75V8.133H.007v14.6l14.6,0V21.571H1.988Z" transform="translate(-0.007)"/>
                    </g>
                </g>
            </g>
        </SvgIcon>
    )
}

export default RightArrow;