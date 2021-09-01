import React, { useState, useEffect, useContext } from 'react'
import Layout from '../Layout'
import {  TextField, Grid, Button, useTheme } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CustomMultiSelect from '../communication/custom-multiselect/custom-multiselect';
import { AlertNotificationContext } from '../../context-api/alert-context/alert-state';
import endpoints from '../../config/endpoints';
import axiosInstance from '../../config/axios';
import Loading from '../../components/loader/loader';
// import MyTinyEditor from './tinymce-editor'
import {
  Card,
  Typography,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Paper,
  CardHeader,
  Divider,
} from '@material-ui/core';
import { HighlightOff} from '@material-ui/icons'


import Avatar from '@material-ui/core/Avatar';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Dropzone from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '85%',
    margin: '1.25rem 3%',
    boxShadow: 'none'
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
}));


  


const CreateEbook = () => {
  const classes = useStyles()
  const bookTypeChoices=[ { label: 'General', value: '1' },
  { label: 'Curriculum', value: '2' },

  ] 
  const [bookTypeChoicesValue,setBookTypeChoicesValue] =useState('')

  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [author,setAuthor]=useState('');
  const { setAlert } = useContext(AlertNotificationContext);
  const [loading, setLoading] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const themeContext = useTheme();
  const roleDetails = JSON.parse(localStorage.getItem('userDetails'));

  const [gradeList, setGradeList] = useState([]);
  const branchId=roleDetails && roleDetails.role_details.branch && roleDetails.role_details.branch[0]
  console.log(branchId,"@@@@@@@@@@@2")
  // const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};

  const [branchList, setBranchList] = useState([]);
  // const [gradeList, setGradeList] = useState([]);
  const [files,setFiles]=useState([]);
  const [sectionList, setSectionList] = useState([]);
  const isMobile = useMediaQuery(themeContext.breakpoints.down('sm'));
  const wider = isMobile ? '-10px 0px' : '0 0 -1rem 1.5%'
  const widerWidth = isMobile ? '90%' : '85%'
  const { token } = JSON.parse(localStorage.getItem('userDetails')) || {};
  const [selectedGradeIds,setSelectedGradeIds] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [openEditor, setOpenEditor] = useState(true);
  const [moduleId, setModuleId] = useState(8);
  const [subjectList,setSubjectList]=useState([]);


  const handleSubmit = (e) => {
    console.log(files,"@@@")
    e.preventDefault()
    setLoading(true);


    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append('files',files[i]);
    }
    formData.set('ebook_name', title);
    formData.set('ebook_description', description);
    formData.set('ebook_type', bookTypeChoicesValue);
    formData.set('subject_id', selectedSubject);
    formData.set('grade_id', selectedGrades);
    formData.set('ebook_author',author);


    axiosInstance.post(`${endpoints.ebook.ebook}`, formData)

    .then(result=>{
    if (result.data.status_code === 200) {
      setLoading(false);
      setAlert('success', "SUCCESSFULLY UPLOADED EBOOK");
    } else {        
      setLoading(false);
      setAlert('error', result.data.message);
    }
    }).catch((error)=>{
      setLoading(false);        
      setAlert('error', error.message);
    })
    };

    
   
    
const handleBookType = (event, value) => {
  if (value && value.value){
     setBookTypeChoicesValue(value.value)
  }
  else {
     setBookTypeChoicesValue('')
  }
}
  

const handleGrade = (event, value) => {
  if (value) {
    setSelectedGrades(value.id);
    axiosInstance.get(`${endpoints.mappingStudentGrade.subjects}?branch=${branchId}&grade=${value.id}`)
    .then(result => {
      if (result.data.status_code === 200) {
        setSubjectList(result.data.result)
      }
      else {
        setAlert('error', result.data.message)
        setSubjectList([])
      }
    })
    .catch(error => {
      setAlert('error', error.message);
      setSubjectList([])
    })
  } else {
      setSelectedGrades();
  }
  }
  // useEffect(() => {
  //   if (branchId) {
  //     // setGrade([]);
  //     getGradeApi();
  //   }
  // }, [branchId]);

  const getGradeApi = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get(
        `${endpoints.masterManagement.grades}?page=${1}&page_size=${30}`,
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


 const isPDF = (files) => {
  if (files[0].name.match(/.(pdf)$/i)) {
    return true
  }
  return false
}

const onDrop = (files=[]) => {
  if (!isPDF(files)) {

    setAlert('error','Please select only PDF format')
    return
  } else if (files.length > 1) {

    setAlert('error','You can select only a single PDF at once')
    return
  }
  let sampleFile =files
  setFiles(sampleFile);
};

const getFileNameAndSize = (files) => {
  if (files.length) {
    const fileName = files && files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))
    return fileName
  }
  return null
}


const handleSubject = (event, value) => {
  if (value) {
    setSelectedSubject(value.subject_id)
  } else {
    setSelectedSubject();
  }
};

const handleTitleChange = (e) => {
  setTitle(e.target.value);

}
const handleAuthorChange = (e) => {
  setAuthor(e.target.value);

}
const handleDescriptionChange = (e) => {
  setDescription(e.target.value);

}


  return (
   <>
      {loading ? <Loading message='Loading...' /> : null}
      <Layout>

        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>
                   
                    <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
                    {/* { gradeList.length ? (  */}
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
              {/* //  ) : null } */}
                    </Grid>
                    <Grid item xs={12} sm={3}  >
                    {/* { subjectList.length ? (  */}
                      <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleSubject}
              id='grade'
              disableClearable
              className='dropdownIcon'
              options={subjectList}
              getOptionLabel={(option) => option?.subject_name}

              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Subject'
                  placeholder='Subject'
                />
              )}
            />
                    </Grid>
                    <Grid item xs={12} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
            <Autocomplete
              style={{ width: '100%' }}
              size='small'
              onChange={handleBookType}
              id='category'
              required
              options={bookTypeChoices}
              getOptionLabel={(option) => option?.label}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Book type'
                  placeholder='Book type'
                />
              )}
            />
          </Grid>
       
        
        </Grid>
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>

        <Grid item xs={6} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label="Book title"
                defaultValue=''
                // placeholder="Title not more than 100 words"
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 100 }}
                onChange={(event,value)=>{handleTitleChange(event);}}
                color='secondary'
                // helperText={`${title.length}/100`}
                size='small'
              />
          </Grid>

        <Grid item xs={6} sm={3}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
              <TextField
                id='outlined-helperText'
                label="Author name"
                defaultValue=''
                // placeholder="Title not more than 100 words"
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 100 }}
                onChange={(event,value)=>{handleAuthorChange(event);}}
                color='secondary'
                // helperText={`${title.length}/100`}
                size='small'
              />
          </Grid>
        </Grid>
        <Grid container spacing={isMobile ? 3 : 5} style={{ width: widerWidth, margin: wider }}>

<Grid item xs={12} sm={12}  className={isMobile ? 'roundedBox' : 'filterPadding roundedBox'}>
        <TextField
                id='outlined-helperText'
                label="Description"
                defaultValue=''
                // placeholder="Title not more than 100 words"
                variant='outlined'
                style={{ width: '100%' }}
                inputProps={{ maxLength: 100 }}
                onChange={(event,value)=>{handleDescriptionChange(event);}}
                color='secondary'
                // helperText={`${title.length}/100`}
                size='small'
              />

  </Grid>
  <Grid item xs={12}>
                    <Typography style={{ margin: 10 }} variant='body1'>
                      Upload book in pdf format 
                    </Typography>
                    <Typography
                      color='textPrimary'
                      style={{ margin: 10 }}
                      variant='caption'
                    >
                    </Typography>
                    <Card className={classes.Card}>
                      <Dropzone 
                      onDrop={onDrop}
                      >
                        {({
                          getRootProps,
                          getInputProps,
                          isDragActive,
                          isDragAccept,
                          isDragReject,
                        }) => (
                          <Card
                            elevation={0}
                            style={{
                              width: '320px',
                              height: '150px',
                              border: '1px solid #ff6b6b',
                            }}
                            {...getRootProps()}
                            className='dropzone'
                          >
                            <CardContent>
                              <input {...getInputProps()} />
                              <div>
                                {isDragAccept && 'All files will be accepted'}
                                {isDragReject && 'Some files will be rejected'}
                                {!isDragActive && (
                                  <> 
                                    <CloudUploadIcon
                                      color='primary'
                                      style={{ marginLeft: '45%', marginTop: '15%' }}
                                    />drop file
                                  </>
                                )}
                                
                              </div>
                              {getFileNameAndSize(files)}
                              {/* {files} */}
                            </CardContent>
                          </Card>
                        )}
                      </Dropzone>
                      
</Card>
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
              disabled={!selectedGrades  ||!selectedSubject || !title ||!description ||!author
              ||!files.length> 0 }
            >
              Save
        </Button>
          </Grid>
        </Grid>
      </Layout>
    </>
  )
}

export default CreateEbook