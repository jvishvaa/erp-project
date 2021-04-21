import React, { useContext, useEffect } from 'react';
import Layout from '../Layout';
import TabPanel from './TabPanel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button } from '@material-ui/core';
import SelectInput from '@material-ui/core/Select/SelectInput';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints'
import { concat, set, update } from 'lodash';
import Axios from 'axios';
import  "./Contact.css";

import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';





const ContactUpdate = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [data, setData] = React.useState([])
  const [branch, setBranch] = React.useState([])

  // const [value, setValue] = React.useState(0);
  const [submitdata, setSubmitedData] = React.useState([])
  const [grade, setGrade] = React.useState(0)
  const [state, setState] = React.useState('');
  const [updateData, setUpdateData] = React.useState([])

  const [Foe_contact_number, setFoe_contact_number] = React.useState()
  const [Operation_manager_contact_number, setOperation_manager_contact_number] = React.useState()
  const [Campus_in_charge_contact_number, setCampus_in_charge_contact_number] = React.useState()
  const [mobileerror, setMobileerror]=React.useState("Something Went Wrong Can'Update..,Please, Enter 10 Digits Mobile Number.!");

  
  useEffect(() => {
    axiosInstance.get(endpoints.academics.branches).then((res) => {
      console.log("res.data.data : ", res.data.data)
      setBranch(res.data.data)
    })

 
  }, [])



  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
    },
  });

 



  const handleBranch = (evt, value) => {
    console.log("gradevalue:", value)
    setUpdateData([]);
    setGrade(value.id);
  }



  const MobileChange = (e, value) => {
    e.preventDefault();
    console.log("values1",value )
    console.log("values", { [e.target.name]: e.target.value })
    if(e.target.value.length===10){
      setState({ ...state, [e.target.name]: e.target.value }) 
    }else{
      setAlert('error',mobileerror)
      setState('')
    }
    
  }


  const handleFilter = (e) => {
    console.log("hbhhbhb")
    e.preventDefault()
    console.log("branchid", grade)
    axiosInstance.get(`academic/contact/?branch_id=${grade}`).then(res => {
      console.log('res:', res.data.data)
      if(!(res.data.data.branch_id ))
       setUpdateData(res.data.data)
      else
       alert("Select Branch...!")
    })

  }
  const  handleUpdate=(id)=>{
    console.log("id:",id)
    state.foe_contact_number.length=0;
    state.operation_manager_contact_number.length=0;
    state.campus_in_charge_contact_number.length=0;

    if (state.foe_contact_number.length===10&&
      state.operation_manager_contact_number.length===10&&
      state.campus_in_charge_contact_number.length===10) {
      axiosInstance.put(`${endpoints.ContactUsAPI.updatedeleteContact}?contactus_id=${id}`,{
        foe_contact_number:state.foe_contact_number,
        operation_manager_contact_number:state.operation_manager_contact_number,
        campus_in_charge_contact_number:state.campus_in_charge_contact_number
      }).then((res)=>{
        if (res.data.status_code === 200) {

                // setLoading(false);
                setAlert('success', res.data.message);
              } else {
                // setLoading(false);
                setAlert('error', res .data.message);
              }
            })
              .catch((error) => {
                // setLoading(false);
                setAlert('error', error.message);
              });
        console.log("success");
        setUpdateData([])
      }
      else{
        setAlert('error', mobileerror)
      }
  }

  return (
    <>
       <form >
       <Grid container spacing={2} direction="column">
       <Grid container spacing={0} direction="row">
          <Grid  item xs={8} sm={8} md={5} lg={4}>
                <Autocomplete
                  id="combo-box-demo"
                  options={branch}
                  getOptionLabel={(option) => option.branch_name}
                  fullWidth
                  // style={{ width: '20%' }}
                  
                  onChange={handleBranch}
                  helperText="      "
                  renderInput={(params) => <TextField {...params} label="Branch" helperText="      " variant="outlined" />}
                />
                 </Grid>
                <Grid item xs={1}>
                <Button variant='contained' color='primary' style={{height:"95%"}} onClick={handleFilter}>
                  Filter
                </Button>
              </Grid>
              </Grid>
              {updateData ? updateData.map((data) => {
              
                return (
                  <>
                   <Grid item className="postContact" xs={8} sm={8} md={5} lg={4}>
                       <TextField
                        label='FOE Contact'
                        variant='outlined'
                        size='medium'
                        // style={{ width: '20%' }}
                        fullWidth
                        name='foe_contact_number'
                        onChange={MobileChange}
                        defaultValue={data.foe_contact_number}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        required='true'
                        
                        helperText="Enter 10 digit Number...!"
                        inputProps={{pattern:"/^[2-9]{2}\d{8}$/",maxLength:10}}
                      />
                        </Grid>
                        <Grid item className="postContact" xs={8} sm={8} md={5} lg={4}>
                      <TextField
                        label='Manager Contact'
                        variant='outlined'
                        size='medium'
                        // style={{ width: '20%' }}
                        fullWidth
                        name='operation_manager_contact_number'
                        onChange={MobileChange}
                        defaultValue={data.operation_manager_contact_number}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        required='true'
                        inputProps={{pattern:"/^[2-9]{2}\d{8}$/",maxLength:10}}
                        helperText="Enter 10 digit Number...!"
                      
                      />
                        </Grid>
                        <Grid item className="postContact" xs={8} sm={8} md={5} lg={4}>
                  
                      <TextField
                        label='Incharge Contact '
                        variant='outlined'
                        size='medium'
                        // style={{ width: '20%' }}
                        fullWidth
                        name='campus_in_charge_contact_number'
                        onChange={MobileChange}
                        defaultValue={data.campus_in_charge_contact_number}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        required='true'
                        helperText="Enter 10 digit Number...!"
                        inputProps={{pattern:"/^[2-9]{2}\d{8}$/",maxLength:10}}
                      />
                      </Grid>
                   
                      <Grid container spacing={5} style={{ width: '95%',paddingTop:'25px' }}  >
                      <Grid item xs={6} sm={2}>
                        <Button
                          variant='contained'
                          color='primary'
                          size='medium'
                          type='submit'
                          onClick={(e)=>{
                            e.preventDefault();
                            handleUpdate(data.id)
                          }
                           
                            
                          }
                        >
                          Update
                     </Button>
                      </Grid>
                    </Grid> 
                  
                  </>
                

                )
                        }
              )
                : "no data"
              }
              </Grid>
                </form>
    </>
  );
};

export default ContactUpdate;

