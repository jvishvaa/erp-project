import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import endpoints from 'config/endpoints';
import TextField from '@material-ui/core/TextField';
import axiosInstance from 'config/axios';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Layout from 'containers/Layout';
import { Typography } from '@material-ui/core';
import { AlertNotificationContext } from 'context-api/alert-context/alert-state';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => 

createStyles({
  root: {
    // width: '80%',
    marginLeft: '20px',
    marginTop: '20px',
  },
  textfieldlayout:{
    width:"180px", 
    marginTop:"10px", 
    marginLeft: "10px", 
    display:"inline-block"
  },
  buttonlayoutone: {
    width:"180px", 
    // marginTop:"30px", 
    // marginLeft: "10px"
  },
  buttonlayouttwo: {
    width:"180px", 
    // marginTop:"10px", 
    // marginLeft: "10px"
  },
  container: {
    maxHeight: 440,
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  datestyle: {
    marginLeft: "20px"
  },
  sumitbutton: {
    marginLeft: "30px",
    display: "inline-block",
    marginTop: "13px"
  },
  bottommargin:{
    margin: "30px"
  },
  tableheading:{
    fontWeight: 'bold', 
    fontSize: '20px', 
    marginLeft: '20px', 
    marginTop: '10px'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
  })
);



function Observationreport() {
  let observationIndexNumber = 0
  const classes = useStyles();
  const [finaleDate, setFinaledata] = useState();
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const [observationValue , setObservationValue] = useState([]);
  const [dateUpdate, setDateUpdate] = useState();
  const { setAlert } = useContext(AlertNotificationContext);
  const [overallRemark, setOverallRemark] = useState('');
  const [rightScoreValue, setRightScoreValue] = useState(true);


  const postString = () => {
    var nick = [];
    var num = 0;
    finaleDate.map((imp) => {
      var value= parseInt(imp.score);
      if (typeof imp.score !== 'undefined')
        if( value < 1 || value >45 ){
          setAlert('error','Wrong Score Value')
          setRightScoreValue(false)
        }
        num= num + value;
    })

    nick.push({
      erp_user : status,
      report : JSON.stringify(finaleDate,["report","score","remark","observation"]),
      remark : overallRemark,
      score: num,
      date: dateUpdate,
    })
    var num = JSON.stringify( nick[0],["erp_user", "report"])
    if( rightScoreValue === true ){
      axiosInstance.post(`${endpoints.observationName.observationReport}`,nick[0]).then((res)=>{
        if (res.status === 201) {
           setAlert('success', 'Successfully Submitted');
           }})
           .catch((error)=>{
             console.log('error');
           })
    }
  }

  const submitButton = () => {
    var sortdata = [];
    observationValue.map((row) => {
      row.observation.map((ten) =>
      sortdata.push ({
          observation : row.observation_area_name,
          remark : ten.remark,
          score: ten.number,
          report : ten.report,
          erp_user : status,
          date : dateUpdate,
        }),
        setFinaledata(sortdata),
      ) 
    })
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
    submitButton();
  };

  const dateUpdatefun = (event) => {
    setDateUpdate(event.target.value);
    submitButton();
  };
  

  const handleRatingData = (event, firstindex, secondindex) => {
    const list = observationValue;

    let name = event.target.name;
    let value = event.target.value;

    setRightScoreValue(true)
    let newlist = [observationValue[firstindex].observation[secondindex]];

    newlist=newlist[0];
    newlist[name]=value;

    list[firstindex].observation[secondindex] = newlist;
    setObservationValue(list);
    if( value < 1 || value >45 ){
      setAlert('error','Score should be less than 45 and greater than 0')
      return
    }

    submitButton();
  };

const getupdateData = () => {
    const result = axiosInstance
        .get(`${endpoints.observationName.observationData}`)
        .then((result) => {
        if (result.status === 200) {
            setObservationValue(result?.data);
        }
        })
        .catch((error) => {
        });
    };

  useEffect(() => {
    getupdateData();
  }, []);

  return (
    <div>
    <Layout>
    <Typography className={classes.tableheading}>Observation Report</Typography>
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow >
              <TableCell>Index</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>S. No.</TableCell>
              <TableCell>Observation</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Score(45)</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {observationValue.map((row, firstindex) => {
             
              return (
                <>
                  {row.observation.map((rowt, secondindex, thirdvalue) => {
                    let x = secondindex;
                    if (secondindex=== 0){
                      observationIndexNumber = observationIndexNumber + 1;
                    }
                    return ( 
                  
                    <TableRow >
                    { secondindex === 0 ? (<>
                        <TableCell rowSpan={row.observation.length}>{observationIndexNumber}</TableCell>
                        <TableCell rowSpan={row.observation.length}>{row.observation_area_name}</TableCell>
                      </>) : ( <>
                        </>
                      )} 
                      <TableCell >{x+1} </TableCell>                      
                      <TableCell>{rowt.observation}</TableCell>
                      <TableCell><TextField id="id" name="remark" className={classes.buttonlayoutone} size="small" label="Remark" value={rowt.low_range} variant="outlined" onChange={(e) => handleRatingData(e, firstindex, secondindex)} /></TableCell>
                      <TableCell><TextField id="id" name="number" className={classes.buttonlayouttwo} size="small" type="number" label="Score" value={rowt.upper_range} variant="outlined" onChange={(e) => handleRatingData(e, firstindex, secondindex)}/></TableCell>
                      <TableCell><TextField id="id" name="report" className={classes.buttonlayouttwo} size="small" label="Report" value={rowt.star} variant="outlined" onChange={(e) => handleRatingData(e, firstindex, secondindex)}/></TableCell>
                      </TableRow>
                  )})}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    <div className={(classes.bottommargin)}>
    <TextField id="id" name="array[]" className={clsx(classes.container, classes.textfieldlayout)}  type="number" size="small" label="ERP User" value={status} variant="outlined" onChange={handleStatus}  />
    <TextField id="date" label="Date" type="date" defaultValue="2017-05-24" className={clsx(classes.textField,classes.datestyle)} InputLabelProps={{shrink: true, }} value={dateUpdate} onChange={dateUpdatefun}/>
    <TextField id="id" name="report" className={classes.textfieldlayout} size="small" label="Overall Remark" variant="outlined" value={overallRemark} onChange={(e)=>setOverallRemark(e.target.value)} />
    <Button variant="contained" color="primary"  className={classes.sumitbutton} onClick={() => postString()} > Submit </Button> 
    </div>
    </Layout>
    </div>
  )
}

export default Observationreport
