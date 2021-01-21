import React, { useEffect, useState } from 'react'
import { Modal, Grid, Typography } from '@material-ui/core'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  paperContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh'
  },
  paper: {
    display: 'inline-flex',
    flexDirection: 'column',
    position: 'absolute',
    width: '70vw',
    height: '70vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5]
  }
}))

function StudentDetails (props) {
  const classes = useStyles()
  const [studentInfo, setStudentInfo] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    axios.get('http://localhost:8000/qbox/accounts/student/' + props.id, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        'Content-Type': 'multipart/formData'
      }
    }).then(res => {
      setLoading(false)
      setStudentInfo(res.data)
    }).catch(e => props.alert.error('Something went wrong.'))
  }, [props.id, props])
  return <Modal onClose={props.toggle} open={props.open}>
    <div className={classes.paperContainer}>
      <div className={classes.paper}>
        {loading ? 'Loading...' : <Grid direction='column' container>
          <Grid style={{ padding: 16 }} item>
            <Typography variant='h6'>{studentInfo[0] && studentInfo[0] && studentInfo[0].student.name }</Typography>
          </Grid>
          <Grid style={{ padding: 16 }} item>
            <Grid spacing={4} container>
              <Grid item>
                <Typography variant='subtitle1'>Aadhar Number :</Typography> {studentInfo[0] && studentInfo[0].student && studentInfo[0].student.aadhar_number}
              </Grid>
              <Grid item>
                <Typography variant='subtitle1'>Address :</Typography> {studentInfo[0] && studentInfo[0].student && studentInfo[0].student.address}
              </Grid>
              <Grid item>
                <Typography variant='subtitle1'>Admission Date : </Typography> {studentInfo[0] && studentInfo[0].student && studentInfo[0].student.admission_date}
              </Grid>
              <Grid item>
                <Typography variant='subtitle1'>ERP : </Typography> {studentInfo[0] && studentInfo[0].student && studentInfo[0].student.erp}
              </Grid>
            </Grid>
            <Grid spacing={4} container>
              <Grid item>
                <Typography variant='subtitle1'>Section : </Typography> {studentInfo[0] && studentInfo[0].student && studentInfo[0].student.section && studentInfo[0].student.section.section_name}
              </Grid>
              <Grid item>
                <Typography variant='subtitle1'>Admission Number : </Typography> {studentInfo[0] && studentInfo[0].student && studentInfo[0].student.admission_number}
              </Grid>
            </Grid>
          </Grid>
        </Grid>}
      </div>
    </div>
  </Modal>
}

export default StudentDetails
