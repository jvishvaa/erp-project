import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


const useStyles = makeStyles({
    root: {
        // border: '1px solid',
        padding: '0.9rem',
        borderRadius: '10px',
        // width: '105%',
        boxShadow: 'none',
        color:'#014e7b'
      },
    //   indicatorColor:{
    //     color:'#014e7b'
    //   }
});

export default function CenteredTabs({setSelectedIndex, period,handlePeriodList,tabQueTypeId,tabQueCatId,tabMapId,tabQueLevel,setTabValue,tabValue,setPage}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange =  (event, newValue) => {
    setSelectedIndex(-1);
    setTabValue(newValue)
    handlePeriodList(tabQueTypeId,tabQueCatId,tabMapId,tabQueLevel,newValue)
    setValue(newValue);
    setPage(1)
  };
  return (
    <Paper className={classes.root}>
      <Tabs value={tabValue} onChange={handleChange} indicatorColor={classes.indicatorColor} textColor={classes.indicatorColor} >
        <Tab  label="ALL" />
        <Tab  label="Draft" />
        <Tab  label="For Review" />
        <Tab  label="Published" />
      </Tabs>
    </Paper>
  );
}