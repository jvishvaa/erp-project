
import React, { useState, useEffect } from 'react'

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  TableFooter,
  TablePagination
} from '@material-ui/core'
import {
  DeleteOutlineOutlined as DeleteIcon
} from '@material-ui/icons'

import axios from 'axios'
import { urls } from '../../../urls'
import {
  getSparseDate, TablePaginationAction
} from '../../../utils'
import { InternalPageStatus } from '../../../ui'

export default function ViewOrchadioList ({
  user,
  alert,
  date

}) {
  const [radioData, setRadioData] = useState([])
  // const [radioData, setRadioData] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [count, setCount] = useState(-1)
  const [loading, setLoading] = useState(true)

  const rowsPerPage = 10

  useEffect(() => {
  }, [alert, date, user])
  useEffect(() => {
    if (date) {
      setRadioData([])
      setLoading(true)
      setCurrentPage(0)
      fetchOrchadios(0)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, alert, user])
  const fetchOrchadios = (pageNumber) => {
    const [yyyy, mm, dd] = getSparseDate(date)
    axios.get(`${urls.OrchadioList}?date=${yyyy}-${mm}-${dd}&page_number=${pageNumber + 1}&page_size=${rowsPerPage}`, {
      headers: {
        'Authorization': `Bearer ${user}`
      }
    }).then(res => {
      // alert.success('Successfully Fetched')
      if (res.data && res.data.data) {
        setRadioData(res.data.data)
        setCount(res.data.count)
      }
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
      alert.warning('Something Went Wrong')
    })
  }

  const getTime = (date) => {
    const [yyyy, mm, dd, hh, mt] = getSparseDate(date)
    const month = mm.toString().padStart(2, 0)
    const dt = dd.toString().padStart(2, 0)
    const hour = hh.toString().padStart(2, 0)
    const minutes = mt.toString().padStart(2, 0)
    return `${dt}-${month}-${yyyy} ${hour}:${minutes}`
  }
  const deleteHandler = (id) => {
    axios.delete(`${urls.OrchadioDelete}?schedule_id=${id}`, {
      headers: {
        'Authorization': `Bearer ${user}`
      }
    }).then(res => {
      if (res.data) {
        if (res.data.success === 'true') {
          alert.success('Deleted Successfully')
          const newData = radioData.filter(item => item.schedule_id !== id)
          setRadioData(newData)
        } else {
          alert.warning('Failed To Delete')
        }
      }
    }).catch(err => {
      console.error(err)
      alert.warning('Failed To Delete')
    })
  }
  const pageChangeHandler = (event, page) => {
    setCurrentPage(page)
    setRadioData([])
    setLoading(true)
    fetchOrchadios(page)
  }
  const renderPrograms = () => {
    return (
      radioData.length
        ? <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>Program Name</TableCell>
              <TableCell>Program Time</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Duration (Minutes)</TableCell>
              <TableCell>Likes</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Program Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              radioData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{(currentPage * rowsPerPage) + (index + 1)}</TableCell>
                  <TableCell>{item.program_name}</TableCell>
                  <TableCell>{getTime(item.start_time)}</TableCell>
                  <TableCell>{item.program_made_by}</TableCell>
                  <TableCell>{item.duration / 60}</TableCell>
                  <TableCell>{item.total_program_likes}</TableCell>
                  <TableCell>{item.total_program_participants}</TableCell>
                  <TableCell style={{ textTransform: 'capitalize' }}>{item.program_for}</TableCell>
                  <TableCell>
                    <Tooltip title='Delete'>
                      <IconButton onClick={() => deleteHandler(item.schedule_id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                count={count}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onChangePage={pageChangeHandler}
                ActionsComponent={TablePaginationAction}
              />
            </TableRow>
          </TableFooter>
        </Table>
        : <InternalPageStatus label='No programs found for the selected date' loader={false} />
    )
  }

  return (
    <div>
      {
        loading
          ? <InternalPageStatus label={'Loading Orchadio Programs!'} />
          : renderPrograms()
      }
    </div>

  )
}
