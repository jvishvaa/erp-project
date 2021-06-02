import React, { useEffect, useRef } from 'react';
import { Button, Grid, Paper, Typography,withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import MenuBookIcon from '@material-ui/icons/MenuBook';
import BookIcon from '@material-ui/icons/Book';

import './Styles.css';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
// import { Document, Page } from 'react-pdf';
import ReactHtmlParser from 'react-html-parser';
import { Pagination } from '@material-ui/lab';

import MediaQuery from 'react-responsive';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import placeholder from '../../assets/images/placeholder_small.jpg';

const StyledFilterButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    padding: '12px 40px',
    marginLeft: '20px',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
  },
  startIcon: {
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
  },
})(Button);

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
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [pdf, setPdf] = React.useState([]);
  const [increment, setIncrement] = React.useState(0);
  const [incrementNext, setIncrementNext] = React.useState(1);
  const [single, setSingle] = React.useState(false);
  const [len, setLen] = React.useState();

  useEffect(() => {
    axiosInstance.get(`${endpoints.publish.ebook}?publication_id=${ID}`).then((res) => {
      if (res) {
        setData(res.data.data);
        const resp = res.data.data[0].file_list;

        setPdf(resp);
        setLen(resp.length);
      } else {
        setData('');

        setPdf('');
        setLen('');
      }
    });
  }, []);

  const [numPages, setNumPages] = React.useState(null);
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
                src={`${endpoints.publish.s3}/publication/${pdf[increment]}`}
                onError={(e) => {
                  e.target.src = placeholder;
                }}
                width='100%'
                height='100%'
                style={{
                  border: '1px solid darkgrey',
                  boxShadow: '5px 5px 5px 1px #ccc',
                  borderRadius: '5px',
                }}
              />
            </Grid>
          </Grid>
          <Grid container justify='center'>
            <Grid>
              <StyledFilterButton
                onClick={handleClickPrevious}
                disabled={increment == 0 ? true : false}
                style={{ margin: '20px' }}
              >
                <ArrowBackIosIcon />
              </StyledFilterButton>
            </Grid>
            <Grid>
              <StyledFilterButton
                onClick={handleClick}
                disabled={increment == len - 1 ? true : false}
                style={{ margin: '20px' }}
              >
                <ArrowForwardIosIcon />
              </StyledFilterButton>
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
              src={`${endpoints.publish.s3}/publication/${pdf[increment]}`}
              onError={(e) => {
                e.target.src = placeholder;
              }}
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
              src={`${endpoints.publish.s3}/publication/${pdf[incrementNext]}`}
              onError={(e) => {
                e.target.src = placeholder;
              }}
              width='100%'
              height='100%'
              style={{
                border: '1px solid darkgrey',
                boxShadow: '5px 5px 5px 1px #ccc',
                borderRadius: '5px',
              }}
            />
          </Grid>
          <Grid container direction='row' justify='center'>
            <Grid>
              {' '}
              <StyledFilterButton
                onClick={handleClickPrevious}
                disabled={increment == 0 ? true : false}
                style={{ margin: '20px' }}
              >
                <ArrowBackIosIcon />
              </StyledFilterButton>
            </Grid>
            <Grid>
              <StyledFilterButton
                onClick={handleClick}
                disabled={increment == len - 2 ? true : false}
                style={{ margin: '20px' }}
              >
                <ArrowForwardIosIcon />
              </StyledFilterButton>
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
            <Grid item md={6}>
              <StyledFilterButton href={`/publications`}>Close</StyledFilterButton>
            </Grid>

            <Grid className={classes.new} item>
              <StyledFilterButton onClick={() => SingleBook()}>
                SINGLE PAGE <BookIcon />
              </StyledFilterButton>
              <StyledFilterButton onClick={() => BookLet()}>
                DOUBLE PAGE
                <MenuBookIcon />
              </StyledFilterButton>
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
            <StyledFilterButton href={`/publications`}>
              <KeyboardBackspaceIcon />
            </StyledFilterButton>
          </Grid>

          <img
            src={`${endpoints.s3}/publication/${pdf[increment]}`}
            onError={(e) => {
              e.target.src = placeholder;
            }}
            width='90%'
            height='100%'
            style={{
              border: '1px solid darkgrey',
              boxShadow: '5px 5px 5px 1px #ccc',
              borderRadius: '5px',
              margin: '5%',
            }}
          />
          <Grid container direction='row' justify='center'>
            <Grid item xs={5}>
              <StyledFilterButton
                onClick={handleClickPrevious}
                disabled={increment == 0 ? true : false}
              >
                <ArrowBackIosIcon />
              </StyledFilterButton>
            </Grid>
            <Grid>
              <StyledFilterButton
                onClick={handleClick}
                disabled={increment == len - 1 ? true : false}
              >
                <ArrowForwardIosIcon />
              </StyledFilterButton>
            </Grid>
          </Grid>
        </MediaQuery>
      </div>
    </>
  );
};

export default OpenPublication;
