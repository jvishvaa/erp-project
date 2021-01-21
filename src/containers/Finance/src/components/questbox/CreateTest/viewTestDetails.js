import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import { Typography, Grid, Button } from '@material-ui/core'
import moment from 'moment'
import axios from 'axios'
import { urls } from '../../../urls'
import { Toolbar } from '../../../ui'
import GSelect from '../../../_components/globalselector'
import { COMBINATIONS as config } from './configOnlineTest'

const ViewTest = (props) => {
  const [data, setData] = useState()
  const [totalPage, setTotalPage] = useState(1)
  const [itemCount, setItemCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [flag, setFlag] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [filterData, setFilterData] = useState()
  const id = props.match.params.id
  const userRole = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
  const actionAllowedRoles = ['Admin', 'Principal']
  const userPermission = (actionAllowedRoles.indexOf(userRole) >= 0)

  useEffect(() => {
    if (id) {
      setLoading(true)
      axios
        .get(urls.OnlintTstResult + '?onlinetest_id=' + id + '&page_number=1' + '&page_size=5', {
          headers: {
            Authorization: 'Bearer ' + props.user
          }
        }).then(res => {
          setData(res.data.data)
          setTotalPage(res.data.total_pages)
          setItemCount(res.data.total_items)
          setLoading(false)
          setCurrentPage(res.data.current_page - 1)
        }).catch(error => {
          console.log(error)
        })
    }
  }, [id, props.user])

  function fetchData (table) {
    if (flag) {
      let data = {
        onlinetest_id: id,
        page_number: table ? table.page + 1 : 1,
        page_size: table ? table.pageSize : 5
      }
      setPageSize(data.page_size)
      if (filterData) data = Object.assign(filterData, data)
      setLoading(true)
      axios
        .get(urls.OnlintTstResult, {
          params: data,
          headers: {
            Authorization: 'Bearer ' + props.user
          }
        }).then(res => {
          setData(res.data.data)
          setTotalPage(res.data.total_pages)
          setItemCount(res.data.total_items)
          setLoading(false)
          setCurrentPage(res.data.current_page - 1)
        }).catch(error => {
          console.log(error)
        })
    }
    setFlag(true)
  }

  function getFilterData (data) {
    setFilterData(data)
  }
  function resetTest (testId, userId, userName) {
    if (userPermission) {
      let confirm = window.confirm('confirm reset test taken by student: ' + userName)
      if (!confirm) { return }
      let payLoad = JSON.stringify({ 'onlinetest_id': testId, 'Status': 'Started' })
      let headers = {
        headers: {
          Authorization: 'Bearer ' + props.user,
          'Content-Type': 'application/json'
        }
      }
      let path = urls.OnlineTestInstance + '?user_id=' + userId
      axios.post(path, payLoad, headers)
        .then(res => {
          props.alert.success('Success')
          fetchData({ page: currentPage, pageSize })
        })
        .catch(e => {
          props.alert.error('Failed')
        })
    }
  }

  var tableColumns = [
    {
      Header: 'sr.no',
      Cell: row => {
        return (pageSize * currentPage + (row.index + 1))
      },
      width: 60
    },
    {
      Header: 'Student Name',
      id: 'student',
      accessor: d => d.student_details[0].name
    },
    {
      Header: 'Branch',
      id: 'branch',
      accessor: d => d.student_details[0].branch.branch_name
    },
    {
      Header: 'Grade',
      id: 'grade',
      accessor: d => d.student_details[0].grade.grade
    },
    {
      Header: 'Section',
      id: 'section',
      accessor: d => d.student_details[0].section.section_name,
      width: 100
    },
    {
      Header: 'Status',
      id: 'status',
      accessor: d => d.instance_details.status === 'C' ? 'Completed' : d.instance_details.status === 'S' ? 'Started' : 'Not Started',
      width: 100
    },
    {
      Header: () => <p>Total<br />Marks</p>,
      id: 'total',
      accessor: d => d.instance_details.max_score,
      width: 80
    },
    {
      Header: () => <p>Marks<br />Obtained</p>,
      id: 'score',
      accessor: d => d.instance_details.total_score,
      width: 85
    },
    {
      Header: 'Test Taken',
      id: 'date',
      accessor: d => moment(d.instance_details.test_start).format('MMM Do YY, h:mm:ss a')
    }]
  const actionObj = {
    Header: 'Action',
    id: 'action',
    accessor: d => {
      let status = d.instance_details.status === 'C' ? 'Completed'
        : d.instance_details.status === 'S' ? 'Started' : 'Not Started'
      let isSatusNotC = status !== 'Completed'
      let btnProps = { size: 'small', color: 'primary', disabled: isSatusNotC }
      return (
        <div>
          <Button onClick={e => props.history.push(`/questbox/handleTest/${id}/${d.user_id}`)}{...btnProps}>re-view</Button>
          <Button {...btnProps} onClick={e => resetTest(id, d.user_id, d.student_details[0].name)}>reset</Button>
        </div>
      )
    }
  }

  return (
    <React.Fragment>
      <Toolbar>
        <Grid container>
          <Grid style={{ marginLeft: 4 }} item>
            <GSelect variant={'filter'} onChange={e => getFilterData(e)} config={config} />
          </Grid>
          <Grid item>
            <Button variant='contained' style={{ marginTop: 16 }} onClick={() => fetchData()}>
              Get Result
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
      {data && data.length > 0
        ? <ReactTable
          columns={userPermission ? [...tableColumns, actionObj] : tableColumns}
          manual
          data={data}
          pages={totalPage}
          page={currentPage}
          showPageSizeOptions={itemCount > 5}
          defaultPageSize={data.length}
          showPagination={totalPage > 1}
          loading={loading}
          onFetchData={fetchData}
        />
        : <Typography> No data available </Typography>
      }
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default (connect(mapStateToProps)(withRouter(ViewTest)))
