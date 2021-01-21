import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Stepper, Step, StepLabel, Grid, FormGroup, FormControlLabel, Checkbox,
  FormControl, FormLabel, Button, Table, TableBody, TableCell, TableHead,
  TableRow, Tab, Tabs, Paper, TextField, makeStyles, IconButton, Typography, Divider
} from '@material-ui/core'
import {
  Attachment as AttachmentIcon,
  HighlightOffOutlined as CloseIcon
} from '@material-ui/icons'
import { OmsSelect, Modal } from '../../ui'
import { apiActions } from '../../_actions'
import GSelect from '../../_components/globalselector'
import { CombinationStudent, CombinationTeacher } from './config'
import { urls } from '../../urls'
import TextArea from './textArea'
import styles from './sms.styles'

function getSteps (isEmail = false) {
  if (isEmail) {
    return ['Get Recipients', 'Select Recipients', 'Send Email']
  }
  return ['Get Recipients', 'Select Recipients', 'Send Message']
}

let rolesNotRequired = [
  'Teacher_applicant',
  'Applicant',
  'Planner',
  'Principal',
  'FinanceAccountant',
  'AcademicCoordinator',
  'Admin',
  'BDM',
  'FOE',
  'Subjecthead',
  'Reviewer',
  'FinanceAdmin',
  'StoreAdmin',
  'EA',
  'Developer',
  'MIS',
  'LeadTeacher',
  'GuestStudent',
  'EA Academics'
]

let rolesAllowedForEmail = [
  'Teacher',
  'Parent'
]

const FileRow = (props) => {
  const { file, onClose, className } = props
  return (
    <div className={className}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h6'>
            {file.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <CloseIcon onClick={onClose} />
        </Grid>
      </Grid>
      <Divider />
    </div>
  )
}

const useStyles = makeStyles(styles)

const Sms = props => {
  console.log(props)
  const [activeStep, setActiveStep] = useState(0)
  const [role, setRole] = useState()
  const [stayCategory, setStayCategory] = useState({
    'Residential': false,
    'Day Scholar': false
  })
  const [gender, setGender] = useState({
    male: false,
    female: false,
    other: false
  })
  const [transport, setTransport] = useState({
    True: false,
    False: false
  })
  const [filterData, setFilterData] = useState({})
  const [studentData, setStudentData] = useState([])
  const [teacherData, setTeacherData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [students, setStudents] = useState(new Set())
  const [teachers, setTeachers] = useState(new Set())
  const [smsType, setSmsType] = useState()
  const [message, setMessage] = useState()
  const [flag, setFlag] = useState(false)
  const [decideMappingId, setDeicideMappingId] = useState()
  const [state, setState] = React.useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  })
  const [currentTab, setCurrentTab] = useState(0)
  const [isTabDisabled, setTabDisable] = useState(true)
  const [emailSubject, setEmailSubject] = useState(null)
  const [isAllSelected, setIsAllSelected] = useState(false)
  const [files, setFiles] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [unAvlCntctDtl, setUnAvlCntctDtl] = useState([])

  const classes = useStyles()

  const handleChange = name => event => {
    if (name === 4) {
      setState({ [name]: event.target.checked })
    } else if (name === 0) {
      setState({
        0: event.target.checked,
        1: event.target.checked,
        2: event.target.checked,
        3: event.target.checked,
        4: false
      })
    } else {
      setState({ ...state, [name]: event.target.checked, 0: false, 4: false })
    }
  }
  let steps = getSteps(props.isEmail)

  useEffect(() => {
    setActiveStep(0)
  }, [])

  useEffect(() => {
    setPage(1)
    setTeacherData([])
    setStudentData([])
    setStudents(new Set())
    setTeachers(new Set())
    setSmsType()
    setMessage()
    setEmailSubject(null)
    setIsAllSelected(false)
    setFiles([])
  }, [gender, stayCategory, transport, filterData, role])

  useEffect(() => {
    if (!state[0] && state[1] && state[2] && state[3]) setState({ ...state, 0: true })
  }, [state])

  useEffect(() => {
    if (flag) {
      setTeachers(teachers)
      setStudents(students)
      setFlag(false)
    }
  }, [flag, students, teachers])

  useEffect(() => {
    if (role) {
      getStudentData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab])

  function getFilterData (data) {
    console.log(data.section_mapping_id)
    if (data.section_mapping_id) {
      setDeicideMappingId(data.section_mapping_id)
      console.log(decideMappingId)
    } else {
      setDeicideMappingId(data.acad_branch_grade_mapping_id)
    }
    // if (data.contains(section_mapping_id))
    setFilterData(data)
  }

  function handleBack () {
    setActiveStep(activeStep - 1)
  }

  // function studentParentChecks (role) {
  //   if (Object.values(transport).includes(true) &&
  //     Object.values(stayCategory).includes(true) &&
  //     Object.values(gender).includes(true)) {
  //     if (role === 'Parent' && Object.values(state).includes(true)) {
  //       return true
  //     } else if (role === 'Student') {
  //       return true
  //     }
  //   }
  //   return false
  // }

  function getStudentDataFields () {
    let studentData = {}
    let smsTo = []
    Object.keys(state).forEach(function (item) {
      if (state[item]) smsTo.push(parseInt(item))
    })
    const stdGender = Object.keys(gender).map(key => key).filter(key => gender[key])
    const stdStayCategory = Object.keys(stayCategory).map(key => key).filter(key => stayCategory[key])
    const stdTransport = Object.keys(transport).map(key => key).filter(key => transport[key])
    studentData = {
      stay_category: stdStayCategory,
      gender: stdGender,
      transport: stdTransport,
      point_of_contacts: smsTo,
      is_active: currentTab === 0 ? 'True' : 'False'
    }
    return studentData
  }

  function handleNext () {
    if (activeStep === 0) {
      if (role.label === 'Student' || role.label === 'Parent') {
        if (filterData.section_mapping_id) {
          delete filterData.branch_id
          delete filterData.acad_branch_grade_mapping_id
        } else {
          delete filterData.branch_id
          delete filterData.section_mapping_id
        }
      }
      console.log('FILTER DATA', filterData, role)
      if (Object.entries(filterData).length !== 0 && role) {
        console.log('FILTER DATA ++++', filterData, role)
        if (role.label === 'Student') getStudentData()
        else if (role.label === 'Teacher') getTeacherData()
        else if (role.label === 'Parent') {
          if (Object.values(state).includes(true)) {
            getStudentData()
          } else {
            props.alert.error('Select required details')
            return
          }
        }
        setActiveStep(activeStep + 1)
      } else props.alert.error('Select required details')
    } else if (activeStep === 1) {
      props.loadSmsTypes()
      let data = {
        user_type: role.label,
        category: props.isEmail ? 'EMAIL' : 'SMS',
        selected_all: isAllSelected
      }

      let selectedStudentData = {}
      if (role.label === 'Student' || role.label === 'Parent') {
        selectedStudentData = getStudentDataFields()
      }

      data = { ...filterData, ...data, ...selectedStudentData }

      if (teachers.size !== 0) data['teacher_ids'] = [...teachers]
      if (students.size !== 0) data['students'] = [...students]

      let queryString = '?'
      const dataKeys = Object.keys(data)
      dataKeys.forEach((key, index) => {
        if (key === 'teacher_ids' ||
            key === 'students' ||
            key === 'point_of_contacts') {
          const arrStr = encodeURIComponent(data[key])
          queryString += `${key}=${arrStr}&`
        } else {
          queryString += `${key}=${data[key]}&`
        }
      })
      axios.get(`${urls.SmsEmailDetails}${queryString}`, {
        headers: {
          'Authorization': `Bearer ${props.user}`
        }
      }).then(res => {
        if (!res || !res.data || !res.data.length) {
          setActiveStep(c => c + 1)
        } else {
          setOpenModal(true)
          setUnAvlCntctDtl(res.data)
        }
      }).catch(err => {
        console.error(err)
        props.alert.error('Something Went Wrong')
      })
      // setActiveStep(activeStep + 1)
    } else if (activeStep === 2) {
      if (props.isEmail && !emailSubject) {
        props.alert.error('Provide Subject to send email')
        return
      }
      if (!message || !smsType) {
        props.alert.error(`Provide message details to send ${props.isEmail ? 'Email' : 'SMS'}`)
        return
      }
      sendMessage()
    }
  }

  function handleScroll (event) {
    let { target } = event
    if (target.scrollTop + target.clientHeight >= target.scrollHeight && totalPage >= page) {
      if (role.label === 'Student' || role.label === 'Parent') getStudentData()
      else if (role.label === 'Teacher') getTeacherData()
    }
  }

  function getStudentData () {
    let smsTo = []
    Object.keys(state).forEach(function (item) {
      if (state[item]) smsTo.push(parseInt(item))
    })
    let data = {
      user_type: role.label,
      page_size: 5,
      page_number: page
    }
    let selectedStudentData = getStudentDataFields()
    // let data = {
    //   stay_category: stayCategory,
    //   gender: gender,
    //   transport: transport,
    //   point_of_contacts: smsTo,
    //   is_active: currentTab === 0 ? 'True' : 'False'
    // }
    data = { ...filterData, ...data, ...selectedStudentData }
    console.log(data, 'student data')
    let path = urls.STUDENTFILTER + '?'

    const dataKey = Object.keys(data)
    dataKey.forEach((key, index) => {
      if (index === dataKey.length - 1) {
        path += `${key}=${data[key]}`
      } else {
        path += `${key}=${data[key]}&`
      }
    })
    axios
      .get(path, {
        headers: {
          Authorization: 'Bearer ' + props.user
        }
      })
      .then((res) => {
        if (page !== 1 && studentData.length === students.size) {
          let st = students
          res.data.student_data.map(student => st.add(student.id))
          setStudents(st)
        }
        console.log()
        setStudentData([...studentData, ...res.data.student_data])
        setTotalPage(res.data.total_page_count)
        setPage(page + 1)
        setTabDisable(false)
      })
      .catch(e => {
        console.log('error', e)
      })
  }

  function getTeacherData () {
    let data = {
      user_type: role.label,
      page_size: 5,
      page_number: page
    }
    data = { ...filterData, ...data }
    let path = urls.TeacherFilter
    axios
      .get(path, {
        params: data,
        headers: {
          Authorization: 'Bearer ' + props.user
        }
      })
      .then(res => {
        if (res.status === 200) {
          if (page !== 1 && teacherData.length === teachers.size) {
            let tc = teachers
            res.data.staff_data.map(teacher => tc.add(teacher.id))
            setTeachers(tc)
          }
          setTeacherData([...teacherData, ...res.data.staff_data])
          // const unAvailableEmail = res.data.staff_data.filter(teacher => !teacher.user.email)
          // setUnavailableTeacherEmail(unAvailableEmail)
          setTotalPage(res.data.total_page_count)
          setPage(page + 1)
        }
      })
      .catch(e => console.log(e))
  }

  function sendMessage () {
    let data = {
      user_type: role.label,
      sms_type: smsType.label,
      message: message,
      category: props.isEmail ? 'EMAIL' : 'SMS',
      selected_all: isAllSelected
    }
    // if (teachers.size !== teacherData.length) data['teacher_ids'] = [...teachers]
    // if (students.size !== studentData.length) data['students'] = [...students]

    if (teachers.size !== 0) data['teacher_ids'] = String([...teachers])
    if (students.size !== 0) data['students'] = String([...students])

    let selectedStudentData = {}

    if (role.label === 'Student' || role.label === 'Parent') {
      selectedStudentData = getStudentDataFields()
    }

    data = { ...filterData, ...data, ...selectedStudentData }

    const formData = new FormData()

    if (props.isEmail) {
      data.subject = emailSubject
      files.forEach((file, index) => {
        formData.set(`files${index}`, files[index])
      })
    }

    const dataKeys = Object.keys(data)
    dataKeys.forEach(key => {
      formData.set(`${key}`, data[key])
    })

    var path = urls.NormalSMS
    axios
      .post(path, formData, {
        headers: {
          Authorization: 'Bearer ' + props.user
        }
      })
      .then(res => {
        if (res.status === 200) props.alert.success('Message Sent')
        else if (res.status === 204 && !props.isEmail) props.alert.warning('SMS credit for the user has completed')
        else if (res.status === 205 && !props.isEmail) props.alert.warning('Branch has no SMS credit')
        else props.alert.error('Error occured')
      })
      .catch(e => {
        console.log(e)
      })
  }

  function handleCheckBox (e, role, id) {
    if (!e.target.checked) {
      setIsAllSelected(false)
    }
    if (role === 'teacher') {
      let tc = teachers
      if (e.target.checked) {
        tc.add(id)
      } else {
        tc.delete(id)
      }
      setTeachers(tc)
    } else {
      let st = students
      if (e.target.checked) {
        st.add(id)
      } else {
        st.delete(id)
      }
      setStudents(st)
    }
    setFlag(true)
  }

  function handleTabChange (event, selectedTab) {
    setCurrentTab(selectedTab)
    setStudentData([])
    setPage(1)
    setStudents(new Set())
    setTabDisable(true)
  }

  const uploadFileHandler = (e) => {
    if (e.target.files[0]) {
      const newFiles = [...files, e.target.files[0]]
      setFiles(newFiles)
    }
  }

  const removeFileHandler = (i) => {
    const newFiles = files.filter((_, index) => index !== i)
    setFiles(newFiles)
  }

  const continueModalHandler = () => {
    if (activeStep === 1) {
      setActiveStep(c => c + 1)
    }
    setOpenModal(false)
  }

  const checkFieldsHandler = (type, e, states, setStates) => {
    const updatedStates = { ...states, [type]: e.target.checked }
    setStates(updatedStates)
  }

  let modal = null
  if (openModal) {
    modal = (
      <Modal
        open={openModal}
        click={() => setOpenModal(false)}
        style={{ padding: '10px' }}
      >
        <Typography
          variant='h5'
          style={{
            textAlign: 'center',
            marginBottom: '10px'
          }}
        >
          {`Candidates Not Having ${props.isEmail ? 'Email' : 'Contact Number'}`}
        </Typography>
        <Divider style={{ marginBottom: '10px' }} />
        <Table style={{ marginBottom: '15px' }}>
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>{role.label}</TableCell>
              {role.label === 'Student' ||
                role.label === 'Teacher'
                ? <TableCell>Branch</TableCell> : null}
              <TableCell>ERP</TableCell>
              <TableCell>Gender</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unAvlCntctDtl.map((item, i) => (
              <TableRow key={item.status}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                {role.label === 'Student' ||
                role.label === 'Teacher'
                  ? <TableCell>{item.branch}</TableCell> : null}
                <TableCell>{item.erp}</TableCell>
                <TableCell>{item.gender || ' '}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Grid container justify='space-between' className={classes.modalButtons}>
          <Grid item xs={9} md={3}>
            <Button
              color='primary'
              variant='contained'
              fullWidth
              onClick={() => setOpenModal(false)}
            >
              Back
            </Button>
          </Grid>
          <Grid item xs={9} md={3}>
            <Button
              color='primary'
              variant='contained'
              fullWidth
              onClick={continueModalHandler}
            >
            Continue
            </Button>
          </Grid>
        </Grid>
      </Modal>
    )
  }

  return (
    <React.Fragment>
      {/* stepper start */}
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const props = {}
          const labelProps = {}
          return (
            <Step key={label} {...props}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      {/* stepper end */}
      {activeStep === 0
        ? <div style={{ margin: '2%' }}>
          <Grid container style={{ marginBottom: '20px' }} spacing={2}>
            <Grid item xs={10} md={5}>
              <OmsSelect
                label='User Type'
                placeholder='Select User Type'
                options={props.roles
                  ? props.roles
                    .filter(
                      role => {
                        if (props.isEmail) {
                          return rolesAllowedForEmail.includes(role.role_name)
                        }
                        return !rolesNotRequired.includes(role.role_name)
                      }
                    )
                    .map(role => ({
                      value: role.id,
                      label: role.role_name
                    }))
                  : []}
                change={e => setRole(e)}
                defaultValue={role}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={10} md={9}>
              {role && role.label === 'Teacher' &&
                <GSelect
                  onChange={e => getFilterData(e)}
                  config={CombinationTeacher}
                />}
            </Grid>
            {role && (role.label === 'Student' || role.label === 'Parent') &&
              <React.Fragment>
                <Grid item xs={12}>
                  <GSelect
                    variant={'selctor'}
                    onChange={e => getFilterData(e)}
                    config={CombinationStudent}
                  />
                </Grid>
                <Grid item xs={10} md={3}>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>Stay Category</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={stayCategory['Residential']}
                            onChange={(event) => checkFieldsHandler('Residential', event, stayCategory, setStayCategory)}
                            value='Residential'
                            color='primary'
                          />
                        }
                        label='Residential'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={stayCategory['Day Scholar']}
                            onChange={(event) => checkFieldsHandler('Day Scholar', event, stayCategory, setStayCategory)}
                            value='Day Scholar'
                            color='primary'
                          />
                        }
                        label='Day Scholar'
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={10} md={3}>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>Gender</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={gender['male']}
                            onChange={(event) => checkFieldsHandler('male', event, gender, setGender)}
                            value='male'
                            color='primary'
                          />
                        }
                        label='Male'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={gender['female']}
                            onChange={(event) => checkFieldsHandler('female', event, gender, setGender)}
                            value='female'
                            color='primary'
                          />
                        }
                        label='Female'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={gender['other']}
                            onChange={(event) => checkFieldsHandler('other', event, gender, setGender)}
                            value='other'
                            color='primary'
                          />
                        }
                        label='Other'
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={10} md={3}>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>Transport</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={transport['True']}
                            onChange={(event) => checkFieldsHandler('True', event, transport, setTransport)}
                            value='yes'
                            color='primary'
                          />
                        }
                        label='Yes'
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={transport['False']}
                            onChange={(event) => checkFieldsHandler('False', event, transport, setTransport)}
                            value='no'
                            color='primary'
                          />
                        }
                        label='No'
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </React.Fragment>
            }
            {role && role.label === 'Parent' &&
              <Grid item xs={10} md={3}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>{`${props.isEmail ? 'Email' : 'SMS'} to be sent to`}</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state[0]}
                          onChange={handleChange(0)}
                          value='checkedAll'
                          color='primary'
                        />
                      }
                      label='All'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state[1]}
                          onChange={handleChange(1)}
                          value='checkedF'
                          color='primary'
                        />
                      }
                      label='Father'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state[2]}
                          onChange={handleChange(2)}
                          value='checkedM'
                          color='primary'
                        />
                      }
                      label='Mother'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state[3]}
                          onChange={handleChange(3)}
                          value='checkedG'
                          color='primary'
                        />
                      }
                      label='Guardian'
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state[4]}
                          onChange={handleChange(4)}
                          value='checkedP'
                          color='primary'
                        />
                      }
                      label='Point of Contact'
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            }
          </Grid>
        </div>
        : activeStep === 1
          ? <div>
            {role.label === 'Parent' || role.label === 'Student'
              ? (
                <React.Fragment>
                  {/* {
                    props.isEmail
                      ? (
                        <Grid container spacing={2} justify='flex-end'>
                          <Grid item xs={4}>
                            <Button
                              color='primary'
                              variant='contained'
                            >
                              Email Unavailability
                            </Button>
                          </Grid>
                        </Grid>
                      ) : null
                  } */}
                  <div style={{ padding: 20, width: 375 }}>
                    <Paper square>
                      <Tabs
                        value={currentTab}
                        indicatorColor='primary'
                        textColor='primary'
                        onChange={handleTabChange}
                      >
                        <Tab label='Active Students' disabled={isTabDisabled} />
                        <Tab label='In-Active Students' disabled={isTabDisabled} />
                      </Tabs>
                    </Paper>
                  </div>
                </React.Fragment>
              )
              : ''
            }
            <div
              style={{ position: 'relative', maxHeight: '290px', overflow: 'auto' }}
              onScroll={handleScroll}
            >
              {studentData.length > 0 && <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        color='default'
                        onChange={e => {
                          setIsAllSelected(e.target.checked)
                          if (e.target.checked) {
                            setStudents(new Set(...[studentData.map(st => (st.id))]))
                          } else setStudents(new Set())
                        }}
                        checked={isAllSelected}
                      />
                    </TableCell>
                    <TableCell>Sr.</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>ERP</TableCell>
                    {role && role.label === 'Student' && <TableCell>Number</TableCell>}
                    {role && role.label === 'Parent' && state[1] && <TableCell>Father</TableCell>}
                    {role && role.label === 'Parent' && state[2] && <TableCell>Mother</TableCell>}
                    {role && role.label === 'Parent' && state[3] && <TableCell>Guardian</TableCell>}
                    <TableCell>Student Roll No</TableCell>
                    <TableCell>Branch</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Class Group</TableCell>
                    <TableCell>Gender</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentData.map((row, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>
                            <Checkbox
                              color='default'
                              onChange={e => { handleCheckBox(e, 'student', row.id) }}
                              checked={students.has(row.id)}
                            />
                          </TableCell>
                          <TableCell>{++index}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.erp}</TableCell>
                          {role && role.label === 'Student' &&
                          <TableCell>{row.contact_no}</TableCell>
                          }
                          {role && role.label === 'Parent' && state[1] &&
                          <TableCell>
                            {row.parent.father_name}<br />
                            {props.isEmail ? row.parent.father_email : row.parent.father_mobile}
                          </TableCell>
                          }
                          {role && role.label === 'Parent' && state[2] &&
                          <TableCell>
                            {row.parent.mother_name}<br />
                            {props.isEmail ? row.parent.mother_email : row.parent.mother_mobile}
                          </TableCell>
                          }
                          {role && role.label === 'Parent' && state[3] &&
                          <TableCell>
                            {row.parent.guardian_name}<br />
                            {props.isEmail ? row.parent.guardian_email : row.parent.guardian_mobile}
                          </TableCell>
                          }
                          <TableCell>{row.roll_no}</TableCell>
                          <TableCell>{row.branch ? row.branch.branch_name : ''}</TableCell>
                          <TableCell>{row.grade ? row.grade.grade : ''}</TableCell>
                          <TableCell>{row.section ? row.section.section_name : ''}</TableCell>
                          <TableCell>{row.classgroup}</TableCell>
                          <TableCell>{row.gender}</TableCell>
                        </TableRow>
                      </React.Fragment>
                    )
                  })}
                </TableBody>
              </Table>}
              {teacherData.length > 0 && (
                <React.Fragment>
                  {/* {
                    props.isEmail
                      ? (
                        <Grid container spacing={2} justify='flex-end'>
                          <Grid item xs={4}>
                            <Button
                              color='primary'
                              variant='contained'
                              disabled={unAvailableTeacherEmail.length === 0}
                            >
                              Email Unavailability {unAvailableTeacherEmail.length + '/' + teacherData.length}
                            </Button>
                          </Grid>
                        </Grid>
                      ) : null
                  } */}
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Checkbox
                            color='default'
                            onChange={e => {
                              setIsAllSelected(e.target.checked)
                              if (e.target.checked) {
                                setTeachers(new Set(...[teacherData.map(tc => (tc.id))]))
                              } else setTeachers(new Set())
                            }}
                            checked={isAllSelected}
                          />
                        </TableCell>
                        <TableCell>Sr.</TableCell>
                        <TableCell>Staff Name</TableCell>
                        <TableCell>ERP</TableCell>
                        <TableCell>Number</TableCell>
                        {props.isEmail
                          ? (<TableCell>Email</TableCell>
                          ) : null}
                        <TableCell>Branch</TableCell>
                        <TableCell>Department</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teacherData.map((row, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>
                                <Checkbox
                                  color='default'
                                  onChange={e => { handleCheckBox(e, 'teacher', row.id) }}
                                  checked={teachers.has(row.id)}
                                />
                              </TableCell>
                              <TableCell>{++index}</TableCell>
                              <TableCell>{row.name}</TableCell>
                              <TableCell>{row.erp_code}</TableCell>
                              <TableCell>{row.contact_no}</TableCell>
                              {
                                props.isEmail
                                  ? (
                                    <TableCell>{row.user.email || ' '}</TableCell>
                                  ) : null
                              }
                              <TableCell>{row.branch_fk.branch_name}</TableCell>
                              <TableCell>{row.department_fk ? row.department_fk.department_name : ''}</TableCell>
                            </TableRow>
                          </React.Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </React.Fragment>
              )
              }
            </div>
          </div>
          : <div style={{ margin: '2%' }}>
            <Grid container spacing={2}>
              <Grid item xs={10} md={7}>
                <OmsSelect
                  label={props.isEmail ? 'Email Category' : 'SMS Category'}
                  placeholder={props.isEmail ? 'Select Email Type' : 'Select SMS Type'}
                  options={props.smsTypes
                    ? props.smsTypes.map(smsType => ({
                      value: smsType.sms_type_dummy_id,
                      label: smsType.sms_type
                    }))
                    : []}
                  defaultValue={smsType}
                  change={e => setSmsType(e)}
                />
              </Grid>
              {
                props.isEmail ? (
                  <Grid item xs={10} md={7}>
                    <TextField
                      value={emailSubject || ''}
                      multiline
                      fullWidth
                      label='Email Subject'
                      onChange={(e) => setEmailSubject(e.target.value)} />
                  </Grid>
                ) : null
              }
              <Grid container style={{ marginTop: '15px' }}>
                <Grid item xs={10} md={7}>
                  {props.isEmail
                    ? (
                      <React.Fragment>
                        <TextField
                          value={message || ''}
                          onChange={(e) => setMessage(e.target.value)}
                          multiline
                          rows={10}
                          fullWidth
                          placeholder='Message'
                          label='Message'
                          variant='outlined'
                        />
                      </React.Fragment>
                    ) : (
                      <TextArea
                        value={message}
                        onChange={e => setMessage(e)} maxLength={640} />
                    )}
                </Grid>
                {
                  props.isEmail ? (
                    <Grid xs={10} md={7}>
                      <Grid container alignItems='center' spacing={2} justify='space-between'>
                        <Grid item xs={2} className={classes.wrapper}>
                          <IconButton
                            fontSize='large'
                            // component={AttachmentIcon}
                            className={classes.attachmentIcon}
                          >
                            <AttachmentIcon
                              fontSize='large'
                              className={classes.Attachment}
                            />
                            <input
                              type='file'
                              onChange={uploadFileHandler}
                              className={classes.fileInput} />
                          </IconButton>
                        </Grid>
                        <Grid item xs={8}>
                          {/* <Grid container alignItem='center' spacing={2}>
                            {files.map(file => (
                              <Grid item xs={12}>

                              </Grid>
                            ))}
                          </Grid> */}
                          {files.map((file, i) => (
                            <FileRow
                              file={file}
                              onClose={() => removeFileHandler(i)}
                              className={classes.fileRow}
                            />
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : null
                }
              </Grid>
            </Grid>
          </div>
      }
      <Grid container>
        <Grid item xs={6}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleNext}
            disabled={(activeStep === 1) && (!teachers.size && !students.size)}
          >
            {activeStep === steps.length - 1 ? (props.isEmail ? 'Send Email' : 'Send SMs') : 'Next'}
          </Button>
        </Grid>
      </Grid>
      {modal}
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  roles: state.roles.items,
  smsTypes: state.smsTypes.items
})

const mapDispatchToProps = dispatch => ({
  loadRoles: dispatch(apiActions.listRoles()),
  loadSmsTypes: () => dispatch(apiActions.listSmsTypes())
})

export default connect(mapStateToProps, mapDispatchToProps)(Sms)
