import React, { Component, Fragment } from 'react'
import axios from 'axios'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// import { Button } from '@material-ui/core/'
import withStyles from '@material-ui/core/styles/withStyles'
// import Textsms from '@material-ui/icons/Textsms'
// import { Toolbar } from '../../ui'
import { urls } from '../../urls'
// import GSelect from '../../_components/globalselector'
// import { Combination } from './logConfig'

const columns = [
  {
    id: 'serialNumber',
    Header: 'Sr.no',
    accessor: props => props.id,
    Cell: (row) => { return (row.index + 1) }
  },
  {
    Header: 'Message',
    accessor: 'sms_content'
  },
  {
    id: 'type',
    Header: 'Type',
    accessor: props => props.communicate_type && props.communicate_type.sms_type
  },
  {
    id: 'totalcount',
    Header: 'Total Count',
    accessor: props => (props.student.length + props.parent.length + props.academic_staff.length + props.school_staff.length)
  },
  {
    Header: 'Sent',
    id: 'isSent',
    accessor: d => d.is_sent ? 'Yes' : 'No'
  }
]

const subComponentColumns = [
  {
    Header: 'Name',
    id: 'name',
    accessor: d => d.sent_to_user && (d.sent_to_user.first_name || d.sent_to_user.username)
  },
  {
    Header: 'Number',
    accessor: 'contact_number'
  },
  {
    Header: 'Sent By',
    id: 'sentBy',
    accessor: d => d.sent_by && (d.sent_by.first_name || d.sent_by.username)
  }
]

const styles = theme => ({
})

class SMSLog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pageNumber: 0,
      pageSize: 5,
      loading: false,
      reactTableFlag: false,
      smsRecipientData: {}
    }
    // this.getSMSLog = this.getSMSLog.bind(this)
    this.recipientFetchData = this.recipientFetchData.bind(this)
  }

  getSmsRecipient (smsid) {
    let { SMSEmailLog: path } = urls
    let { smsRecipientData } = this.state
    smsRecipientData[smsid].loading = true
    this.setState({ smsRecipientData })
    let params = {
      sms_id: smsid,
      page_number: smsRecipientData[smsid].page + 1,
      page_size: smsRecipientData[smsid].size
    }
    axios
      .get(path, {
        params: params,
        headers: { Authorization: 'Bearer ' + this.props.user }
      })
      .then(res => {
        smsRecipientData[smsid].data = res.data.sms_recipient_data
        smsRecipientData[smsid].totalRecipient = res.data.total_page_count
        smsRecipientData[smsid].loading = false
        this.setState({ smsRecipientData })
      })
      .catch(e => {
        console.log('error from sub component', e)
      })
  }

  recipientFetchData (state, id) {
    let { smsRecipientData } = this.state
    smsRecipientData[id].page = state.page
    smsRecipientData[id].size = state.pageSize
    this.setState({ smsRecipientData }, this.getSmsRecipient(id))
  }

  subComponent = ({ original, row }) => {
    let { smsRecipientData } = this.state
    if (!smsRecipientData[original.id]) {
      smsRecipientData[original.id] = {
        page: 0,
        size: 5,
        loading: false
      }
      this.setState({ smsRecipientData }, this.getSmsRecipient(original.id))
    }

    if (smsRecipientData && smsRecipientData[original.id] &&
      smsRecipientData[original.id].data && smsRecipientData[original.id].data.length > 0) {
      return (
        <ReactTable
          manual
          loading={smsRecipientData[original.id].loading}
          className='-highlight'
          data={smsRecipientData[original.id].data}
          defaultPageSize={smsRecipientData[original.id].data.length}
          showPagination
          columns={subComponentColumns}
          showPageSizeOptions
          page={smsRecipientData[original.id].page}
          pages={smsRecipientData[original.id].totalRecipient}
          onFetchData={state => this.recipientFetchData(state, original.id)}
        />
      )
    }
  }

  render () {
    let { state: { pageNumber, expanded }, subComponent } = this
    let { serverRes: { smsLR, totalPage }, loading, getSMSLog } = this.props
    return (
      <Fragment>
        {smsLR.length > 0 && <ReactTable
          manual
          id='smsReportTable'
          className='-highlight'
          defaultPageSize={5}
          loading={loading}
          data={smsLR}
          columns={columns}
          noDataText='No rows found'
          showPageSizeOptions
          page={pageNumber}
          pages={totalPage}
          onFetchData={state => this.setState({
            pageNumber: state.page,
            pageSize: state.pageSize }, () => getSMSLog(this.state.pageNumber, this.state.pageSize))}
          SubComponent={subComponent}
          expanded={expanded}
          onExpandedChange={expanded => this.setState({ expanded })}
        />}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDTProps = dispatch => ({
})

export default withStyles(styles)(connect(mapStateToProps, mapDTProps)(withRouter(SMSLog)))
