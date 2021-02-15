import React, { Fragment } from 'react';
import { Grid, Typography, Paper, makeStyles, Button, withStyles, Divider } from '@material-ui/core';
import CategoryScrollbar from './CategoryScrollbar';
import Discussion from './Discussion';
import FilterIcon from '../../../components/icon/FilterIcon';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
//import { MyButton } from './StyledButton';
import { discussionData } from './discussionData';

const useStyles = makeStyles({
    paperStyle: {
        padding: '15px 70px 0 42px',
    },
    hideFilterDiv: {
        width: '100%',
        marginBottom: '15px',
    },
    filterDivider: {
        width: '100%',
        marginTop: '6px',
        marginBottom: '15px',
    },
    filterCategoryText: {
        color: '#014B7E',
        fontSize: '18px',
        fontFamily: 'Raleway',
        lineHeight: '21px',
        marginLeft: '5px',
    },
    dotSeparator: {
        color: '#014B7E',
        fontSize: '6px',
        verticalAlign: 'middle',
        marginLeft: '5px',
    },
    CategoriesTitleText: {
        color: '#014B7E',
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Raleway',
        marginBottom: '15px',
    },
    root: {
        height: '42px',
        width: '166px',
        backgroundColor: '#FE6B6B',
        color: '#FFFFFF',
        borderRadius: '10px',
        marginLeft: '40px',
    },
    label: {
        textTransform: 'capitalize',
    },
})

const StyledButton = withStyles({
    root: {
        height: '42px',
        width: '166px',
        backgroundColor: '#FE6B6B',
        color: '#FFFFFF',
        borderRadius: '10px',
        marginLeft: '40px',
    },
})(Button);

const StyledOutlinedButton = withStyles({
    root: {
        height: '42px',
        width: '166px',
        color: '#FE6B6B',
        border: '1px solid #FF6B6B',
        borderRadius: '10px',
    },
})(Button);
const StyledFilterButton = withStyles({
    root: {
        color: '#014B7E',
        marginLeft: '50px',
        fontSize: '16px',
        fontFamily: 'Raleway',
        textTransform: 'capitalize',
        float: 'right',
    },
    iconSize: {

    }
})(Button);

const Category = () => {
    const classes = useStyles({});
    return (
        <Paper className={classes.paperStyle}>
            <div>
                <div>
                    <StyledFilterButton
                        variant="text"
                        size="small"
                        endIcon={<FilterIcon/>}
                    >
                        Hide filters
                    </StyledFilterButton>
                </div>
                <div className={classes.hideFilterDiv}>
                    <Divider className={classes.filterDivider}/>
                    <div>
                        <span className={classes.filterCategoryText}>2021</span>
                        <FiberManualRecordIcon className={classes.dotSeparator}/>
                        <span className={classes.filterCategoryText}>Subject</span>
                        <FiberManualRecordIcon className={classes.dotSeparator}/>
                        <span className={classes.filterCategoryText}>Grade</span>
                        <FiberManualRecordIcon className={classes.dotSeparator}/>
                        <span className={classes.filterCategoryText}>Section</span>
                    </div>
                </div>
            </div>
            <Typography className={classes.CategoriesTitleText}>Categories</Typography>
            <Grid container>
                <Grid item xs={8}>
                    <CategoryScrollbar/>
                </Grid>
                <Grid item xs={4}>
                    <StyledOutlinedButton>
                        Ask
                    </StyledOutlinedButton>
                    <StyledButton >
                        MY Activity
                    </StyledButton>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item>
                    {discussionData.map((data, id) => (
                        <Discussion rowData={data} key={id}/>
                    ))}
                </Grid>
            </Grid>
        </Paper>
    )
}

export default Category;