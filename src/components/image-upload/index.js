import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import useStyles from './useStyles';

const ImageUpload = ({ id, value, onChange }) => {
  const [image, setImage] = useState(null);
  const classes = useStyles();
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  useEffect(() => {
    if (typeof value === 'object') {
      setImage(URL.createObjectURL(value));
    } else {
      setImage(value);
    }
  }, [value]);
  return (
    <Grid
      container
      item
      xs={12}
      alignItems='center'
      spacing={2}
      direction={isMobile ? 'column' : 'row'}
    >
      <Grid item>
        <img
          src={
            image ||
            value ||
            `https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png`
          }
          alt=''
          style={{ width: '100px', height: '100px', borderRadius: '50px' }}
        />
      </Grid>
      <Grid item>
        {image ? (
          <button
            type='button'
            onClick={() => {
              onChange('');
            }}
            className={classes.imageUploadBtn}
          >
            Delete Image
          </button>
        ) : (
          <label
            htmlFor={id ? `image=${id}` : 'image'}
            className={classes.imageUploadBtn}
          >
            Attach Image
            <input
              style={{ visibility: 'hidden', position: 'absolute' }}
              type='file'
              id={id ? `image=${id}` : 'image'}
              name={id ? `image=${id}` : 'image'}
              onChange={(e) => {
                e.persist();
                if (e.target.files && e.target.files[0]) {
                  onChange(e.target.files[0]);
                }
              }}
            />
          </label>
        )}
      </Grid>
    </Grid>
  );
};

export default ImageUpload;
