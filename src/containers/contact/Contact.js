import React, { useContext, useEffect } from 'react';
import Layout from '../Layout';
import TabPanel from './TabPanel';
import Tabs from 'react-responsive-tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Button } from '@material-ui/core';
import SelectInput from '@material-ui/core/Select/SelectInput';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axiosInstance from '../../config/axios';
import endpoints from '../../config/endpoints'
import { concat, set, update } from 'lodash';
import 'react-responsive-tabs/styles.css';
import Axios from 'axios';
import ContactAdd from '../contact/ContactAdd';
import ContactUpdate from '../contact/ContactUpdate';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';



const operations = [{ name: 'POST CONTACT NUMBER', biography: <ContactAdd/> }, { name: 'UPDATE CONTACT NUMBER', biography: <ContactUpdate/> }];
function getTabs() {
  return operations.map((operations,index) => ({
    key: index, // Optional. Equals to tab index if this property is omitted
    tabClassName: 'tab', // Optional
    panelClassName: 'panel', // Optional
    title: operations.name,
    getContent: () => operations.biography,
  }));
}

const Contact = () => {
  const { setAlert } = useContext(AlertNotificationContext);
  const [data, setData] = React.useState([])
  const [branch, setBranch] = React.useState([])

  const [value, setValue] = React.useState(0);
  const [submitdata, setSubmitedData] = React.useState([])
  const [grade, setGrade] = React.useState()
  const [state, setState] = React.useState();
  const [updateData, setUpdateData] = React.useState([])

  const [Foe_contact_number, setFoe_contact_number] = React.useState()
  
  useEffect(() => {
    axiosInstance.get(endpoints.academics.branches).then((res) => {
      console.log("res.data.data : ", res.data.data)
      setBranch(res.data.data)
    })

    axiosInstance.get(endpoints.ContactUsAPI.getContactUsAPIFilter, state).then((res) => {
      console.log('contacts', res.data?.branch_id)

    })
  }, [])



  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
    },
  });


  const classes = useStyles();


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const OnFormSubmit = (e) => {
    e.preventDefault()
    console.log('state', state)
    axiosInstance.post(endpoints.ContactUsAPI.getContactUsAPI, {
      foe_contact_number: state.foe_contact_number,
      operation_manager_contact_number: state.operation_manager_contact_number,
      campus_in_charge_contact_number: state.campus_in_charge_contact_number,
      branch_id: grade
    }).then((result) => {

      if (result.data.status_code === 200) {

        // setLoading(false);
        setAlert('success', result.data.message);
      } else {
        // setLoading(false);
        setAlert('error', result.data.message);
      }
    })
      .catch((error) => {
        // setLoading(false);
        setAlert('error', error.message);
      });
      



    console.log("OnFormSubmit", submitdata)
    console.log("gradeid", grade)


    // posting data through api here..
  }
  const [value1, setValue1] = React.useState(0);
  const handleChange1 = (event, newValue) => {
    setValue1(newValue);
  };

  const handleBranch = (evt, value) => {
    console.log("gradevalue:", value)
    setGrade(value.id)
  }


  


  const onChange = (e, value) => {
    e.preventDefault()
    console.log("values", { [e.target.name]: e.target.value })
    setState({ ...state, [e.target.name]: e.target.value })
  }
  const handleFilter = (e) => {
    console.log("hbhhbhb")
    e.preventDefault()
    console.log("branchid", grade)
    axiosInstance.get(`academic/contact/?branch_id=${grade}`).then(res => {
      console.log('res:', res.data.data)
      setUpdateData(res.data.data)
    })

  }
  const  handleUpdate=(id)=>{
    console.log("id:",id)
    axiosInstance.put(`${endpoints.ContactUsAPI.updatedeleteContact}?contactus_id=${id}`,{
      foe_contact_number:state.foe_contact_number,
      operation_manager_contact_number:state.operation_manager_contact_number,
      campus_in_charge_contact_number:state.campus_in_charge_contact_number
    }).then((res)=>{
      console.log("success")
    }

    )

  }

  return (
    <>
      <form onSubmit={OnFormSubmit}>
        <Layout>
          <Paper className={classes.root}>
            <Tabs
              
              items={getTabs()}
            />
              
          </Paper>
        </Layout>
      </form>
    </>
  );
};

export default Contact;

