import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import useStyles from './useStyles';

const ImageUpload = ({ value, onChange }) => {
  const [image, setImage] = useState(null);
  const classes = useStyles();
  useEffect(() => {
    if (typeof value === 'object') {
      setImage(URL.createObjectURL(value));
    } else {
      setImage(value);
    }
  }, [value]);
  return (
    <Grid container item xs={12}>
      <Grid container item md={4} alignItems='center' spacing={3}>
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
            <label htmlFor='image' className={classes.imageUploadBtn}>
              Attach Image
              <input
                style={{ visibility: 'hidden', position: 'absolute' }}
                type='file'
                id='image'
                name='image'
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
    </Grid>
  );
};

export default ImageUpload;
