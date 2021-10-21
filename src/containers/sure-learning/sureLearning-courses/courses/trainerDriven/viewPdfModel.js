import React from 'react';
import {
  withStyles,
  Grid,
  Box,
  Typography,
  Divider,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import ViewPdf from './viewPdf';
import styles from './TrainingUnit.style';

const ViewPdfModel = ({
  classes, imageFile, title, pdfLinks, downloadabl, currentIndux,
}) => {
  const linksData = ((pdfLinks && JSON.parse(pdfLinks)) || []);
  function viewFileType(data, pdfLinkdInfo, download) {
    const res = data.substring(data.length - 3, data.length);
    if (res === 'zip' || download === true) {
      return (
        <Grid item md={4} xs={12} style={{ textAlign: 'center', paddingBottom: '20px' }}>
          <a href={data} target="_blank" rel="noopener noreferrer">Download File</a>
        </Grid>
      );
    } if (download === false) {
      return (
        <ViewPdf
          pdfFileLink={data}
          pdfLinks={pdfLinkdInfo || []}
          isDownloadaded={download || false}
          currentIndux={currentIndux}
        />
      );
    }
    return null;
  }
  return (
    <Grid container spacing={2} style={{ padding: '10px', paddingTop: '70px' }}>
      <Grid item md={12} xs={12}>
        <Box border={1} style={{ padding: '20px', borderColor: 'lightgray' }}>
          <Grid container spacing={2}>
            <Grid item md={1} />
            <Grid item md={10} xs={12}>
              <Typography variant="h5">{title}</Typography>
              <Divider className={classes.divider} />
            </Grid>
            <Grid item md={12} xs={12}>
              {viewFileType(imageFile, linksData, downloadabl)}
            </Grid>
            <Divider className={classes.divider} />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

ViewPdfModel.defaultProps = {
  pdfLinks: null,
  downloadabl: false,
};

ViewPdfModel.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  imageFile: PropTypes.string.isRequired,
  pdfLinks: PropTypes.string,
  downloadabl: PropTypes.bool,
  currentIndux: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(ViewPdfModel);
