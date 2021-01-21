import React, { Component, Fragment } from 'react'
import axios from 'axios'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import { urls } from '../../urls'

const styles = theme => ({
  root: {
    display: 'flex'
  }
})

class SMSLogReport extends Component {
  constructor (props) {
    super(props)
    this.headers = { headers: { Authorization: 'Bearer ' + this.props.user } }
    this.state = {
      smsDetails: [],
      totalPages: 1,
      page: 0,
      defaultPageSize: 10,
      loading: true
    }
  }

  componentDidMount () {
    this.getSmsDetails()
  }

  getSmsDetails = () => {
    let { headers } = this
    axios
      .get(`${urls.SMSLOGReport}?page_number=${this.state.page + 1}&page_size=${this.state.defaultPageSize}&sms_type=Offline&sms_sub_type=&sms_id=`, headers)
      .then(res => { console.log(res); this.setState({ smsDetails: res.data.sms_recipient_data, totalPages: res.data.total_page_count, loading: false }) })
      .catch(er => { console.log(er); this.setState({ smsDetails: [], loading: false }) })
  }

  render () {
    let { smsDetails, totalPages, page, defaultPageSize, loading } = this.state
    const columns = [
      {
        id: 'serialNumber',
        Header: 'Sr.no',
        accessor: props => props.id,
        Cell: (row) => {
          let { page, defaultPageSize } = this.state
          return (defaultPageSize * page + (row.index + 1))
        }
      },
      {
        id: 'message',
        Header: 'Message',
        accessor: props => ((props.sms.sms_content || 'null'))
      },
      {
        id: 'Sentto',
        Header: 'Sent To',
        accessor: props => (props.contact_number)
      },
      {
        id: 'sentby',
        Header: 'Sent By',
        accessor: props => props.sent_by && (props.sent_by.first_name || props.sent_by.username)
      },
      {
        id: 'sent',
        Header: 'Sent',
        accessor: props => props.sms.is_sent ? 'Yes' : 'No'
      },
      {
        id: 'smscategory',
        Header: 'Category',
        accessor: props => props.sms.sms_type ? props.sms.sms_type.sms_sub_type : ''
      }
    ]
    return (
      <Fragment>
        <ReactTable
          manual
          id='smsReportTable'
          className='-highlight'
          defaultPageSize={defaultPageSize}
          data={smsDetails}
          columns={columns}
          noDataText='No rows found'
          showPageSizeOptions={false}
          loading={loading}
          page={page}
          pages={totalPages}
          onPageChange={(page) => {
            this.setState({ page: page, loading: true }, () => {
              this.getSmsDetails()
            })
          }}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

const mapDTProps = dispatch => ({
})

export default withStyles(styles)(connect(mapStateToProps, mapDTProps)(SMSLogReport))
