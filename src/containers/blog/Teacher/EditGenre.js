
import React, { useState, useContext } from 'react'
import { withRouter,useHistory } from 'react-router-dom';
import Layout from '../../Layout'
import {  TextField, Grid, Button, useTheme,Tabs, Tab ,Typography, Card, CardContent,CardHeader} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AlertNotificationContext } from '../../../context-api/alert-context/alert-state';
import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';
import Loading from '../../../components/loader/loader';
import Autocomplete from '@material-ui/lab/Autocomplete';

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
  rootG: {
    flexGrow: 1,
  },
  typoStyle:{
    fontSize:'12px',
    padding:'1px',
    marginTop: '-5px',
    marginRight: '20px'
  }
}));


  


const EditGenre = (props) => {
  const classes = useStyles()
  const data =props.location.state.data
  const history = useHistory()

  const [genreNameEdit,setGenreNameEdit] =useState('');
  const [genreName,setGenreName] =useState('');
  const gradeObj= data.grade
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const themeContext = useTheme();
  const [gradeList,setGradeList]=useState([]);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'

  
  

  
    const handleEditSubmit = (e) => {
      setLoading(true);
      let requestData= {}
     
        requestData = {
          "genre_id":data.id,
          "genre":genreNameEdit ||data.genre,
          "grade_id":data.grade.id
        }
    
  
      axiosInstance.put(`${endpoints.blog.genreList}`, requestData)
  
      .then(result=>{
      if (result.data.status_code === 200) {
        setLoading(false);
        setAlert('success', result.data.message);
        history.push('/blog/genre')
      } else {        
        setLoading(false);
        setAlert('error', result.data.error);
      }
      }).catch((error)=>{
        setLoading(false);        
        setAlert('error', "duplicates not allowed");
      })
      };

   
   
        
  

const handleGenreNameEditChange = (e) => {
  setGenreNameEdit(e.target.value);
};



  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
        <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                      <Autocomplete
              style={{ width: '100%' }}
              size='small'
              id='grade'
              className='dropdownIcon'
              options={gradeList || []}
              value={gradeObj}
              filterSelectedOptions
              disableClearable
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
                    </Grid>
          <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label='Genre Name'
                defaultValue={data.genre}
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 20 }}
                onChange={(event,value)=>{handleGenreNameEditChange(event);}}
                color='secondary'
                size='small'
              />
          </Grid>
        </Grid>
        <Grid container spacing={isMobile ? 1 : 5} style={{ width: '95%', margin: '-1.25rem 1.5% 0 1.5%' }}>
          <Grid item xs={6} sm={2}>
            <Button
              variant='contained'
              style={{ color: 'white' }}
              color="primary"
              className="custom_button_master"
              size='medium'
              type='submit'
              onClick={handleEditSubmit}
              disabled={!genreNameEdit || !data.genre}
            >
              Update
        </Button>
          </Grid>
        </Grid>
        
       

      </Layout>
    </>
  )
}

export default withRouter(EditGenre)