/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { urls } from '../../../urls'

import LockdownCards from '../cardTypes.js/cardStyle'
import { Pagination } from '../../../ui'

const dummyData = [
  {

    student_id: 1,
    name: 'Rahul',
    section_name: 'Section A',
    grade_name: 'Grade 1'
  },
  {
    student_id: 2,
    name: 'Rahul',
    section_name: 'Section A',
    grade_name: 'Grade 1'
  }

]
export default function ViewLockDownJournals (props) {
  console.log(props, dummyData)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    getJournals()
  }, [])

  const getJournals = () => {
    setLoading(true)
    // axios.get(urls.LockDownJournals, {
    //   headers: {
    //     Authorization: 'Bearer ' + localStorage.getItem('id_token'),
    //     'Content-Type': 'multipart/formData'
    //   }.then(res => {
    //     setData(res.data.students)
    //     setLoading(false)
    //     setTotalPages(res.data.no_of_pages)
    //     setCurrentPage(res.data.currentPage)
    //   }).catch(err => {
    //     setLoading(false)
    //    props.alert.error('Something went wrong,Reload the page)
    //     console.log(err)
    //   })

    // })
  }

  const handlePagination = (page) => {
    console.log('page')
    setCurrentPage(page)
    setLoading(true)
    getJournals()
  }
  return (

    <React.Fragment>

      <LockdownCards loadingStatus={loading} listOfJournals={dummyData} />
      {
        dummyData && dummyData.length >= 1
          ? <Pagination
            className='Lockdown Journals'
            rowsPerPageOptions={[]}
            labelRowsPerPage={'Lockdown Journals Per Page'}
            page={currentPage - 1}
            rowsPerPage={12}
            count={(totalPages * 12)}
            onChangePage={(e, i) => {
              handlePagination(i + 1)
            }}

          /> : ''
      }
    </React.Fragment>
  )
}
