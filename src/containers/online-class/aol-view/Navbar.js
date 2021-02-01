import React from 'react';
import { makeStyles } from '@material-ui/core';
import Logo from '../assets/logo.png';

const useStyles = makeStyles({
    appBar: {
        width: '100%',
        height: '138px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 5px 20px #00000014',
        position: 'sticky',
    },
    logoStyles: {
        height: '60px',
        width: '199px',
        marginTop: '40px',
        marginLeft: '40px',
    }
})

const Navbar = () => {
    const classes = useStyles({});

    return (
        <div className={classes.appBar}>
            <img src={Logo} className={classes.logoStyles}/>
        </div>
    )
}

export default Navbar;