import React, { Fragment } from 'react';
import {
  Grid,
  Typography,
  Paper,
  makeStyles,
  Button,
  withStyles,
  Divider,
} from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CategoryScrollbar from './CategoryScrollbar';
import Discussion from './Discussion';
import FilterIcon from '../../../components/icon/FilterIcon';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';
import { useHistory } from 'react-router-dom';
import { discussionData } from './discussionData';

const useStyles = makeStyles({
  paperStyle: {
    padding: '20px 70px 10px 42px',
    '@media (max-width: 600px)': {
      padding: '20px 10px',
    },
  },
  hideFilterDiv: {
    width: '100%',
    marginBottom: '15px',
  },
  filterDivider: {
    width: '100%',
    //marginTop: '6px',
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
});

const StyledButton = withStyles({
  root: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    height: '42px',
    borderRadius: '10px',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: '#FF6B6B',
    },
  },
  startIcon: {
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
  },
})(Button);

const StyledOutlinedButton = withStyles({
  root: {
    height: '42px',
    color: '#FE6B6B',
    border: '1px solid #FF6B6B',
    borderRadius: '10px',
    backgroundColor: 'transparent',
  },
})(Button);

const StyledFilterButton = withStyles({
  root: {
    color: '#014B7E',
    marginLeft: '50px',
    marginBottom: '6px',
    fontSize: '16px',
    fontFamily: 'Raleway',
    float: 'right',
    textTransform: 'capitalize',
    backgroundColor: 'transparent',
  },
  iconSize: {},
})(Button);

const Category = (props) => {
  const classes = useStyles({});
  const [postList, setPostList] = React.useState([]);
  const [categoryId, setCategoryId] = React.useState(0);
  const [postURL, setPostURL] = React.useState(endpoints.discussionForum.postList);
  const history = useHistory();

  const hideFilter = () => {
    props.handleFilter();
  };

  const handleCategoryId = (id) => {
    setCategoryId(id);
  };

  const handleMYActivity = () => {
    axiosInstance
      .get(`${endpoints.discussionForum.postList}?page=1&my_activity=1`)
      .then((res) => {
        console.log(res.data.data.results);
        setPostList(res.data.data.results);
      })
      .catch((error) => console.log(error));
  };

  const handleAsk = () => {
    history.push('/discussion-forum/create');
  };

  // post list API
  React.useEffect(() => {
    //let postURL = endpoints.discussionForum.postList;
    const grades =
      props.filters.grade && props.filters.grade.id !== 0 ? props.filters.grade.id : '';
    const sections =
      props.filters.section && props.filters.section.id !== 0
        ? props.filters.section.id
        : '';
    if (categoryId !== 0 && grades === '') {
      //postURL = `${endpoints.discussionForum.postList}?category=${categoryId}`;
      setPostURL(`${endpoints.discussionForum.postList}?category=${categoryId}`);
      console.log(categoryId + ' === ' + postURL);
    }
    if (categoryId === 0 && grades !== '' && sections !== '') {
      //postURL = `${endpoints.discussionForum.postList}?grade=${grades}&section=${sections}`;
      setPostURL(
        `${endpoints.discussionForum.postList}?grade=${grades}&section=${sections}`
      );
    }
    if (categoryId !== 0 && grades !== '' && sections !== '') {
      //postURL = `${endpoints.discussionForum.postList}?category=${categoryId}&grade=${grades}&section=${sections}`;
      setPostURL(
        `${endpoints.discussionForum.postList}?category=${categoryId}&grade=${grades}&section=${sections}`
      );
    }
    axiosInstance
      .get(postURL)
      .then((res) => {
        console.log(res.data.data);
        setPostList(res.data.data.results);
      })
      .catch((error) => console.log(error));
  }, [props.url, props.filters, categoryId]);

  return (
      <Paper className={classes.paperStyle}>
          {props.showFilter && (
            <div>
                  <div>
                      <StyledFilterButton
                          variant="text"
                          size="small"
                          endIcon={<FilterIcon />}
                          onClick={props.handleFilter}
            >
              Hide filters
            </StyledFilterButton>
          </div>

                  <div className={classes.hideFilterDiv}>
                      <Divider className={classes.filterDivider} />
                      {props.filters && (
                        <div>
                {props.filters.year.year && (
                                <>
                                      <span className={classes.filterCategoryText}>{props.filters.year.year}</span>
                                      <FiberManualRecordIcon className={classes.dotSeparator} />
                  </>
                )}
                {props.filters.branch.branchs && (
                                <>
                                      <span className={classes.filterCategoryText}>{props.filters.branch.branchs}</span>
                                      <FiberManualRecordIcon className={classes.dotSeparator} />
                  </>
                )}
                {props.filters.grade.grades && (
                                <>
                                      <span className={classes.filterCategoryText}>{props.filters.grade.grades}</span>
                                      <FiberManualRecordIcon className={classes.dotSeparator} />
                  </>
                )}
                {props.filters.section.section && (
                                <span className={classes.filterCategoryText}>{props.filters.section.section}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
          <Typography className={classes.CategoriesTitleText}>Categories</Typography>
          <Grid container>
              <Grid item md={8} xs={12}>
                  <CategoryScrollbar categoryList={props.categoryList} categoryId={handleCategoryId} />
              </Grid>
              <Grid item md={4} xs={12}>
                  <Grid container spacing={2}>
                      <Grid item xs={6}>
                          <StyledOutlinedButton fullWidth onClick={handleAsk}>
                              Ask
                            </StyledOutlinedButton>
            </Grid>
                      <Grid item xs={6}>
                          <StyledButton
                              fullWidth
                              onClick={handleMYActivity}
                            >
                              MY Activity
                            </StyledButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
          <Grid container>
              <Grid item xs={12}>
                  {postList.map((data, id) => (
                      <Discussion rowData={data} key={id} />
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Category;
