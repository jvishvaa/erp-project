import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import { Grid } from 'semantic-ui-react'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import ReactTable from 'react-table'
// import { OmsSelect } from '../../ui'
import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import GSelect from '../../_components/globalselector'
import { COMBINATIONS } from './config/combinations'

// import { Icon } from '@material-ui/core'
// import { number } from 'prop-types';
// import TextArea from './textArea'

class AddSmsCredits extends Component {
  constructor () {
    super()
    this.state = {
      count: '',
      loading: true,
      Maxcount: [],
      countValue: '',
      datais: false,
      MaxValue: [],
      isValueEntered: false,
      currentPage: 1,
      totalPages: 0
    }
    this.userProfile = JSON.parse(localStorage.getItem('user_profile'))
    this.role = this.userProfile.personal_info.role
    this.textInput = React.createRef()
  }

  componentDidMount () {
    if (this.role === 'Admin') {
      axios.get(urls.BRANCHv2, {
        headers: {
          Authorization: 'Bearer ' + this.props.user
        }
      })
        .then(res => {
          console.log(res.data)
          this.setState({ allBranches: res.data }, () => {
            this.getSMSCount(this.getBranchIds().toString())
          })
        })
    }
  }

  getBranchIds = () => {
    let branches = this.state.allBranches.map((branch) => {
      return branch.branch_id
    })
    return branches
  }

  changehandlerbranch = (e) => {
    this.setState({ branch: e.value, branchValue: e.label })
    this.getSMSCount(e.value)
  }

 addSMSCount=() => {
   let{ branch, count } = this.state

   let payload = { branch_id: branch, max_sms_count: count }
   axios
     .post(urls.AddSMS, JSON.stringify(payload), {
       headers: {
         Authorization: 'Bearer ' + this.props.user,
         'Content-Type': 'application/json'
       }
     })

     .then(res => {
       console.log(res)
       this.props.alert.success(res.data)
       this.getSMSCount(this.getBranchIds().toString())
     })
     .catch(error => {
       console.log(error)
       this.props.alert.error(
         'No SMS added'
       )
     })
 }
 getSMSCount (branch) {
   //  this.setState({ loading: true })
   const { currentPage } = this.state
   axios
     .get(urls.AddSMS + `?branch_ids=${branch}&page_number=${currentPage}&page_size=${5}`, {
       headers: {
         Authorization: 'Bearer ' + this.props.user,
         'Content-Type': 'application/json'
       }
     })

     .then(res => {
       console.log(res)
       this.setState({ Maxcount: res.data.sms_branch_details, totalPages: res.data.page_details.total_pages, MaxValue: res.data, loading: false, selectedId: '', count: '' })
       console.log(this.state.Maxcount)
       console.log(this.state.MaxValue)
       console.log(this.state.MaxValue)
     })
     .catch(error => {
       console.log(error)
       this.setState({ loading: false })
       this.props.alert.error(
         'No data'
       )
     })
 }
 UpdateSMSCount=() => {
   let{ branch, count } = this.state

   let payload = { branch_id: branch, max_sms_count: count }
   axios
     .put(urls.AddSMS, JSON.stringify(payload), {
       headers: {
         Authorization: 'Bearer ' + this.props.user,
         'Content-Type': 'application/json'
       }
     })

     .then(res => {
       console.log(res)
       this.props.alert.success(res.data)
       this.getSMSCount(this.getBranchIds().toString())
     })
     .catch(error => {
       console.log(error)
       this.props.alert.error(
         'No data'
       )
     })
 }

 onChange = ({ branch_id: branchId }) => {
   console.log(branchId)
   if (branchId) {
     this.setState({ loading: true, branch: branchId * 1, currentPage: 1 }, () => {
       this.getSMSCount(branchId * 1)
     })
   }
 }

 handleInput = (e) => {
   if (e.target.value) {
     this.setState({ count: e.target.value, isValueEntered: true }, () => {
       this.textInput.focus()
     })
   } else {
     this.setState({ isValueEntered: false, count: '' })
   }
 }

 renderEditable (cellInfo) {
   const { count } = this.state
   return (
     <div style={{ paddingLeft: 50 }}>
       <input type='number' style={{ width: 80, border: '2px solid grey' }} value={count} onChange={this.handleInput} ref={(input) => { this.textInput = input }} />
     </div>
   )
 }

 handleSave = (branch, original) => {
   this.setState({ branch, loading: true }, () => {
     original.sms_details.length ? this.UpdateSMSCount() : this.addSMSCount()
   })
 }

 render () {
   let { Maxcount } = this.state
   //  let assessments = MaxcountMaxcount.page_details.total_pages || []
   const columns = [{
     Header: <p style={{ color: '#030303' }}>Branch</p>,
     Cell: ({ original }) => {
       const branches = this.state.allBranches
       return <p>{original.sms_details.length ? original.sms_details[0].branch_fk.branch_name : branches.map(branch => { return branch.branch_id === original.branch_id * 1 ? branch.branch_name : '' })}</p>
     } },
   {

     Header: <p style={{ color: '#030303' }}>Available SMS Credits</p>,
     Cell: ({ original }) => {
       return original.sms_details.length ? (<p style={{ textAlign: 'center', color: '#2C8026', fontWeight: 'bold' }}>{original.sms_details[0].max_sms_count - original.sms_details[0].sms_sent_count}</p>) : (<p style={{ textAlign: 'center' }}>0</p>)
     }

   },
   {
     Header: <p style={{ color: '#030303' }}>Used SMS Credits</p>,
     Cell: ({ original }) => {
       return <p style={{ textAlign: 'center', color: '#FC542F' }}>{original.sms_details.length ? original.sms_details[0].sms_sent_count : 0}</p>
     }
   }, {
     Header: <p style={{ color: '#030303' }}>Amount to be Added</p>,
     Cell: ({ original }) => {
       console.log(original)
       //  if (original.sms_details.length) {
       if (original.branch_id === this.state.selectedId) {
         return <p >{this.renderEditable(original)}</p>
       } else {
         return (
           <div style={{ paddingLeft: 50 }}>
             <input type='text' value='0' size='4' textAlign='center'
               readOnly />
           </div>
         )
       }
     } },
   {
     Header: <p style={{ color: '#030303' }}>Add SMS Credit</p>,
     Cell: ({ original }) => {
       const { isValueEntered, selectedId } = this.state
       if (isValueEntered && selectedId === original.branch_id) {
         return <Button variant='contained' style={{ color: '#005c99',
           marginLeft: '75px',
           marginBottom: '20px' }} onClick={() => { this.handleSave(original.branch_id, original) }}>Save</Button>
       } else {
         return this.role === 'Admin' ? <AddCircleIcon style={{ color: '#005c99', marginLeft: '95px' }}
           variant='contained' onClick={() => {
             this.setState({ selectedId: original.branch_id })
           }} /> : ''
       }
     }
   }]
   return (
     <React.Fragment>
       <Grid>
         <Grid.Row>
           <Grid.Column
             computer={5}
             mobile={16}
             tablet={4}
             className='student-section-inputField'
           >
             <GSelect variant={'selector'} config={COMBINATIONS} onChange={this.onChange} />
           </Grid.Column>
         </Grid.Row>
       </Grid>
       <Grid.Row style={{ padding: 20, zIndex: 0 }}>
         <ReactTable
           manual
           data={Maxcount || []}
           columns={columns}
           showPageSizeOptions
           loading={this.state.loading}
           //  pages={this.state.totalPages}
           pages={this.state.totalPages}
           defaultPageSize={5}
           onPageChange={(page) => { this.setState({ currentPage: page + 1, loading: true }, () => { this.getSMSCount(this.getBranchIds().toString()) }) }}
           page={this.state.currentPage - 1}
         />
       </Grid.Row>
     </React.Fragment>
   )
 }
}
const mapStateToProps = state => ({
  // branches: state.branches.items,
  roles: state.roles.items,
  user: state.authentication.user
})
const mapDispatchToProps = dispatch => ({
  // listBranches: dispatch(apiActions.listBranches()),
  loadRoles: dispatch(apiActions.listRoles())
})

export default connect(mapStateToProps,
  mapDispatchToProps
)(AddSmsCredits)
