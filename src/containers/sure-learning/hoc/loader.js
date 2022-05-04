// import React from 'react';
// import PropTypes from 'prop-types';
// // import CircularProgress from '@material-ui/core/CircularProgress';
// import { withStyles } from '@material-ui/core/styles';
// // import Backdrop from './backdrop/backdrop';

// const styles = () => ({
//   progress: {
//     // margin: theme.spacing(2),
//     position: 'fixed',
//     top: '1%',
//     left: '1%',
//     width: '99%',
//     height: '99%',
//     zIndex: '1001',
//     // color: theme.palette.primary.dark,
//   },
// });

// const Loader = ({ open, classes }) => (
//   <>
//     {/* <Backdrop open={open} onClick={() => {}} zIndex={zIndex} /> */}
//     <img open={open} className={classes.progress} alt="crash" src={require('./loder.gif')} />
//   </>
// );

// Loader.propTypes = {
//   open: PropTypes.bool.isRequired,
//   classes: PropTypes.objectOf(PropTypes.string).isRequired,
//   // zIndex: PropTypes.number,
// };

// // Loader.defaultProps = {
// //   zIndex: 1000,
// // };

// export default withStyles(styles)(Loader);
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Backdrop from './backdrop/backdrop';

const styles = (theme) => ({
  progress: {
    margin: theme.spacing(2),
    position: 'fixed',
    top: '46%',
    left: '46%',
    width: '60px !important',
    height: '60px !important',
    'z-index': '1550',
    color: theme.palette.primary.dark,
  },
});

const Loader = ({ open, classes, zIndex }) => (
  <>
    <Backdrop open={open} onClick={() => {}} zIndex={zIndex} />
    <CircularProgress className={classes.progress} />
  </>
);

Loader.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  zIndex: PropTypes.number,
};

Loader.defaultProps = {
  zIndex: 1550,
};

export default withStyles(styles)(Loader);
