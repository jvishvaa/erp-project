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
import { Document, Page, pdfjs } from 'react-pdf';
import './Styles.css';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
// import { Document, Page } from 'react-pdf';
import ReactHtmlParser from 'react-html-parser';

import SinglePagePDFViewer from './pdf/single-page';
import AllPagesPDFViewer from './pdf/all-pages';
import { sampleBase64pdf } from './sampleBase64pdf';
import MediaQuery from 'react-responsive';
// import './pdf/styles.css';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

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
    border: {
      height: '100%',
      maxHeight: '500px',
      overflow: 'auto',
      border: '1px solid darkgrey',
      boxShadow: '5px 5px 5px 1px #ccc',
      borderRadius: '5px',
    },
  },
}));

const OpenPublication = ({ ID }) => {
  console.log('bookid:', ID);
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [pdf, setPdf] = React.useState([]);
  const [increment, setIncrement] = React.useState(0);
  const [incrementNext, setIncrementNext] = React.useState(1);
  const [single, setSingle] = React.useState(false);
  const [len, setLen] = React.useState();

  useEffect(() => {
    axiosInstance.get(`${endpoints.publish.ebook}?publication_id=${ID}`).then((res) => {
      setData(res.data.data);
      const resp = res.data.data[0].file_list;
      console.log('images', res.data.data[0].file_list);
      setPdf(resp);
      setLen(resp.length);
      console.log('len', resp.length);
      console.log(`${endpoints.s3}/publication/${resp[0]}`);
    });
  }, []);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const SingleBook = () => {
    setSingle(true);
    return (
      <>
        <MediaQuery minWidth={600}>
          <Grid container justifty='center' className={classes.root}>
            <Grid>
              <img
                src={`${endpoints.s3}/publication/${pdf[increment]}`}
                width='100%'
                height='100%'
              />
            </Grid>
          </Grid>
          <Grid container justify='center'>
            <Grid>
              <Button
                onClick={handleClickPrevious}
                disabled={increment == 0 ? true : false}
              >
                Previous
              </Button>
            </Grid>
            <Grid>
              <Button
                onClick={handleClick}
                disabled={increment == len - 1 ? true : false}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </MediaQuery>
      </>
    );
  };

  const BookLet = () => {
    setSingle(false);

    return (
      <MediaQuery minWidth={600}>
        <Grid container direction='row' className={classes.root} justify='center'>
          <Grid item md={5}>
            <img
              src={`${endpoints.s3}/publication/${pdf[increment]}`}
              width='100%'
              height='100%'
              style={{
                border: '1px solid darkgrey',
                boxShadow: '5px 5px 5px 1px #ccc',
                borderRadius: '5px',
              }}
            />
          </Grid>
          <Grid item md={5}>
            <img
              src={`${endpoints.s3}/publication/${pdf[incrementNext]}`}
              width='100%'
              height='100%'
              style={{
                border: '1px solid darkgrey',
                boxShadow: '5px 5px 5px 1px #ccc',
                borderRadius: '5px',
              }}
            />
          </Grid>
          <Grid container justify='center' spacing={2}>
            <Grid>
              {' '}
              <Button
                onClick={handleClickPrevious}
                disabled={incrementNext == 1 ? true : false}
              >
                Previous
              </Button>
            </Grid>
            <Grid>
              <Button
                onClick={handleClick}
                disabled={incrementNext == Math.ceil(len / 2) ? true : false}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </MediaQuery>
    );
  };

  const handleClick = () => {
    setIncrement(increment + 1);
    setIncrementNext(incrementNext + 1);
  };

  const handleClickPrevious = () => {
    setIncrement(increment - 1);
    setIncrementNext(incrementNext - 1);
  };
  return (
    <>
      <div className='ran-style'>
        <MediaQuery minWidth={600}>
          <Grid className={classes.root} container direction='row'>
            <Grid item md={8}>
              <Button href={`/publications`}>Close</Button>
            </Grid>
            <Grid className={classes.new} item md={3}>
              <Button onClick={() => SingleBook()}>
                SINGLE PAGE <BookIcon />
              </Button>
              <Button onClick={() => BookLet()}>
                DOUBLE PAGE
                <MenuBookIcon />
              </Button>
            </Grid>
          </Grid>

          {data.map((item, index) => {
            return (
              <Grid className={classes.root}>
                <Typography>{ReactHtmlParser(item.description)}</Typography>
              </Grid>
            );
          })}
          {single ? <SingleBook /> : <BookLet />}
        </MediaQuery>
        <MediaQuery maxWidth={599}>
          <Grid className={classes.root}>
            <Button href={`/publications`}>
              <KeyboardBackspaceIcon />
            </Button>
          </Grid>
          {data.map((item, index) => {
            return (
              <Grid className={classes.root}>
                <Typography>{ReactHtmlParser(item.description)}</Typography>
              </Grid>
            );
          })}

          <img
            src={`${endpoints.s3}/publication/${pdf[increment]}`}
            width='100%'
            height='100%'
          />
          <Grid container direction='row'>
            <Grid item xs={5}>
              <Button
                onClick={handleClickPrevious}
                disabled={increment == 0 ? true : false}
                style={{ width: '100%', margin: '8%' }}
              >
                Previous
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                onClick={handleClick}
                disabled={increment == len - 1 ? true : false}
                style={{ width: '100%', margin: '8%' }}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </MediaQuery>
      </div>
    </>
  );
};

export default OpenPublication;
