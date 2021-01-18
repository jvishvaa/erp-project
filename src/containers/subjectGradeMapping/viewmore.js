import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Cancelicon from "../../assets/images/Cancel-icon.svg";
import { SvgIcon, } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import './subjectgrademapping.scss';

export default function Viewmore(props) {
    // const classes = useStyles();
    // const bull = <span className={classes.bullet}>•</span>;
    // const { viewMoreList, cancelCard } = props;
    // // console.log(viewMoreList, "pop")

    return (
      
        <div className="card">
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Aerial_view_downtown_Nice.jpg" alt="Avatar" style={{width: '100%'}} />
        <div className="container">
          <h4><b>John Doe</b></h4> 
          <p>Architect & Engineer</p> 
        </div>
      </div>
      
    );
}
