import React, { useState, useContext } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { IconButton, TextField, Typography } from '@material-ui/core';
import ChevronRightOutlinedIcon from '@material-ui/icons/ChevronRight';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';
import ChevronLeftOutlinedIcon from '@material-ui/icons/ChevronLeft';
import './pdf.scss';  
import endpoints from 'config/endpoints';


const DocumentViewer = (props) => {
  const { setAlert } = useContext(AlertNotificationContext);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState('');

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  const handleJumpToPage = (e) => {
    if (e.target.value > numPages) {
      setAlert('error', 'Page Not Available !!!');
    } else {
      setPageNumber(e.target.value);
    }
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };
console.log(props.pdfUrl,"pdfurl")

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
        className="pdfView"
      >
        hh22
        <Document file={`${endpoints.s3UDAAN_BUCKET}${props.pdfUrl.substring(31)}`} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <IconButton
          aria-label='delete'
          disabled
          color='primary'
          disabled={pageNumber <= 1}
          onClick={previousPage}
          className='Pre'
        >
         <ChevronLeftOutlinedIcon />
        </IconButton>

        <Typography>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </Typography>
        {/* <TextField
          type='number'
          label='Jump to'
          style={{ width: '10%' }}
          onChange={(e) => handleJumpToPage(e)}
        /> */}
        <IconButton
          aria-label='delete'
          disabled
          color='primary'
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          <ChevronRightOutlinedIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default DocumentViewer;
