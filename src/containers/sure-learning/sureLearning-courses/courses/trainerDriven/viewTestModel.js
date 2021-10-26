import React from 'react';
import {
  withStyles,
  Grid,
  Box,
  Typography,
  Divider,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import styles from './TrainingUnit.style';

const TextModel = ({
  classes, document, title,
}) => (
  <Grid container spacing={2} style={{ padding: '20px', paddingTop: '70px' }}>
    <Grid item md={12} xs={12}>
      <Box border={1} style={{ padding: '20px', borderColor: 'lightgray' }}>
        <Grid container spacing={2}>
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Typography variant="h5">{title}</Typography>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item md={1} />
          <Grid item md={1} />
          <Grid item md={10} xs={12}>
            <Grid item md={12} xs={12} style={{ margin: '12px 0px', textAlign: 'justify' }}>
              {ReactHtmlParser(document)}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  </Grid>
);

TextModel.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  document: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(TextModel);
