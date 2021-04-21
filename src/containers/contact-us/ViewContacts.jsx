// import React, { useState, useEffect, useContext } from 'react';
// import Layout from '../Layout/index';
// import CommonBreadcrumbs from '../../components/common-breadcrumbs/breadcrumbs';
// import {
//   Grid,
//   makeStyles,
//   AppBar,
//   Box,
//   Paper,
//   Typography,
//   Tabs,
//   Tab,
// } from '@material-ui/core';
// import { Link, useHistory } from 'react-router-dom';
// import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
// import Loader from '../../components/loader/loader';
// import axiosInstance from '../../config/axios';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     padding: '1rem',
//     borderRadius: '10px',
//     width: '100%',
//     margin: '1.5rem -0.1rem',
//     // marginLeft:'10px',
//     // border:'1px solid black'
//   },
//   bord: {
//     margin: theme.spacing(1),
//     border: 'solid lightgrey',
//     borderRadius: 10,
//   },
//   title: {
//     fontSize: '1.1rem',
//   },

//   content: {
//     fontSize: '20px',
//     marginTop: '2px',
//   },
//   contentData: {
//     fontSize: '12px',
//   },
//   contentsmall: {
//     fontSize: '15px',
//   },
//   textRight: {
//     textAlign: 'right',
//   },
//   paperSize: {
//     width: '300px',
//     height: '670px',
//     borderRadius: '10px',
//   },
//   small: {
//     width: theme.spacing(3),
//     height: theme.spacing(3),
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//     lineHeight: '2',
//     height: '250px',
//   },
//   heading: {
//     padding: '10px',
//   },
//   contact: {
//     display: 'flex',
//     justifyContent: 'center',
//     paddingTop: '10px',
//   },
// }));

// const ViewContacts = () => {
//   const history = useHistory();

//   const classes = useStyles();
//   const { setAlert } = useContext(AlertNotificationContext);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   useEffect(() => {
//     get(
//       `${endpoints.contactUs.filterContact}?academic_year=${selectedAcademicYear.id}&branch=${selectedBranch.branch.id}`
//     )
//       .then((res) => {
//         console.log(res, 'getting the contact details');
//         setData(res.data);
//       })
//       .catch((err) => console.log(err));
//   }, []);
//   return (
//     <Layout>
//       <div style={{ marginTop: '20px', marginLeft: '-10px' }}>
//         <CommonBreadcrumbs componentName='Contact Us' />
//       </div>
//       <Grid container direction='row' className={classes.root} spacing={3}>
//         <Grid item xs={12} md={3}>
//           <Paper className={classes.paper}>
//             <div>icon</div>
//             <button>book appoinment</button>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={3} className={classes.hover}>
//           <Paper className={classes.paper}>
//             <Typography className={classes.heading}> FRONT OFFICE EXECUTIVE </Typography>
//             <Typography>Available at these timings</Typography>
//             <Typography>
//               <strong>9:00am to 8:00pm</strong>
//             </Typography>
//             <Typography>EST Monday - Friday</Typography>
//             <div className={classes.contact}>
//               <Typography>icon</Typography>
//               <Typography>+91-1234567890</Typography>
//             </div>
//             <div className={classes.contact}>
//               <Typography>icon</Typography>
//               <Typography>+91-1234567890</Typography>
//             </div>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <Paper className={classes.paper}>
//             <Typography className={classes.heading}> FRONT OFFICE EXECUTIVE </Typography>
//             <Typography>Available at these timings</Typography>
//             <Typography>
//               <strong>9:00am to 8:00pm</strong>
//             </Typography>
//             <Typography>EST Monday - Friday</Typography>
//             <div className={classes.contact}>
//               <Typography>icon</Typography>
//               <Typography>+91-1234567890</Typography>
//             </div>
//             <div className={classes.contact}>
//               <Typography>icon</Typography>
//               <Typography>+91-1234567890</Typography>
//             </div>
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={3}>
//           <Paper className={classes.paper}>
//             <Typography className={classes.heading}> FRONT OFFICE EXECUTIVE </Typography>
//             <Typography>Available at these timings</Typography>
//             <Typography>
//               <strong>9:00am to 8:00pm</strong>
//             </Typography>
//             <Typography>EST Monday - Friday</Typography>
//             <div className={classes.contact}>
//               <Typography>icon</Typography>
//               <Typography>+91-1234567890</Typography>
//             </div>
//             <div className={classes.contact}>
//               <Typography>icon</Typography>
//               <Typography>+91-1234567890</Typography>
//             </div>
//           </Paper>
//         </Grid>
//       </Grid>
//       {/* {loading && <Loader />} */}
//     </Layout>
//   );
// };

// export default ViewContacts;
