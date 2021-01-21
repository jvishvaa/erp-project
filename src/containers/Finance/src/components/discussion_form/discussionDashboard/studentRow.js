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
import Loader from '../loader'
import { discussionUrls } from '../../../urls'

const StudentRow = ({ classes, rowId, studentData, branchName, gradeName, studentCount }) => {
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
    if (auth && studentData.sec_map_id && open === true) {
      setloading(true)
      const api = studentCount ? `${discussionUrls.discussionDashboardWithStudentCountApi}?sec_map_id=${studentData.sec_map_id}` : `${discussionUrls.discussionDashboardApi}?sec_map_id=${studentData.sec_map_id}`
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
  }, [auth, open, studentCount, studentData.sec_map_id])

  return (
    <>
      <TableRow onClick={() => !studentCount && setOpen(!open)} className={classes.postpaper}>
        {!studentCount && <TableCell float='left'>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>}
        <TableCell float='left'>{rowId}</TableCell>
        <TableCell float='left'>{studentData.section_name}</TableCell>
        {studentCount && <TableCell float='left'>{studentData.total_student}</TableCell>}
        <TableCell float='left'>{studentData.total_24_hour_count}</TableCell>
        <TableCell float='left'>{studentData.total_7_day_count}</TableCell>
        <TableCell float='left'>{studentData.total_post}</TableCell>
        {studentCount && <TableCell float='left'>{studentData.user_involve}</TableCell>}
        {!studentCount && <TableCell float='left'>{studentData.delete_post}</TableCell>}
      </TableRow>
      {!studentCount && <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            {finelData && finelData.length === 0 &&
            <Typography variant='h4' style={{ color: 'blue', margin: '10px', textAlign: 'center' }}>Students are not found</Typography>
            }
            {finelData && finelData.length !== 0 &&
              <Box border={1} style={{ paddingBottom: 10, paddingTop: 10, margin: '10px', borderColor: 'lightgray' }} className={classes.paper3}>
                <Typography variant='h6' gutterBottom component='div'>
                  {branchName} &gt; {gradeName} &gt; {studentData.section_name} &gt; Student List
                </Typography>
                <Table size='small' aria-label='purchases'>
                  <TableHead>
                    <TableRow>
                      <TableCell float='left'>S.No</TableCell>
                      <TableCell float='left'>Name</TableCell>
                      <TableCell float='left'>Role</TableCell>
                      <TableCell float='left'>Total posts in 24 hours</TableCell>
                      <TableCell float='left'>Total post in 7 days</TableCell>
                      <TableCell float='left'>Overall total Post count</TableCell>
                      {!studentCount && <TableCell float='left'>Total posts deleted</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {finelData && finelData.length !== 0 && finelData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                      <TableRow className={classes.postpaper}>
                        <TableCell float='left'>{index + 1}</TableCell>
                        <TableCell float='left'>{item.name}</TableCell>
                        <TableCell float='left'>{item.role}</TableCell>
                        <TableCell float='left'>{item.total_24_hour_count}</TableCell>
                        <TableCell float='left'>{item.total_7_day_count}</TableCell>
                        <TableCell float='left'>{item.total_post}</TableCell>
                        {!studentCount && <TableCell float='left'>{item.delete_post}</TableCell>}
                      </TableRow>
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
      </TableRow>}
      {loader}
    </>
  )
}

export default withStyles(styles)(StudentRow)
