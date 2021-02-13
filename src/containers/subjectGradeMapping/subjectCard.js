import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Button, IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
// import { makeStyles } from '@material-ui/core/styles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Viewmore from './viewmore';
import useStyles from './useStyles'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { withRouter, Link } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import './subjectgrademapping.scss';



const Subjectcard = (props) => {
    const classes = useStyles();
    const [isSubjectOpen, setIsSubjectOpen] = React.useState(false);
    const [viewMoreList, setViewMoreList] = React.useState([]);
    const { setAlert } = useContext(AlertNotificationContext);

    const { schoolGsMapping, updateDeletData } = props;

    const handleViewMore = (view) => {
        setIsSubjectOpen(true);
        setViewMoreList(view)

    }


    const callDelete = (id, index) => {
        axiosInstance.delete(`${endpoints.mappingStudentGrade.delete}/${id}/delete-mapping-details/`).then(res => {
            updateDeletData(schoolGsMapping, index)
            setAlert('success', res.data.message);
        }).catch(err => {
            console.log(err)
        })

    }
    return (
        <>
            <Grid item xs={10} style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
                {
                    schoolGsMapping.map((list, index) => {
                        return (
                            <Paper className={classes.root}>
                                <Grid container spacing={2} style={{ width: 310 }}>
                                    <Grid item xs={8}>
                                        <Box>
                                            <Typography
                                                className={classes.title}
                                                variant='p'
                                                component='p'
                                                color='primary'
                                            >
                                                {list.branch.branch_name}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                className={classes.content}
                                                variant='p'
                                                component='p'
                                                color='secondary'
                                                noWrap
                                            >
                                                {list.erp_grade.grade_name}: {list.central_subject_name}
                                            </Typography>
                                        </Box>
                                    </Grid>


                                    <Grid item xs={4} className={classes.textRight}>
                                        <Box>
                                            <span
                                                className='period_card_menu'
                                            // onClick={() => handlePeriodMenuOpen(index)}
                                            // onMouseLeave={handlePeriodMenuClose}
                                            >
                                                <IconButton
                                                    className="moreHorizIcon"
                                                    disableRipple
                                                    color='primary'
                                                >
                                                    <MoreHorizIcon />
                                                </IconButton>
                                            </span>
                                        </Box>
                                    </Grid>
                                    {/* <Grid item xs={12} className={classes.textRight} >
                                        <div className="navigate-link" style={{ display: 'flex' }}>
                                            // <Link to={{ pathname: `/master-mgmt/subject/grade/mapping`, query: { list }, edit: true }} activeClassName="active" className="link-grade"><p> Edit <EditIcon style={{ fontSize: '16px' }} /></p></Link>
                                            <p onClick={() => callDelete(list.id, index)} style={{ marginLeft: 5, color: '#014B7E' }}> Delete <DeleteIcon style={{ fontSize: '16px', color: '#014B7E' }} /></p>
                                        </div>
                                    </Grid> */}
                                    <Grid item xs={12} sm={12} />
                                    <Grid item xs={6}>
                                        <Box style={{ display: 'flex' }}>
                                            <Link to={{ pathname: `/master-management/subject/grade/mapping`, query: { list }, edit: true }} activeClassName="active" className="link-grade"><p> Edit <EditIcon style={{ fontSize: '16px' }} /></p></Link>
                                            <p onClick={() => callDelete(list.id, index)} style={{ marginLeft: 5, color: '#014B7E' }}> Delete <DeleteIcon style={{ fontSize: '16px', color: '#014B7E' }} /></p>
                                            {/* <Typography
                                                className={classes.title}
                                                variant='p'
                                                component='p'
                                                color='secondary'
                                            >
                                                {list.central_grade_name}
                                            </Typography> */}
                                        </Box>
                                        {/* <Box>
                                            <Typography
                                                className={classes.content}
                                                variant='p'
                                                component='p'
                                                color='secondary'
                                            >
                                                {list.erp_grade.grade_name}: {list.central_subject_name}
                                            </Typography>
                                        </Box> */}
                                    </Grid>

                                    <Grid item xs={6} className={classes.textRight}>
                                        <Button
                                            variant='contained'
                                            style={{ color: 'white' }}
                                            color="primary"
                                            className="custom_button_master"
                                            size='small'
                                        // onClick={() => handleViewMore(list)}
                                        >
                                            VIEW MORE
                                     </Button>
                                    </Grid>
                                </Grid>
                            </Paper>


                        )
                    })
                }
            </Grid>

            {
                isSubjectOpen && <Viewmore viewMoreList={viewMoreList} />
            }

        </>




    )
}

export default withRouter(Subjectcard)