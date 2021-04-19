import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import QuestionCard from './quesstionCard/questionCard';
import { Grid, Divider} from '@material-ui/core';
import Search from './searchbar';
import './assesment.scss';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: 'white',
        boxShadow: 'none',
       
    },
}));

export default function FilterTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [values, setValues] =  React.useState("");

    const { filterResult, handleTabs, draftResult, verifiedValue , publishedValue} = props;

    const handleChange = (event, newValue) => {
        setValue(newValue);
        handleTabs(newValue)
    };


  const handleSearch = (value) => {
    setValues(value);
  };

  let searchResult = filterResult.filter((names) => {
    return names.paper_name.toLowerCase().indexOf(values.toLowerCase()) !== -1;
  });
    return (
        <div className={classes.root}>
            <AppBar position="static"className="assements-tabs-app" style={{ background: 'white', width: '80%',  boxShadow: 'none', marginLeft: 30,
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none' }}>
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="All" {...a11yProps(0)}  style={{color:'#014B7E'}} className="all-tab" />
                    <Tab label="Draft" {...a11yProps(1)} style={{color:'#014B7E'}} className="draft-tab" />
                    <Tab label="For Review" {...a11yProps(2)}  style={{color:'#014B7E'}}  className="review-tab" />
                    <Tab label="Published" {...a11yProps(3)}  style={{color:'#014B7E'}}  className="published-tab" />
                    <Search handleSearch={handleSearch} />
                </Tabs>
            </AppBar>
            <Grid item xs={10} sm={12} style={{ width: '80%', marginLeft: 30, }}>
              <Divider />
            </Grid>
            <Grid container style={{ width: '100%', margin: '20px auto' }} spacing={5}>
                <Grid item xs={12} sm={12}>
                    <TabPanel value={value} index={0} className="all-tab">
                        <Grid container spacing={5}>
                            {
                                searchResult && searchResult.map((qName, index) => (
                                    <Grid item xs={12} style={{ marginLeft: '-8px' }} sm={4}>
                                        <QuestionCard result={qName} />
                                    </Grid>
                                ))
                            }

                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1} className="draft-tab">
                        <Grid container spacing={5}>
                            {
                                draftResult && draftResult.map((qName, index) => (
                                    <Grid item xs={12} style={{ marginLeft: '-8px' }} sm={4}>
                                        <QuestionCard result={qName}  />
                                    </Grid>
                                ))
                            }

                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={2} className="review-tab">
                        <Grid container spacing={5}>
                            {
                                verifiedValue && verifiedValue.map((qName, index) => (
                                    <Grid item xs={12} style={{ marginLeft: '-8px' }} sm={4}>
                                        <QuestionCard result={qName}  />
                                    </Grid>
                                ))
                            }

                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={2} className="published-tab">
                        <Grid container spacing={5}>
                            {
                                publishedValue && publishedValue.map((qName, index) => (
                                    <Grid item xs={12} style={{ marginLeft: '-8px' }} sm={4}>
                                        <QuestionCard result={qName} />
                                    </Grid>
                                ))
                            }

                        </Grid>
                    </TabPanel>
                </Grid>
               
            </Grid>
        </div>
    );
}
