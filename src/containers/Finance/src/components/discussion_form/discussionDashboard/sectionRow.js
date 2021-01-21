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
  // TableBody
} from '@material-ui/core'
import axios from 'axios'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import styles from './discussionDashboard.style'
import StudentRow from './studentRow'
import Loader from '../loader'
import { discussionUrls } from '../../../urls'

const SectionRow = ({ classes, rowId, sectionDate, branchName, studentCount }) => {
  const [auth] = useState(JSON.parse(localStorage.getItem('user_profile')))
  const [open, setOpen] = React.useState(false)
  const [finelData, setFinalData] = useState('')
  const [loading, setloading] = useState(false)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

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
    if (auth && sectionDate.acad_map_id && open === true) {
      setloading(true)
      const api = studentCount ? `${discussionUrls.discussionDashboardWithStudentCountApi}?acad_grade_map_id=${sectionDate.acad_map_id}` : `${discussionUrls.discussionDashboardApi}?acad_grade_map_id=${sectionDate.acad_map_id}`
      axios
        .get(api, {
          headers: {
            Authorization: 'Bearer ' + auth.personal_info.token
          }
        })
        .then(res => {
          if (res.status === 200) {
            setFinalData(res.data)
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
  }, [auth, open, sectionDate.acad_map_id, studentCount])

  return (
    <>
      <TableRow onClick={() => setOpen(!open)} className={classes.postpaper}>
        <TableCell float='left'>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell float='left'>{rowId}</TableCell>
        <TableCell float='left'>{sectionDate.grade_name}</TableCell>
        {studentCount && <TableCell float='left'>{sectionDate.total_student}</TableCell>}
        <TableCell float='left'>{sectionDate.total_24_hour_count}</TableCell>
        <TableCell float='left'>{sectionDate.total_7_day_count}</TableCell>
        <TableCell float='left'>{sectionDate.total_post}</TableCell>
        {studentCount && <TableCell float='left'>{sectionDate.user_involve}</TableCell>}
        {!studentCount && <TableCell float='left'>{sectionDate.delete_post}</TableCell> }
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            {finelData && finelData.length === 0 &&
            <Typography variant='h4' style={{ color: 'blue', margin: '10px', textAlign: 'center' }}>Sections Not Found</Typography>
            }
            {finelData && finelData.length !== 0 &&
              <Box border={1} style={{ paddingBottom: 10, paddingTop: 10, margin: '10px', borderColor: 'lightgray' }} className={classes.paper2}>
                <Typography variant='h6' gutterBottom component='div'>
                  {branchName} &gt; {sectionDate.grade_name} &gt;  Sections
                </Typography>
                <Table size='small' aria-label='purchases'>
                  <TableHead>
                    <TableRow>
                      {!studentCount && <TableCell float='left'>Action</TableCell>}
                      <TableCell float='left'>S.No</TableCell>
                      <TableCell float='left'>Section</TableCell>
                      {studentCount && <TableCell float='left'> No of Students </TableCell>}
                      <TableCell float='left'>Total posts in 24 hours</TableCell>
                      <TableCell float='left'>Total post in 7 days</TableCell>
                      <TableCell float='left'>Overall total Post count</TableCell>
                      {studentCount && <TableCell float='left'> Percentage Interaction </TableCell>}
                      {!studentCount && <TableCell float='left'>Total posts deleted</TableCell> }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {finelData && finelData.length !== 0 && finelData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                      <StudentRow rowId={index + 1} studentData={item} branchName={branchName} gradeName={sectionDate.grade_name} studentCount={studentCount} />
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={finelData.length}
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

export default withStyles(styles)(SectionRow)
