import React from 'react';
import {
  SvgIcon,
  IconButton,
  useMediaQuery,
  useTheme,
  makeStyles,
} from '@material-ui/core';
import hidefilter from '../../assets/images/hidefilter.svg';
import showfilter from '../../assets/images/showfilter.svg';

const useStyles = makeStyles((theme) => ({
  breadCrumbFilterRow: {
    width: '96%',
    margin: '10px auto',
    display: 'flex',
    justifyContent: 'space-between',
    '& .hideShowFilterIcon': {
      display: 'flex',
      justifyContent: 'space-between',
      alignSelf: 'center',
      '& .togglerTag': {
        color: theme.palette.secondary.main,
        fontSize: '16px',
        marginRight: '10px',
        fontWeight: '600',
        alignSelf: 'center',
      },
    },
  },
}));

const BreadcrumbToggler = ({ isFilter, setIsFilter, children }) => {
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const classes = useStyles();
  return (
    <div className={classes.breadCrumbFilterRow}>
      {children}
      <div className='hideShowFilterIcon'>
        <IconButton onClick={() => setIsFilter(!isFilter)}>
          {!isMobile && (
            <div className='togglerTag'>
              {isFilter ? 'Close Filter' : 'Expand Filter'}
            </div>
          )}
          <SvgIcon
            component={() => (
              <img
                style={{ height: '20px', width: '25px' }}
                src={isFilter ? hidefilter : showfilter}
              />
            )}
          />
        </IconButton>
      </div>
    </div>
  );
};

export default BreadcrumbToggler;
