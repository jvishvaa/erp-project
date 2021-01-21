import React, { Component, Fragment } from 'react'
import ReactTable from 'react-table'
import axios from 'axios'
import { connect } from 'react-redux'
// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
// import IconButton from '@material-ui/core/IconButton/IconButton'
// import DeleteIcon from '@material-ui/icons/DeleteOutlined'
import { Button } from '@material-ui/core'
// import { Toolbar } from '../../ui'
import { OmsSelect, Toolbar } from '../../ui'
import { urls } from '../../urls'

class CrashReport extends Component {
  constructor () {
    super()
    this.state = { loading: true }
    let token = localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + token } }
    // headers.headers['Content-Type'] = 'application/json'
  }
  state={ pages: -1 }
  getPath = (state) => {
    let { CRASHREPORT: path } = urls
    let { state: { queryUrl: qUrl, queryUserName: qUser, queryErrorMessage: qEM, queryContext: qC, queryReportedDatetime: qDate, userNamesListMap: usNamesMap = new Map() } } = this
    let queryParams = new Map([
      ['pageNumber', (state.page + 1)],
      ['pageSize', state.pageSize],
      ['url', qUrl],
      ['context', qC],
      ['errorMessage', qEM],
      ['userId', usNamesMap.get(qUser) || null],
      ['reported_datetime', qDate ? qDate.split('T')[0] : null]
    ])
    path += '?'
    queryParams.forEach((val, key) => {
      if (val) { path += key + '=' + val + '&' }
    })
    this.setState({ page: state.page, pageSize: state.pageSize })
    return path
  }
  fetchData = (state, instance) => {
    let { headers, getPath: gP, userNamesMap: uSP } = this
    let path = gP(state)
    this.setState({ loading: true })
    axios.get(path, headers)
      .then(r => {
        console.log(r, 'result')
        console.log(r.data.report_data, 'report dataaa')
        this.setState({
          apiRes: { ...r.data, report_data: 'look in state.reportData' },
          reportData: r.data.report_data,
          pages: r.data.total_pages,
          loading: false
        },
        () => { setTimeout(uSP, 0) }
        )
      })
      .catch(e => this.setState({ reportData: undefined }))
  }
  snakeToCamel = text => {
    let cameCase = ''
    let textArr = text.split('_')
    if (textArr.length) {
      textArr.forEach((word, index) => {
        // cameCase += index ? word[0].toUpperCase() + word.substr(1) : word
        cameCase += word[0].toUpperCase() + word.substr(1)
      })
    } else { cameCase = text }
    return 'query' + cameCase
  }
  userNamesMap = () => {
    let { state: { reportData: rD = [] } } = this
    let userNamesListMap = new Map()
    rD.forEach(item => {
      userNamesListMap.set(item.user_name, item.user)
    })
    this.setState({ userNamesListMap })
  }
  subComponent = ({ original, row }) => {
    let userId = Number(original.user) || null
    return (
      <div style={{ backgroundColor: 'rgb(239,239,239)', padding: '20px', fontSize: '18px' }}>
        {[...Object.keys(original)].map(item => {
          let obj = { ...original }
          if (typeof (obj[item]) === 'string') {
            return (
              <p style={{ whiteSpace: 'pre-line' }}key={item}> <b>{item} : </b> {obj[item]}
                &nbsp;&nbsp;
                <Button
                  variant='outlined'
                  color='secondary'
                  size='small'
                  onClick={e => {
                    let queryKey = this.snakeToCamel(item)
                    this.setState({ [queryKey]: obj[item] })
                  }}
                >
                  Filter by this {item}
                </Button>
              </p>
            )
          }
        })}
        {
          userId
            ? <Button
              variant='outlined'
              color='primary'
              onClick={e => { this.switchUser(original.user, original.url) }}
            >
            Log in as {original.user_name}
            </Button>
            : null
        }
      </div>
    )
  }
  switchUser = (userId, errorURL) => {
    let { headers } = this
    axios.post(urls.LOGIN, { user_id: userId }, headers).then(res => {
      localStorage.setItem('user_profile', JSON.stringify(res.data))
      localStorage.setItem('id_token', res.data.personal_info.token)
      window.location.replace(errorURL)
    })
  }
  filter=() => {
    let { state: { queryUrl: qUrl, queryUserName: qUser, queryErrorMessage: qEM, queryContext: qC, queryReportedDatetime: qDate } } = this
    if (!qUrl && !qUser && !qEM && !qC && !qDate) { return null }
    return (
      <div>
        <p><b>Filter</b></p>
        <ul>
          {qUser ? <li><b>User : </b>{qUser}</li> : null}
          { qUrl ? <li><b>URL : </b>{qUrl}</li> : null}
          { qDate ? <li><b>Date : </b>{qDate.split('T')[0]}</li> : null}
          { qEM ? <li><b>Message : </b>{qEM.substr(0, 100) + '...'}</li> : null}
          { qC ? <li><b>context : </b>{qC.substr(0, 100) + '...'}</li> : null}
        </ul>
        <Button
          variant='outlined'
          color='primary'
          onClick={e => this.setState({ queryUrl: null, queryUserName: null, queryErrorMessage: null, queryContext: null, queryReportedDatetime: null }, () => { this.fetchData(this.state) })}
        >
            Clear
        </Button>
        <Button
          variant='outlined'
          color='primary'
          onClick={e => { this.fetchData(this.state) }}
        >
            Apply Filter
        </Button>
      </div>
    )
  }
  deleteHandler = (event, value, id) => {
    console.log(event, 'deleted')
    console.log(value, 'value')
    console.log(id, 'props id...')
    console.log(this.state.reportData)
  }

  handleStatusChange = (event, value, id) => {
    let _this = this
    axios({
      method: 'put',
      url: urls.BrowserErrorMessage + id,
      data: { error_status: event['value'] },
      headers: { Authorization: 'Bearer ' + this.props.user }
    })
      .then(res => {
        if (res.data.error_status === 'Resolved') {
          _this.setState(() => {
            let newReportData = _this.state.reportData.filter(item => item.id !== id)
            return {
              reportData: newReportData
            }
          })
        } else {
          _this.setState(() => {
            let itemIndex = _this.state.reportData.findIndex(item => item.id === id)
            let newReportData = _this.state.reportData
            newReportData[itemIndex] = res.data
            return {
              reportData: newReportData
            }
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  getSections () {
    const sectionsArr = []
    this.state.sectionData.map(section => {
      if (this.state.valueSection.label !== section.section.section_name) {
        sectionsArr.push({
          value: section.id,
          label: section.section.section_name
        })
      } else {
        return []
      }
    })
    return sectionsArr
  }

  render () {
    // const classes = (this.props)
    let { state: { reportData: rD = [], loading, pages, expandedRows = {} }, fetchData: fD, subComponent: subComp, filter } = this
    return (
      <Fragment>
        <Toolbar>
          {filter()}
        </Toolbar>
        <ReactTable
          manual
          className='-highlight'
          columns={[
            {
              Header: 'sr.no',
              Cell: row => {
                let { page, pageSize } = this.state
                return (pageSize * page + (row.index + 1))
              },
              width: 60
            },
            {
              Header: 'Error ID',
              accessor: 'id',
              width: 80
            },
            {
              Header: 'url',
              accessor: 'url'
            },
            {
              id: 'error message',
              Header: 'message',
              accessor: props => {
                let eMessage = props.error_message
                let message = eMessage.split(':')
                message = message[0].length < 50 ? message[0] : eMessage.substr(0, 40) + '...'
                return message
              }
            },
            {
              Header: 'user name',
              accessor: 'user_name'
            },
            {
              id: 'datetime',
              Header: 'reported at',
              accessor: props => (<span>Date: {props.reported_datetime.split('T')[0]}&nbsp;&nbsp;<span style={{ color: 'purple' }}>time: {props.reported_datetime.split('T')[1]}</span></span>)
            },
            {
              id: 'status',
              Header: 'Status',
              minWidth: 150,
              className: 'col-shuffle',
              accessor: (props) => {
                console.log(props)
                return (
                  <div>
                    <OmsSelect
                      label={'Status'}
                      defaultValue={{ value: props.error_status, label: props.error_status }}
                      options={[
                        { value: 'Resolved', label: 'Resolved' },
                        { value: 'Doing', label: 'Doing' },
                        { value: 'Checked', label: 'Checked' },
                        { value: 'Invalid', label: 'Invalid' }
                      ]}
                      change={(event, value) => this.handleStatusChange(event, value, props.id)}
                    />
                  </div>
                )
              }
            }

          ]}

          SubComponent={subComp}
          expanded={expandedRows}
          onExpandedChange={(expanded, activeItem) => {
            this.setState({ expandedRows: { [activeItem[0]]: expanded[activeItem[0]] } })
          }}
          showPageSizeOptions
          loading={loading}
          pages={pages}
          sortable={false}
          defaultPageSize={5}
          data={rD || []}
          onFetchData={fD}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(mapStateToProps)(CrashReport)
