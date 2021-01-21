
import React, { useState, useEffect } from 'react'

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination

} from '@material-ui/core'

import axios from 'axios'
import { urls } from '../../../urls'
import {
  getSparseDate, TablePaginationAction
} from '../../../utils'
import '../listeners/orchadio_styles.css'
import { InternalPageStatus } from '../../../ui'

export default function ViewOrchidsListnersList ({
  user,
  alert,
  date

}) {
  const [radioData, setRadioData] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [count, setCount] = useState(-1)
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true)

  const rowsPerPage = 10

  useEffect(() => {
    if (date) {
      setCurrentPage(0)
      fetchOrchadiosListeners(0)
      setLoading(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, alert, user])

  const fetchOrchadiosListeners = (pageNumber) => {
    const [yyyy, mm, dd] = getSparseDate(date)
    axios.get(`${urls.OrchadioProgramListners}?date=${yyyy}-${mm}-${dd}&page_number=${pageNumber + 1}&page_size=${rowsPerPage}`, {
      headers: {
        'Authorization': `Bearer ${user}`
      }
    }).then(res => {
      alert.success('Successfully Fetched')
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
  const pageChangeHandler = (event, page) => {
    setCurrentPage(page)
    setRadioData([])
    setLoading(true)
    fetchOrchadiosListeners(page)
  }
  return (
    radioData.length
      ? <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.no</TableCell>
            <TableCell>Program Name</TableCell>
            <TableCell>Participants</TableCell>
            <TableCell>Duration (Minutes)</TableCell>
            <TableCell>Likes</TableCell>
            <TableCell>Listened above 0% of audio</TableCell>
            <TableCell>Listened to 30% of audio</TableCell>
            <TableCell>Listened upto 80%</TableCell>
            {/* <TableCell>Social Media Likes</TableCell>
          <TableCell>Social Media Views</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            radioData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className='orchadio__listeners--cell'>{(currentPage * rowsPerPage) + (index + 1)}</TableCell>

                {/* <TableCell className='orchadio__listeners--cell'>{index + 1}</TableCell> */}
                <TableCell className='orchadio__listeners--cell'>{item.program_name}</TableCell>
                <TableCell className='orchadio__listeners--cell'>{item.program_made_by}</TableCell>
                <TableCell className='orchadio__listeners--cell'>{item.program_duration / 60}</TableCell>
                <TableCell className='orchadio__listeners--cell'>{item.program_likes}</TableCell>
                <TableCell className='orchadio__listeners--cell'>{item.zero_percent}</TableCell>
                <TableCell className='orchadio__listeners--cell'>{item.thirty_percent}</TableCell>
                <TableCell className='orchadio__listeners--cell'>{item.program_views}</TableCell>
                {/* <TableCell className='orchadio__listeners--cell'>{item.social_media_likes}</TableCell>
              <TableCell className='orchadio__listeners--cell'>{item.social_media_views}</TableCell> */}

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
