import React, { useState, useRef, useEffect } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import {
  Grid, makeStyles, Button, TextField,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  pager: {
    listStyleType: 'none',
    display: 'flex',
    margin: '0 auto',
    padding: '10px',
  },
  Button: {
    color: '#fff',
  },
}));
const ChildPdfView = ({ pdflink }) => {
  const [page, setPage] = useState(1);
  const [isZoomed, setZoomStatus] = useState(false);
  const [pageNumber, setPageNumber] = useState('');

  const classes = useStyles();
  const canvasRef = useRef(null);
  const { pdfDocument } = usePdf({
    file: pdflink,
    page,
    canvasRef,
  });

  document.addEventListener('contextmenu', (event) => event.preventDefault());

  function jumpFunction() {
    if (pageNumber) {
      window.scrollTo(0, 0);
      setPage(parseInt(pageNumber, 10));
    }
  }

  useEffect(() => {
    if (page) {
      window.scrollTo(0, 0);
    }
  }, [page]);

  const onZoomHandler = () => {
    setZoomStatus(!isZoomed);
  };

  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Grid item md={12} xs={12} style={{ overflow: 'auto' }}>
        <canvas
          className="canvasstyle"
          onClick={onZoomHandler}
          ref={canvasRef}
          style={{
            marginTop: '10%!important',
            display: 'block',
            maxWidth: '800px',
            maxHeight: '600px',
            // width: '100vw!important',
            // height: '80vh!important',
            width: '100%',
            height: '100%',
            margin: 'auto',
            cursor: 'zoom-in',
            transition: 'all 0.3s ease 0s',
            transform: isZoomed ? 'scale(1.1,1.1)' : 'scale(1,1)',
          }}
        />
      </Grid>
      <Grid item md={12} xs={12}>
        {pdfDocument === undefined ? (
          <span style={{ textAlign: 'center', justifyItems: 'center' }}>
            <CircularProgress />
            {' '}
            Loading...
          </span>
        ) : ''}
      </Grid>
      <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
        {Boolean(pdfDocument && pdfDocument.numPages) && (
        <Grid container justify="center" alignItems="center" spacing={2} style={{ marginTop: '2%', textAlign: 'center' }}>
          <Grid
            item
            md={6}
            xs={6}
            style={{
              color: 'blue', fontFamily: 'time', fontSize: '20px', padding: '20px',
            }}
          >
            <b className={classes.Dummy}>
              Total Pages :
              {pdfDocument.numPages}
            </b>
          </Grid>
          <Grid
            item
            md={6}
            xs={6}
            style={{
              color: 'blue', fontFamily: 'time', fontSize: '20px', padding: '20px',
            }}
          >
            <b>
              Current Page :
              {page}
            </b>
          </Grid>
          <Grid item md={6} xs={6} className="previous">
            <Button
              variant="contained"
              color="primary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              PREVIOUS SLIDE
            </Button>
          </Grid>
          <Grid item md={6} xs={6} className="next">
            <Button
              variant="contained"
              color="primary"
              disabled={page === pdfDocument.numPages}
              onClick={() => setPage(page + 1)}
            >
              Next SLIDE
            </Button>
          </Grid>
          <Grid item md={2} xs={5}>
            <TextField
              value={pageNumber}
              type="number"
              label="Jump to"
              variant="outlined"
              margin="dense"
              onChange={(e) => (e.target.value < pdfDocument.numPages)
              && setPageNumber(e.target.value)}
            />
          </Grid>
          <Grid item md={1} xs={6}>
            <Button
              style={{ marginTop: '10px' }}
              color="primary"
              variant="contained"
              disabled={page === pdfDocument.numPages}
              onClick={() => jumpFunction()}
            >
              Go
            </Button>
          </Grid>
        </Grid>
        )}
      </Grid>
    </Grid>
  );
};

ChildPdfView.propTypes = {
  pdflink: PropTypes.string.isRequired,
};

export default ChildPdfView;
