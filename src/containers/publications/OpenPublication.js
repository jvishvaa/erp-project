import React, { useEffect, useRef } from 'react';
import Layout from '../Layout/index';
import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import BookIcon from '@material-ui/icons/Book';

import BorderColorIcon from '@material-ui/icons/BorderColor';
import bookimage from '../../assets/images/1.png';

import './Styles.css';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
// import { Document, Page } from 'react-pdf';
import ReactHtmlParser from 'react-html-parser';
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(4),
    },
  },
  new: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const OpenPublication = ({ ID }) => {
  console.log('bookid:', ID);
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [pdf, setPdf] = React.useState();

  useEffect(() => {
    axiosInstance.get(`${endpoints.publish.ebook}?publication_id=${ID}`).then((res) => {
      console.log(res.data.data);
      setData(res.data.data);
    });
  }, []);

  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <>
      <div className='ran-style'>
        <Grid className={classes.root} container direction='row'>
          <Grid item md={8}>
            <Button href={`/publications`}>Close</Button>
          </Grid>
          <Grid className={classes.new} item md={3}>
            <Button>
              <BorderColorIcon />
            </Button>
            <Button>
              SINGLE PAGE <BookIcon />
            </Button>
            <Button>
              DOUBLE PAGE
              <MenuBookIcon />
            </Button>
          </Grid>
        </Grid>
        {data.map((item, index) => {
          return (
            <Grid className={classes.root}>
              <Typography>{ReactHtmlParser(item.description)}</Typography>
              <img src={item.file} />
            </Grid>
          );
        })}

        <Grid container direction='row'>
          <Grid item md={6}>
            <Paper className={classes.root}>
              <img src={bookimage} />
            </Paper>
          </Grid>

          <Grid item md={6}>
            <Paper className={classes.root}>
              <img src={bookimage} />
            </Paper>
          </Grid>
        </Grid>

        <Grid container direction='row' justify='center' alignItems='center'>
          <Pagination count={3} color='primary' onChangePage={() => {}} />
        </Grid>
      </div>
    </>
  );
};

export default OpenPublication;
