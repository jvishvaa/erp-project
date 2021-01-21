/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table'
import axios from 'axios'
import { Checkbox, SwipeableDrawer, Button, Table, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core'
import { connect } from 'react-redux'

// import axios from 'axios'
// import { apiActions } from '../../../_actions'
import { qBUrls } from '../../../urls'

const AssignStudents = (props) => {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(undefined)
  const [pageSize, setPageSize] = useState(10)
  const [students, setStudents] = useState([])
  const [drawer, setDrawer] = useState(false)
  const [unSelectedStudents, setUnSelectedStudents] = useState(new Set())
  const [unSelectedStudentsIds, setUnSelectedStudentsIds] = useState(props.selections.ids || new Set())
  const [unSelectedStudentsData, setUnSelectedStudentsData] = useState(props.selections.objects || [])
  const [selectrData] = useState(props.selectorData)

  // useEffect(() => {
  //   setUnSelectedStudentsIds(props.selections.ids)
  // }, [props.selections.ids])

  useEffect(() => {
    fetchStudent()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const fetchStudent = () => {
    let { branch_id: branchId, acad_branch_grade_mapping_id: gradeMapId, section_mapping_id: sectionMapId } = props.selectorData || {}
    var value = ''
    var paramsname = ''
    let formdata = new FormData()
    if (branchId && !gradeMapId && !sectionMapId) {
      formdata.append('branch_id', branchId)
    } else if (gradeMapId && branchId && !sectionMapId) {
      formdata.append('mapping_acad_grade', gradeMapId)
    } else if (sectionMapId && gradeMapId && branchId) {
      formdata.append('section_mapping', sectionMapId)
    } else if (sectionMapId) {
      formdata.append('section_mapping', sectionMapId)
    }

    formdata.append('page_number', page + 1)
    formdata.append('page_size', pageSize)

    axios.post(`${qBUrls.StudnetFilter}`, formdata, {
      headers: {
        Authorization: 'Bearer ' + props.user,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      let { data = [], page_size: pageSize, total_pages: totalPages } = res.data
      const ids = unSelectedStudentsData.map(student => {
        return student.id
      })
      const finalData = data.map(e => {
        return { ...e, checked: !ids.includes(e.id) }
      })
      setLoading(false)
      setPageSize(pageSize)
      setTotalPages(totalPages)
      setStudents(finalData)
    }).catch(err => {
      setLoading(false)
      logError(err)
    })
  }

  const logError = (err) => {
    let { message = 'Failed to connect to server', response: { data: { status: messageFromDev } = {} } = {} } = err || {}
    if (messageFromDev) {
      props.alert.error(`${messageFromDev}`)
    } else if (message) {
      props.alert.error(`${message}`)
    } else {
      console.log('Failed', err)
    }
  }

  const toggleDrawer = (open) => event => {
    setDrawer(open)
  }

  useEffect(() => {
    props.getStudentIds({ ids: unSelectedStudentsIds, objects: unSelectedStudentsData, erps: unSelectedStudents })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStudents, students])

  const handleCheckbox = (checked, studentData) => {
    if ((checked && unSelectedStudents.has(studentData.erp))) {
      unSelectedStudents.delete(studentData.erp)
      unSelectedStudentsIds.delete(studentData.id)
      const std = unSelectedStudentsData.filter(student => {
        return student.erp !== studentData.erp
      })
      setUnSelectedStudentsData([...std])
    } else {
      setUnSelectedStudents(unSelectedStudents.add(studentData.erp))
      setUnSelectedStudentsIds(unSelectedStudentsIds.add(studentData.id))
    }
    const filteredStudents = students.map(student => {
      if (studentData.erp === student.erp) {
        return { ...student, checked: checked }
      } else {
        return student
      }
    })
    setStudents(filteredStudents)
    if (checked) {
      const unSelectedStudentsDataCopy = unSelectedStudentsData
      var removeIndex = unSelectedStudentsDataCopy.map(function (item) { return item.erp }).indexOf(studentData.erp)
      unSelectedStudentsDataCopy.splice(removeIndex, 1)
      setUnSelectedStudentsData(unSelectedStudentsDataCopy)
    } else {
      setUnSelectedStudentsData([...unSelectedStudentsData, studentData])
    }
    // if (!checked) {
    // }
  }

  const getUniqueObjects = (array, key) => {
    const unique = array.map(elem => elem[key])
    let uniqueObjectKeys = unique.map((elem, index, final) => {
      return final.indexOf(elem) === index && index
    })

    let uniqueObjects = uniqueObjectKeys.filter(elem => array[elem]).map(elem => array[elem])
    return uniqueObjects
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      const setCheck = students.map(student => {
        handleCheckbox(checked, student, true)
        return { ...student, checked: true }
      })
      setStudents(setCheck)

      let studentIds = [...new Set(students.map(item => item.erp))]
      const unSelectedStudents = unSelectedStudentsData.filter(item => !studentIds.includes(item.erp))
      setUnSelectedStudentsData([...unSelectedStudents])
    } else {
      const setUnCheck = students.map(student => {
        handleCheckbox(checked, student)
        return { ...student, checked: false }
      })
      setStudents(setUnCheck)
      setUnSelectedStudentsData([...unSelectedStudentsData, ...students])
    }
  }

  const columns = [
    {
      Header: <div>
        <Checkbox
          checked={students.every(student => {
            return student.checked === true
          })}
          onChange={(event) => { handleSelectAll(event.target.checked) }}
        />
      </div>,
      width: 100,
      Cell: ({ original, index }) => {
        return <Checkbox
          checked={original.checked}
          onChange={(event) => { handleCheckbox(event.target.checked, original, index) }}
        />
      }
    },
    {
      Header: 'SL_NO',
      id: 'sln',
      width: 100,
      Cell: row => {
        return <div style={{ textAlign: 'center' }}>{(pageSize * page + (row.index + 1))}</div>
      }
    },
    {
      Header: 'ERP',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.erp}</div>
      }
    },
    {
      Header: 'Student Name',
      Cell: ({ original }) => {
        return <div style={{ textAlign: 'center' }}>{original.name}</div>
      }
    }
  ]

  const renderTableBody = () => {
    return (
      <TableBody>
        {getUniqueObjects(unSelectedStudentsData, 'erp').map(row => (
          <TableRow key={row.erp}>
            <TableCell align='center'>{row.erp}</TableCell>
            <TableCell align='center'>{row.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  }

  return (
    <div style={{ width: '700px', padding: 10 }}>
      <div style={{ position: 'relative', height: '40px' }}>
        <Button
          style={{ position: 'absolute', right: 0 }}
          variant='contained'
          color='primary'
          onClick={() => { setDrawer(!drawer) }}>
         View Unselected Students
        </Button>
      </div>
      <ReactTable
        manual
        showPageSizeOptions={false}
        data={students || []}
        columns={columns}
        page={page}
        pages={totalPages}
        onPageChange={(page) => {
          setPage(page)
          setLoading(true)
        }}
        defaultPageSize={pageSize}
        loading={loading}
      />
      <SwipeableDrawer
        style={{ width: '100px' }}
        anchor='right'
        open={drawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Table size='medium' style={{ width: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>ERP</TableCell>
              <TableCell align='center'>Student Name</TableCell>
            </TableRow>
          </TableHead>
          {renderTableBody()}
        </Table>
      </SwipeableDrawer>
    </div>
  )
}

const mapStateToProps = state => ({

  user: state.authentication.user

})

export default connect(mapStateToProps)(AssignStudents)
