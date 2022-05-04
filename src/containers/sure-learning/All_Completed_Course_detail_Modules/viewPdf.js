import React, { useState, useRef, useEffect } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import {
  Grid, makeStyles, Box, TextField, Button, Divider, IconButton, Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import ChildPdfView from './childPdfView';
// import './viewpdf.css';

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
  box: {
    padding: theme.spacing(1, 2, 1),
    marginTop: '10px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const ViewPdf = ({
  pdfFileLink, pdfLinks, isDownloadaded, currentIndux,
}) => {
  const [page, setPage] = useState(1);
  const [isZoomed, setZoomStatus] = useState(false);
  const [pageNumber, setPageNumber] = useState('');

  const [open, setOpen] = useState(false);
  const [linkType, setlinkTypeof] = useState('');
  const [link, setLink] = useState('');
  const [linkName, setLinkName] = useState('');

  const classes = useStyles();
  const canvasRef = useRef(null);
  const { pdfDocument } = usePdf({
    file: pdfFileLink,
    page,
    canvasRef,
  });

  // document.addEventListener('contextmenu', (event) => event.preventDefault());

  useEffect(() => {
    if (currentIndux) {
      setPage(1);
      setPageNumber('');
    }
  }, [currentIndux]);

  const onZoomHandler = () => {
    setZoomStatus(!isZoomed);
  };

  function jumpFunction() {
    if (pageNumber) {
      setPage(parseInt(pageNumber, 10));
    }
  }

  const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  };
  DialogTitle.propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  const handleCloseFullView = () => {
    setOpen(false);
    setLink('');
    setlinkTypeof('');
    setLinkName('');
  };

  function functionForFullViewVodeoModule() {
    let FullView = null;
    FullView = (
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          <Dialog
            maxWidth="xl"
            fullWidth
            className={classes.dialog}
            style={{ marginTop: '50px' }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            open={open}
          >
            <DialogTitle id="alert-dialog-title" onClose={handleCloseFullView}>
              View
              <b style={{ color: 'blue' }}>{` ${linkName} `}</b>
            </DialogTitle>
            <Divider className={classes.divider} />
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item md={1} />
                <Grid item md={10} xs={12}>
                  <Box border={2} className={classes.contentBox}>
                    {linkType === 'Video'
                        && (
                        <video controlsList="nodownload" controls src={link} height="450" width="100%">
                          <track src={link} kind="captions" srcLang="en" label="english_captions" />
                        </video>
                        )}
                    {linkType === 'PDF' && (<ChildPdfView pdflink={link} />)}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    );
    return FullView;
  }

  function functionOpenModel(informatin) {
    setOpen(true);
    setLink(informatin.linkInfo);
    setlinkTypeof(informatin.linkType);
    setLinkName(informatin.name);
  }

  return (
    <>
      <Grid container spacing={2} direction="row" justify="center" alignItems="center">
        <Grid item md={12} xs={12} sm={12} style={{ overflow: 'auto' }}>
          <canvas
            className="responsive"
            onClick={onZoomHandler}
            ref={canvasRef}
            style={{
              marginTop: '10% !important',
              display: 'block',
              margin: 'auto',
              width: '100%',
              height: '100%',
              cursor: 'zoom-in',
              overflow: 'scroll',
              transition: 'all 0.3s ease 0s',
              transform: isZoomed ? 'scale(1.1,1.1)' : 'scale(1,1)',
            }}
          />
        </Grid>
        <Grid item md={12} xs={12} style={{ textAlign: 'center' }}>
          {pdfDocument === undefined ? <span style={{ top: '50%', left: '50%' }}><CircularProgress /></span> : ''}

          {Boolean(pdfDocument && pdfDocument.numPages) && (
            <>
              <Grid container spacing={2}>
                {isDownloadaded
              && (
              <Grid item md={12} xs={12} style={{ textAlign: 'right', marginTop: '50px' }}>
                {isDownloadaded && <a rel="noopener noreferrer" style={{ marginTop: '2%' }} target="_blank" href={pdfFileLink}>Download This PDF</a>}
              </Grid>
              )}
                {pdfLinks && pdfLinks.length !== 0
                && (
                <Grid item md={12} xs={12} style={{ textAlign: 'center', marginTop: '5px', overflow: 'auto' }}>
                  {pdfLinks && pdfLinks.map((data) => {
                    const informatin = data;
                    if (parseInt(data.page_no, 10) === page) {
                      return (
                        informatin.link && informatin.link.map((inforda, index) => (
                          <Box border={1} className={classes.box} style={{ overflow: 'auto' }}>
                            link
                            {' '}
                            {index + 1}
                            {' '}
                            :
                            {' '}
                            {inforda.linkType === 'WebSite'
                          && (
                          <a rel="noopener noreferrer" style={{ marginTop: '5%' }} target="_blank" href={inforda.linkInfo}>
                            {inforda.linkInfo}
                          </a>
                          )}
                            {inforda.linkType !== 'WebSite'
                            && (
                            <Button color="primary" onClick={() => functionOpenModel(inforda)}>
                              click Here To view
                              {' '}
                              {inforda.name || ''}
                            </Button>
                            )}
                          </Box>
                        )));
                    }
                    return null;
                  })}
                </Grid>
                )}
              </Grid>
              <Grid container justify="center" alignItems="center" spacing={2} style={{ marginTop: '2%' }}>
                <Grid
                  item
                  md={6}
                  xs={6}
                  style={{
                    color: 'blue', fontFamily: 'time', fontSize: '20px', padding: '20px',
                  }}
                >
                  <b>
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
            </>
          )}
        </Grid>
        {functionForFullViewVodeoModule()}
      </Grid>
    </>
  );
};

ViewPdf.propTypes = {
  pdfFileLink: PropTypes.string.isRequired,
  pdfLinks: PropTypes.instanceOf(Array).isRequired,
  isDownloadaded: PropTypes.bool.isRequired,
  currentIndux: PropTypes.number.isRequired,
};

export default ViewPdf;
