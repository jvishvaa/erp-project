import React, { useState, useEffect } from 'react'
import {
  withStyles,
  TableCell,
  TableRow,
  IconButton,
  Table,
  Box,
  Collapse,
  Typography,
  TableHead,
  TableBody,
  TablePagination
} from '@material-ui/core'
import axios from 'axios'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import styles from './discussionDashboard.style'
import SectionRow from './sectionRow'
import { discussionUrls } from '../../../urls'
import Loader from '../loader'

const GradeRow = ({ classes, rowId, Branchdata, studentCount }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [open, setOpen] = React.useState(false)
  const [gradeData, setGradeData] = useState('')
  const [loading, setloading] = useState(false)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  useEffect(() => {
    setOpen(false)
  }, [studentCount])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  let loader = null
  if (loading) {
    loader = <Loader open />
  }

  useEffect(() => {
    if (auth && Branchdata.branch && open === true) {
      setloading(true)
      const api = studentCount ? `${discussionUrls.discussionDashboardWithStudentCountApi}?branch_id=${Branchdata.branch}` : `${discussionUrls.discussionDashboardApi}?branch_id=${Branchdata.branch}`
      axios
        .get(api, {
          headers: {
            Authorization: 'Bearer ' + auth.personal_info.token
          }
        })
        .then(res => {
          if (res.status === 200) {
            setGradeData(res.data)
            setloading(false)
          } else {
            console.log('error')
            setloading(false)
          }
        })
        .catch(error => {
          console.log(error)
          setloading(false)
        })
    }
  }, [Branchdata.branch, auth, open, studentCount])

  return (
    <>
      <TableRow onClick={() => setOpen(!open)} className={classes.postpaper}>
        <TableCell float='left'>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell float='left'>{rowId}</TableCell>
        <TableCell float='left'>{Branchdata.branch_name}</TableCell>
        {studentCount && <TableCell float='left'>{Branchdata.total_student}</TableCell>}
        <TableCell float='left'>{Branchdata.total_24_hour_count}</TableCell>
        <TableCell float='left'>{Branchdata.total_7_day_count}</TableCell>
        <TableCell float='left'>{Branchdata.total_post}</TableCell>
        {studentCount && <TableCell float='left'>{Branchdata.user_involve}</TableCell>}
        {!studentCount && <TableCell float='left'>{Branchdata.delete_post}</TableCell>}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            {gradeData && gradeData.length === 0 &&
            <Typography variant='h4' style={{ color: 'blue', margin: '10px', textAlign: 'center' }}>Grades Not Found</Typography>
            }
            {gradeData && gradeData.length !== 0 &&
            <Box border={1} style={{ paddingBottom: 10, paddingTop: 10, margin: '10px', borderColor: 'lightgray' }} className={classes.paper1}>
              <Typography variant='h6' gutterBottom component='div'>
                {Branchdata.branch_name} &gt; Grades
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell float='left'>Action</TableCell>
                    <TableCell float='left'>S.No</TableCell>
                    <TableCell float='left'>Grade</TableCell>
                    {studentCount && <TableCell float='left'> No of Students </TableCell>}
                    <TableCell float='left'>Total posts in 24 hours</TableCell>
                    <TableCell float='left'>Total post in 7 days</TableCell>
                    <TableCell float='left'>Overall total Post count</TableCell>
                    {studentCount && <TableCell float='left'> Percentage Interaction </TableCell>}
                    {!studentCount && <TableCell float='left'>Total posts deleted</TableCell> }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gradeData && gradeData.length !== 0 && gradeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => (
                    <SectionRow branchName={Branchdata.branch_name} key={index + 1} rowId={index + 1} sectionDate={data} studentCount={studentCount} />
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={gradeData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Box>}
          </Collapse>
        </TableCell>
      </TableRow>
      {loader}
    </>
  )
}

export default withStyles(styles)(GradeRow)
