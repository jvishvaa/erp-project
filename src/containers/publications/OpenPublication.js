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
  const [pdf, setPdf] = React.useState();

  useEffect(() => {
    axiosInstance.get(`${endpoints.publish.ebook}?publication_id=${ID}`).then((res) => {
      console.log('databooks', res.data.data[0].file);
      setData(res.data.data);
      setPdf(res.data.data[0].file);
    });
  }, []);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const handleChange = () => {
    console.log('single');
    return (
      <>
        {' '}
        <SinglePagePDFViewer pdf={pdf} />
      </>
    );
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
              <Button>
                <BorderColorIcon />
              </Button>
              <Button onClick={handleChange}>
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
                <center>
                  <SinglePagePDFViewer pdf={pdf} />
                </center>
              </Grid>
            );
          })}
        </MediaQuery>
        <MediaQuery maxWidth={599}>
          <div className={classes.root} >
            <div >
              <Button href={`/publications`}>Close</Button>
            </div>
          </div>
          {data.map((item, index) => {
            return (
              <div className={classes.root}>
          

                <SinglePagePDFViewer pdf={pdf} />
              </div>
            );
          })}
        </MediaQuery>
      </div>
    </>
  );
};

export default OpenPublication;
