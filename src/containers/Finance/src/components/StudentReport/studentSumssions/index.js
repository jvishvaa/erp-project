import React, { useState, useEffect } from 'react'
import {
  Grid,
  TextField,
  makeStyles,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination
} from '@material-ui/core'
import axios from 'axios'
import { useSelector } from 'react-redux'

import styles from './studentSubmission.styles'
import { urls } from '../../../urls'
import { TablePaginationAction } from '../../../utils'
import { Modal } from '../../../ui'

const useStyles = makeStyles(styles)

function currentDate () {
  let d = new Date()
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  let year = d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }

  return [year, month, day].join('-')
}

const StudentSubmissions = ({
  alert
}) => {
  const [toDate, setToDate] = useState(() => currentDate())
  const [fromDate, setFromDate] = useState(() => currentDate())
  const [page, setPage] = useState(0)
  const [homeworkData, setHomeworkData] = useState(null)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [audioModalOpen, setAudioModalOpen] = useState(false)
  const [source, setSource] = useState(null)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalDataCount, setTotalDataCount] = useState(0)

  const user = useSelector(state => state.authentication.user)
  const classes = useStyles()

  useEffect(() => {
    if (toDate && fromDate) {
      axios.get(`${urls.HomeWorkSubmission}?from_date=${fromDate}&to_date=${toDate}&page_no=${page + 1}&page_size=${rowsPerPage}`, {
        headers: {
          Authorization: 'Bearer ' + user
        }
      }).then(res => {
        setHomeworkData(res.data)
        res.data && res.data.total_count && setTotalDataCount(res.data.total_count)
      }).catch(err => {
        console.error(err)
        alert.error('Something Went Wrong')
      })
    }
  }, [toDate, fromDate, user, alert, page, rowsPerPage])

  const toDateHandler = (e) => {
    if (fromDate > e.target.value) {
      alert.warning('To Date should not be less than From Date')
      return
    }
    setToDate(e.target.value)
  }

  const fromDateHandler = (e) => {
    if (toDate < e.target.value) {
      alert.warning('From Date should not be Greater than To Date')
      return
    }
    setFromDate(e.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
    !rowsPerPage && setRowsPerPage(10)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const imageClickHandler = (imgUrl, type) => {
    // window.open(imgUrl, 'Image')
    axios.get(imgUrl, {
      responseType: 'blob'
    }).then(res => {
      const url = type === 'correction' ? imgUrl : window.URL.createObjectURL(res.data)
      window.open(url, 'Image')
    }).catch(err => {
      console.error(err)
      alert.warning('Failed To Get Image')
    })
  }

  const getHomeworkdetails = (teacherReport, onlineClass) => {
    if (teacherReport && teacherReport.homework) {
      return teacherReport.homework
    } else if (onlineClass && onlineClass.title) {
      return `${onlineClass.title} - Online class`
    }
    return ''
  }

  const getRowsData = (data) => {
    return data.map(row => (
      <TableRow key={row.homework_details.id}>
        <TableCell>
          {
            getHomeworkdetails(row.homework_details.teacher_report,
              row.homework_details.onlineclass)
          }
        </TableCell>
        <TableCell>{row.homework_details.submitted_at.split('T')[0]}</TableCell>
        <TableCell>
          {row.homework_details.submitted_at
            ? row.homework_details.corrected_at.split('T')[0]
            : ''
          }
        </TableCell>
        <TableCell>
          {row.homework_details &&
            row.homework_details.corrected_by &&
            row.homework_details.corrected_by.first_name}
        </TableCell>
        <TableCell>
          {row.homework_submission_correction_details.map(item => (
            <TableRow key={item.homework_submission_details.id}>
              <TableCell>
                {
                  item.homework_submission_details.submission_type.trim() === 'image' ? (
                    <span
                      onClick={() => imageClickHandler(item.homework_submission_details.submission, 'submission')}
                      className={classes.links}
                    >
                      Click To See Image
                    </span>
                  ) : (
                    <span
                      onClick={() => playClickHandler(item.homework_submission_details.submission_type.trim(),
                        item.homework_submission_details.submission)}
                      className={classes.links}
                    >
                      Click To Play <span style={{ textTransform: 'capitalize' }}>
                        {item.homework_submission_details.submission_type.trim()}
                      </span>
                    </span>
                  )
                }
              </TableCell>
              {
                item.homework_submission_details.submission_type.trim() === 'image' ? (
                  <TableCell>
                    {
                      item.homework_correction_details.corrected_submission ? (
                        <span
                          onClick={() => imageClickHandler(item.homework_correction_details.corrected_submission, 'correction')}
                          className={classes.links}
                        >
                          Click To See Result
                        </span>
                      ) : ' '
                    }
                  </TableCell>
                ) : (
                  <TableCell>
                    {item.homework_correction_details.review || ' ' }
                  </TableCell>

                )
              }
            </TableRow>
          ))}
        </TableCell>
        <TableCell>{row.homework_details.over_all_review}</TableCell>
      </TableRow>
    ))
  }

  const playClickHandler = (type, src) => {
    if (type === 'audio') {
      setAudioModalOpen(true)
    } else {
      setVideoModalOpen(true)
    }
    setSource(src)
  }

  let audioModal = null
  if (audioModalOpen) {
    audioModal = (
      <Modal
        open={audioModalOpen}
        click={() => setAudioModalOpen(false)}
        style={{ zIndex: '1500' }}
        small
      >
        <audio controls style={{ marginTop: '15px' }}>
          <source src={source} type='audio/ogg' />
          <source src={source} type='audio/mpeg' />
          <source src={source} type='audio/wav' />
          Your browser does not support the audio element.
        </audio>
      </Modal>
    )
  }

  let videoModal = null
  if (videoModalOpen) {
    videoModal = (
      <Modal
        open={videoModalOpen}
        click={() => setVideoModalOpen(false)}
        style={{ zIndex: '1500' }}
      >
        <video width='100%' height='100%' autoPlay controls style={{ marginTop: '15px' }}>
          <source src={source} type='video/mp4' />
          <source src={source} type='video/ogg' />
          <source src={source} type='video/webm' />
          Your browser does not support the video tag.
        </video>
      </Modal>
    )
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={12} md={4}>
          <TextField
            type='date'
            label='From Date'
            required
            value={fromDate}
            onChange={fromDateHandler}
            // variant='outlined'
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            type='date'
            label='To Date'
            required
            value={toDate}
            margin='normal'
            onChange={toDateHandler}
            // variant='outlined'
          />
        </Grid>
      </Grid>
      {homeworkData && homeworkData.data.length ? (
        <Paper className={classes.paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Homework</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell>Corrected At</TableCell>
                <TableCell>Corrected By</TableCell>
                <TableCell>
                  <TableRow>
                    <TableCell>Submission Link</TableCell>
                    <TableCell>Correction Link/Remarks</TableCell>
                  </TableRow>
                </TableCell>
                <TableCell>Overall Review</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getRowsData(homeworkData.data)}
            </TableBody>
            <TableFooter>
              <TableRow classes={{ root: classes.footerRow }}>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30, 40, 50]}
                  rowsPerPage={rowsPerPage || 10}
                  labelDisplayedRows={() => `${page + 1} of ${Math.ceil(+totalDataCount / (+rowsPerPage || 10))}`}
                  classes={{ root: classes.paginationRoot }}
                  colSpan={6}
                  count={totalDataCount}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'Rows per page' }
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationAction}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      ) : null}
      {audioModal}
      {videoModal}
    </div>
  )
}

export default StudentSubmissions
