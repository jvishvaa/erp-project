import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    a: {
        fill: '#014b7e',
        stroke: '#b1b1b1',
        strokeWidth: '2px',
    }
})

const LeftArrow = () => {
    const classes = useStyles({});
    return (
        <SvgIcon width="24.825" height="24.825" viewBox="0 0 24.825 24.825">
            <g transform="translate(12.188 1.776) rotate(45)">
                <g transform="translate(0.007)">
                    <g transform="translate(0)">
                        <path className={classes.a} d="M15.043.543,14.5,0,.775,13.726V5.38H.007v9.656H9.663v-.768H1.318Z" transform="translate(-0.007)"/>
                    </g>
                </g>
            </g>
        </SvgIcon>
    )
}

export default LeftArrow;