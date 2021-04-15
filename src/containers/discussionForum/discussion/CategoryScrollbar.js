import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import axiosInstance from '../../../config/axios';
import endpoints from '../../../config/endpoints';

// import { Button } from '@material-ui/core';
// import categoryData from './categoryData';
/*
const StyledButton = withStyles({
    root: {
        height: '42px',
        padding: '0px 30px',
        backgroundColor: '#FE6B6B',
        color: '#FFFFFF',
        borderRadius: '10px',
        marginLeft: '40px',
    },
})(Button);
*/
const StyledTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#014B7E',
    height: '3px',
  },
})(Tabs);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 50,
    fontWeight: 300,
    marginBottom: '15px',
    padding: '0 25px',
    marginRight: '11px',
    backgroundColor: '#ff6a6a',
    borderRadius: '10px',
    color: '#014B7E',
    '&:hover': {
      color: '##ffffff',
      opacity: 1,
    },
    '&$selected': {
      color: '##ffffff',
      fontWeight: 600,
      border: '1px solid #014B7E',
    },
    '&:focus': {
      color: '##ffffff',
    },
  },
  selected: {
    backgroundColor: '#EFFFB2',
  },
}))((props) => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  categoryTab: {
    height: '30px',
  },
  tabsRoot: {
    height: '40px',
  },
  tabRoot: {
    height: '30px',
    backgroundColor: '',
  },
}));

export default function CategoryScrollbarComponent(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [categoryList, setCategoryList] = React.useState([]);

  const categoryData = props.categoryList ?? [];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // category list
  React.useEffect(() => {
    axiosInstance
      .get(endpoints.discussionForum.categoryList)
      .then((res) => {
        setCategoryList(res.data.result);
      })
      .catch((error) => console.log(error));
  }, []);
  const bgColor = [
    '#EFFFB2',
    '#D5FAFF',
    '#FFC4BB',
    '#E8CDFF',
    '#CCF0FF',
    '#FFCEF9',
    '#CCD9FF',
    '#CEFFCF',
  ];

  return (
    <div className={classes.root}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        indicatorColor='primary'
        textColor='secondary'
        variant='scrollable'
        scrollButtons='auto'
        aria-label='scrollable auto tabs example'
        // TabIndicatorProps={{color: '#D5FAFF'}}
      >
        {categoryList.map((tab, id) => (
          <StyledTab
            key={tab.id}
            label={tab.category_name}
            style={{ backgroundColor: bgColor[id % 8] }}
            {...a11yProps(0)}
            onClick={() => props.categoryId(tab.id)}
          />
        ))}
      </StyledTabs>
      <TabPanel value={value} index={0} />
    </div>
  );
}

export const CategoryScrollbar = React.memo(CategoryScrollbarComponent);
