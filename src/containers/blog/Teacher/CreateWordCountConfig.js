
import React, { useState, useContext,useEffect } from 'react'
import { withRouter ,Link} from 'react-router-dom';
import Layout from '../../Layout'
import Autocomplete from '@material-ui/lab/Autocomplete';
import {  TextField, Grid, Button, useTheme,Tabs, Tab ,Typography, Card, CardContent,CardHeader} from '@material-ui/core'
import moment from 'moment';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { Pagination } from '@material-ui/lab';


import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '95%',
    boxShadow: '0 5px 10px rgba(0,0,0,0.30), 0 5px 10px rgba(0,0,0,0.22)',
    paddingLeft:'10px',
    borderRadius:'10px',
    height:'110px',
    border:'1px #ff6b6b solid'
  },
  container: {
    maxHeight: '70vh',
    width: '100%',
    boxShadow: '0px 0px 10px -5px #fe6b6b',
    borderRadius: '.5rem'
  },
  columnHeader: {
    color: `${theme.palette.secondary.main} !important`,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: `#ffffff !important`,
  },
  tableCell: {
    color: theme.palette.secondary.main,
  },
  typoStyle:{
    fontSize:'12px',
    padding:'1px',
    marginTop: '-5px',
    marginRight: '20px'
  }
 
}));


  


const CreateWordCountConfig = (props) => {
  const classes = useStyles()

  const [currentTab,setCurrentTab] =useState(0)

  const { match } = props

  const [wordCount,setWordCount] =useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'
  const [inActiveListRes,setInActiveListRes]=useState([]);
  const [activeListRes,setActiveListRes]=useState([]);
  const roleDetails = JSON.parse(localStorage.getItem('userDetails'));
  const [grade, setGrade] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState('');
  const [moduleId, setModuleId] = useState(144);
  const [pageSize,setPageSize] = useState(9);
  const [pageNumber,setPageNumber]=useState(1);
  const [totalWc,setTotalWc]=useState(0);

  const [gradeList, setGradeList] = useState([]);
  const [branchId]= useState(roleDetails && roleDetails.role_details.branch && roleDetails.role_details.branch[0])
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const handleDelete = (data) => {

        let requestData = {
          "wrd_count_con_id":data.id
      
        }
      axiosInstance.put(`${endpoints.blog.WordCountConfig}`, requestData)
    
      .then(result=>{
      if (result.data.status_code === 200) {
        setLoading(false);
        setAlert('success', result.data.message);
        getActiveList()
      } else {        
        setLoading(false);
        setAlert('error', result.data.message);
      }
      }).catch((error)=>{
        setLoading(false);        
        setAlert('error', error.message);
      })
    };
    const handlePagination = (event, page) => {
      setPageNumber(page);
      setActiveListRes([]);
      getActiveList()
     };
  const handleSubmit = (e) => {
    const chkWordCount=+wordCount
    const chkNumber = Number.isInteger(chkWordCount)
      if (!chkNumber){
        setAlert('error',"please enter a valid word count with integer" );

      }else{

    setLoading(true);
   
    let requestData= {}
   
      requestData = {
        "word_count":wordCount,
        "grade_id":selectedGrades
      }
  

    axiosInstance.post(`${endpoints.blog.WordCountConfig}`, requestData)

    .then(result=>{
    if (result.data.status_code === 200) {
      setLoading(false);
      setAlert('success', result.data.message);
    } else {        
      setLoading(false);
      setAlert('error', "word config already existing for this grade");
    }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', "word config already existing for this grade");
    }) }
    };
      useEffect(() => {
       
        getActiveList();
      }, []);
      const getActiveList = () => {
        axiosInstance.get(`${endpoints.blog.WordCountConfig}?page_number=${pageNumber}&page_size=${pageSize}`)
          .then((res) => {
              setActiveListRes(res.data.result.data)
              setTotalWc(res.data.result.total_wc)
          }).catch(err => {
              console.log(err)
          })
      } 
    useEffect(() => {
        if (branchId) {
          setGrade([]);
          getGradeApi();
        }
      }, [branchId]);
      const getGradeApi = async () => {
        try {
          setLoading(true);
          const result = await axiosInstance.get(
            `${endpoints.masterManagement.grades}?page=${1}&page_size=${0}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const resultOptions = [];
          if (result.status === 200) {
            setGradeList(result.data.result.results);
            setLoading(false);
          } else {
            setAlert('error', result.data.message);
            setLoading(false);
          }
        } catch (error) {
          setAlert('error', error.message);
          setLoading(false);
        }
      };
  const handleGrade = (event, value) => {
    if (value) {
      setSelectedGrades(value.id);
    } else {
        setSelectedGrades();
    }
    }
      
         
const handleWordCountChange = (e) => {
  setWordCount(e.target.value);
};
const handleTabChange = (event,value) =>{
    setCurrentTab(value)
  }
  const decideTab =() => {
    if (currentTab === 0) {
      return viewTabContent()
    } 
  }

  const viewTabContent= () =>{
    return <div> 
    <Grid container spacing={2}>
    { activeListRes && activeListRes.length
      ? activeListRes.map((item) => {
        return <Grid item xs={12} sm={6} md={4}>
        <Card className={classes.root} >
        <CardHeader
        style={{padding:'0px'}}
//         action=       {
// <IconButton
//           title='Delete'
//           onClick={()=>handleDelete(item)}
          
//         >
//           <DeleteOutlinedIcon
//             style={{ color: themeContext.palette.primary.main }}
//           />
//         </IconButton>
//       }
        action ={
          <IconButton
        title='edit'
        onClick={() =>
          props.history.push({
            pathname: '/blog/wordcount-config/edit',
            state: { data: item },
          })}
        >
        <EditOutlinedIcon
        style={{ color: themeContext.palette.primary.main }}
        />
        </IconButton>
        }
      subheader={
        <Typography
          gutterBottom
          variant='body2'
          align='left'
          component='p'
          style={{ color: '#014b7e' ,pagging:'0px'}}
        >
        Created At : {item && moment(item.created_at).format('MMM DD YYYY')}
        </Typography>
      }
        />
<CardContent  style={{ pagging:'1px'}}>
<Typography  className={classes.typoStyle}>Grade Name: {item.grade.grade_name} </Typography>
<Typography   className={classes.typoStyle}>Word Count : {item.word_count}</Typography>
<Typography   className={classes.typoStyle}>Created By : {item.created_by.first_name}</Typography>
</CardContent>
        </Card>                        
        </Grid>
                                              
        })
    : ''
  }
</Grid>
  </div>
  }

  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                    { gradeList.length ? ( 
                      <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleGrade}
              id='grade'
              disableClearable
              className='dropdownIcon'
              options={gradeList}
              filterSelectedOptions
              getOptionLabel={(option) => option?.grade_name}

              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Grade'
                  placeholder='Grade'
                />
              )}
            />
               ) : null }
                    </Grid>
          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label='Word Count'
                defaultValue=''
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 3 }}
                onChange={(event,value)=>{handleWordCountChange(event);}}
                color='secondary'
                size='small'
              />
          </Grid>
        </Grid>
        <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}>
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{color:'white', width: '100%' }}
              color="primary"
              size='medium'
              type='submit'
              onClick={handleSubmit}
              disabled={!wordCount || !selectedGrades}
            >
              Save
        </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Tabs value={currentTab} indicatorColor='primary'
              textColor='primary'
              onChange={handleTabChange} aria-label='simple tabs example'>
              <Tab label='View'
              />
            </Tabs>
          </Grid>
        </Grid>{decideTab()}
<Grid container>
        <Grid item xs={12}>
                    <Pagination
                    onChange={handlePagination}
                    style={{ paddingLeft:'500px' }}
                    count={Math.ceil(totalWc / pageSize)}
                    color='primary'
                    page={pageNumber}
                    />
            </Grid>
             </Grid>

      </Layout>
    </>
  )
}

export default withRouter(CreateWordCountConfig)