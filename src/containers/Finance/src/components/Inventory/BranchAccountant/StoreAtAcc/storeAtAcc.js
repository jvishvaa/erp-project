import React, { Component } from 'react'
import { withStyles, Button, Table, TableBody, TableCell, TableHead, TableRow, Grid, FormControl, Radio, FormLabel, RadioGroup, FormControlLabel, TextField
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Select from 'react-select'
import Modal from '../../../../ui/Modal/modal'
import '../../../css/staff.css'
import * as actionTypes from '../../store/actions'
import CircularProgress from '../../../../ui/CircularProgress/circularProgress'
import ConfigItems from './configItems'

const styles = theme => ({
  tableWrapper: {
    overflowX: 'auto',
    marginBottom: 12,
    borderRadius: 4
  }
})

const NavData = JSON.parse(localStorage.getItem('navigationData')) || {};
let moduleId
if (NavData && NavData.length) {
  NavData.forEach((item) => {
    if (
      item.parent_modules === 'Student' &&
      item.child_module &&
      item.child_module.length > 0
    ) {
      item.child_module.forEach((item) => {
        if (item.child_name === 'Ledger Tab') {
          // setModuleId(item.child_id);
          // setModulePermision(true);
            moduleId = item.child_id
        } else {
          // setModulePermision(false);
        }
      });
    } else {
      // setModulePermision(false);
    }
  });
} else {
  // setModulePermision(false);
}


// let storeAtAccStore = null

class StoreAtAcc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newStudent: false,
      secondLang: null,
      thirdLang: null,
      isChecked: {},
      selectedTotal: 0,
      items: null,
      showStudentInfo: false,
      session: {
        label: '2020-21',
        value: '2020-21'
      },
      sessionData: null,
      // erpNo: null,
      searchTypeId: null,
      student: '',
      selectedErpStatus: false,
      studentName: '',
      selectedNameStatus: false,
      studentErp: '',
      allSections: true,
      getData: false,
      erp: null,
      showConfigItems: false,
      checkedKits: null,
      role: '',
      editModal: false,
      steps: ['Paid', 'Unpaid'],
      deliveryValue: 'branch',
      showDeliveryModal: false,
      selectedKits: [],
      delivery: {
        name: '',
        phone: '',
        address1: '',
        address2: '',
        zipcode: '',
        city: '',
        state: ''
      }
    }
  }

  componentDidMount () {
    // TODO: acad year in studentdata
    const userProfile = JSON.parse(localStorage.getItem('user_profile'))
    const role = userProfile.personal_info.role.toLowerCase()
    const { session, getData, erp } = this.props
    this.props.fetchWalletInfo(session, erp, this.props.alert, this.props.user)
    this.props.orderPaid(session, erp, this.props.alert, this.props.user)
    this.props.fetchKitSubjects(session, role, erp, this.props.alert, this.props.user)
    if (session && erp) {
      this.subjectCheckHandler()
      this.props.fetchDeliveryDetails(erp, this.props.alert, this.props.user)
    }
    // this.subjectCheckHandler()
    // if (this.state.session) {
    //   this.props.fetchGrades(this.state.session.value, this.props.alert, this.props.user)
    // }
    if (this.props.storeList.length === 0) {
      this.setState({
        selectedTotal: 0,
        isChecked: {},
        role: role
      })
    } else {
      const sum = this.props.storeList.reduce((acc, curr) => acc + curr.kit_price, 0)
      const isChecked = {}
      this.props.storeList.forEach(item => {
        isChecked[item.id] = true
      })
      this.setState({
        selectedTotal: sum,
        isChecked,
        role: role
      })
    }
    this.props.fetchStuProfile(session, erp, this.props.alert, this.props.user)
    // this.setState({
    //   secondLang: {
    //     id: this.props.language && this.props.language[0] && this.props.language[0].second_lang && this.props.language[0].second_lang.id,
    //     subject_name: this.props.language && this.props.language[0] && this.props.language[0].second_lang && this.props.language[0].second_lang.second_lang
    //   },
    //   thirdLang: {
    //     id: this.props.language && this.props.language[0] && this.props.language[0].third_lang && this.props.language[0].third_lang.id,
    //     subject_name: this.props.language && this.props.language[0] && this.props.language[0].third_lang && this.props.language[0].third_lang.third_lang
    //   }
    // })
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   // if (nextProps.refresh) {
  //   //   const {
  //   //     erpNo,
  //   //     session,
  //   //     alert,
  //   //     user
  //   //   } = this.props
  //   //   this.props.fetchAccountantTransaction(erpNo, session, user, alert)
  //   // }
  //   if (nextProps.erp === this.props.erp &&
  //     nextProps.session === this.props.session &&
  //     nextProps.getData === this.props.getData) {
  //     return false
  //   }
  //   return nextProps.getData
  // }

  componentDidUpdate (prevProps) {
    const erpLength = (this.props.erp + '').length
    const {
      erp,
      session
      // alert,
      // user
      // refresh
    } = this.props
    // if (refresh !== prevProps.refresh) {
    //   this.props.fetchAccountantTransaction(erpNo, session, user, alert)
    // }
    if (!this.props.erp || !this.props.session || !this.props.getData || erpLength !== 10) {
      return
    }
    if (this.props.erp === prevProps.erp && this.props.session === prevProps.session && this.props.getData === prevProps.getData) {
      return
    }
    if (this.props.getData && (erp !== prevProps.erp || session !== prevProps.session || this.props.getData)) {
      this.subjectCheckHandler()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.storeList !== this.props.storeList) {
      if (nextProps.storeList.length === 0) {
        this.setState({
          selectedTotal: 0,
          isChecked: {}
        })
      } else {
        const sum = nextProps.storeList.reduce((acc, curr) => acc + curr.kit_price, 0)
        const isChecked = {}
        nextProps.storeList.forEach(item => {
          isChecked[item.id] = true
        })
        this.setState({
          selectedTotal: sum,
          isChecked
        })
      }
    }
    // if (nextProps.status !== this.props.status) {
    //   this.props.orderPaid(this.props.session, this.props.erp, this.props.alert, this.props.user)
    // }
    this.setState({
      secondLang: {
        id: this.props.language && this.props.language[0] && this.props.language[0].second_lang && this.props.language[0].second_lang.id,
        subject_name: this.props.language && this.props.language[0] && this.props.language[0].second_lang && this.props.language[0].second_lang.second_lang
      },
      thirdLang: {
        id: this.props.language && this.props.language[0] && this.props.language[0].third_lang && this.props.language[0].third_lang.id,
        subject_name: this.props.language && this.props.language[0] && this.props.language[0].third_lang && this.props.language[0].third_lang.third_lang
      }
    })
  }

  handleDeliveryOption = (event) => {
    this.setState({
      deliveryValue: event.target.value
    })
  }

  showDeliveryModalHandler = () => {
    this.setState({
      showDeliveryModal: true,
      delivery: {
        ...this.state.delivery,
        name: this.props.deliveryList.length && this.props.deliveryList[0].name ? this.props.deliveryList[0].name : '',
        phone: this.props.deliveryList.length && this.props.deliveryList[0].phone_number ? this.props.deliveryList[0].phone_number : '',
        address1: this.props.deliveryList.length && this.props.deliveryList[0].address1 ? this.props.deliveryList[0].address1 : '',
        address2: this.props.deliveryList.length && this.props.deliveryList[0].address2 ? this.props.deliveryList[0].address2 : '',
        city: this.props.deliveryList.length && this.props.deliveryList[0].city ? this.props.deliveryList[0].city : '',
        zipcode: this.props.deliveryList.length && this.props.deliveryList[0].zip_code ? this.props.deliveryList[0].zip_code : '',
        state: this.props.deliveryList.length && this.props.deliveryList[0].state ? this.props.deliveryList[0].state : ''
      }
    })
  }

  hideDeliveryHandler = () => {
    this.setState({
      showDeliveryModal: false
    })
  }

  handleData = (event) => {
    switch (event.target.id) {
      case 'name': {
        this.setState(Object.assign(this.state.delivery, { name: event.target.value }))
        break
      }
      case 'phone': {
        this.setState(Object.assign(this.state.delivery, { phone: event.target.value }))
        break
      }
      case 'address1': {
        this.setState(Object.assign(this.state.delivery, { address1: event.target.value }))
        break
      }
      case 'address2': {
        this.setState(Object.assign(this.state.delivery, { address2: event.target.value }))
        break
      }
      case 'zipcode': {
        this.setState(Object.assign(this.state.delivery, { zipcode: event.target.value }))
        break
      }
      case 'city': {
        this.setState(Object.assign(this.state.delivery, { city: event.target.value }))
        break
      }
      case 'state': {
        this.setState(Object.assign(this.state.delivery, { state: event.target.value }))
        break
      }
      default: {

      }
    }
  }

  sendAddress = () => {
    // send
    const { name, phone, address1, address2, city, zipcode, state } = this.state.delivery
    if (!name.length || !address1.length || !city.length || !state.length) {
      this.props.alert.warning('Enter all the fields!')
      return
    }
    if (phone.length !== 10) {
      this.props.alert.warning('Enter 10 digits phone number')
      return
    }
    if (zipcode.length !== 6) {
      this.props.alert.warning('Enter 6 digits Zip code')
      return
    }
    let data = {
      student: { erp: this.props.erp },
      name: name,
      phone_number: phone,
      address1: address1,
      address2: address2,
      zip_code: zipcode,
      city: city,
      state: state
    }
    this.props.sendDeliveryDetails(data, this.props.alert, this.props.user)
    this.hideDeliveryHandler()
  }

  subjectCheckHandler = () => {
    // const { erp } = this.state
    // let erp = null
    // if (this.state.searchTypeData.value === 1) {
    //   erp = this.state.studentLabel
    // } else {
    //   erp = this.state.studentErp
    // }
    if (!this.props.session && !this.props.erp) {
      this.props.alert.warning('Please Fill All The Fields')
      return
    }
    if (this.props.erp) {
      this.setState({
        isChecked: {},
        selectedTotal: 0,

        getData: true
      }, () => {
        this.props.subjectChoosen(this.props.session, this.state.role, this.props.erp, this.props.user, this.props.alert)
        // storeAtAccStore = this.state
      })
    } else {
      this.setState({
        getData: false
      })
      this.props.alert.warning('Select Valid Student')
    }
  }

  secondLangHandler = (e) => {
    this.setState({
      secondLang: {
        id: e.value,
        subject_name: e.label
      }
    })
  }

  thirdLangHandler = (e) => {
    this.setState({
      thirdLang: {
        id: e.value,
        subject_name: e.label
      }
    })
  }

  submitLangHandler = () => {
    // let erp = null
    // if (this.state.searchTypeData.value === 1) {
    //   erp = this.state.studentLabel
    // } else {
    //   erp = this.state.studentErp
    // }
    this.props.orderPaid(this.props.session, this.props.erp, this.props.alert, this.props.user)
    // this.setState({
    // })
    const {
      secondLang,
      thirdLang,
      role
    } = this.state
    this.props.submitLanguage((secondLang && secondLang.id === 'none' ? null : (secondLang && secondLang.id) || null), thirdLang && thirdLang.id === 'none' ? null : (thirdLang && thirdLang.id) || null, this.props.erp, role, this.props.session, this.props.user, this.props.alert)
    // storeAtAccStore = this.state

    let data = {
      erp: this.props.language[0] && this.props.language[0].student_erp,
      student_name: this.props.language[0] && this.props.language[0].student_name,
      student_Address: this.props.language[0] && this.props.language[0].student_Address,
      father_name: this.props.language[0] && this.props.language[0].father_name,
      father_mobile: this.props.language[0] && this.props.language[0].father_mobile,
      parent_access: this.props.language[0] && this.props.language[0].parent_access,
      second_lang: secondLang && secondLang.id === 'none' ? 'none' : (secondLang && secondLang.id) || 'none',
      third_lang: thirdLang && thirdLang.id === 'none' ? 'none' : (thirdLang && thirdLang.id) || 'none'
    }
    this.props.updateStudentProfile(data, this.props.alert, this.props.user)
    this.setState({
      erp: this.props.language[0] && this.props.language[0].student_erp,
      editModal: false
    }, () => {
      this.props.submitLanguage((secondLang && secondLang.id === 'none' ? null : (secondLang && secondLang.id) || null), thirdLang && thirdLang.id === 'none' ? null : (thirdLang && thirdLang.id) || null, this.props.erp, role, this.props.session, this.props.user, this.props.alert)
    })
  }

  addBalance = (id) => e => {
    let { isChecked } = this.state
    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      this.setState({ isChecked: { ...isChecked, [id]: true }, deliveryValue: 'branch' })
    } else {
      // or remove the value from the unchecked checkbox from the array
      this.setState({ isChecked: { ...isChecked, [id]: false }, deliveryValue: 'branch' })
    }

    let pay = this.state.selectedTotal
    const data = this.props.storeList.filter(list => (list.id === id))

    let amount = 0
    // adding and removing the total amount to be paid
    data.map(amt => {
      amount = amt.kit_price
      if (e.target.checked) {
        // pay += amt.balance
        pay += amount
      } else {
        // pay -= amount
        pay -= amount
      }
    })
    this.setState({ selectedTotal: pay })
  }

  itemsHandler = () => {
    // let erp = null
    // if (this.state.searchTypeData.value === 1) {
    //   erp = this.state.studentLabel
    // } else {
    //   erp = this.state.studentErp
    // }
    // const {
    //   erp
    // } = this.state

    const keys = Object.keys(this.state.isChecked)
      .filter(itemKey => this.state.isChecked[itemKey])
      .map(item => +item)
    const checkedKits = this.props.storeList.filter(list => keys.includes(list.id))
    let data = {
      kit_ids: keys
    }
    this.props.fetchStoreItems(data, this.props.user, this.props.alert)
    this.setState({
      selectedKits: keys,
      checkedKits: checkedKits,
      showConfigItems: true
    }, () => {
    })
    // <ConfigItems />
    // this.props.history.push({
    //   pathname: '/finance/makeStorePayment/',
    //   state: {
    //     selectedTotal: this.state.selectedTotal,
    //     erpCode: this.props.erp,
    //     session: this.props.session,
    //     checkedKits,
    //     isUniformBought: this.props.isUniformBought,
    //     isStationaryBought: this.props.isStationaryBought,
    //     hasSubjectChoosen: this.props.hasSubjectChoosen,
    //     isNewStudent: this.props.isNewStudent
    //   }
    // })
  }

  getBackHandler = (confirm) => {
    this.props.orderPaid(this.props.session, this.props.erp, this.props.alert, this.props.user)
    this.setState({
      showConfigItems: confirm
    })
  }

  checkDisable = (isUniform, isMandatory) => {
    if (isUniform && isMandatory && !this.props.isUniformBought) {
      return true
    } else if (!isUniform && isMandatory && !this.props.isStationaryBought) {
      return true
    }
    return false
  }

  checkRadioDisable = (isChecked) => {
    let ids = []
    for (let [key, value] of Object.entries(isChecked)) {
      if (value) {
        ids.push(key)
      }
    }
    let valid = true
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < this.props.storeList.length; j++) {
        if (+ids[i] === +this.props.storeList[j].id && !this.props.storeList[j].is_uniform_kit) {
          valid = false
        }
      }
    }
    return valid
  }

  storeErpHandler = (e) => {
    this.setState({
      erpCode: e.target.value
    })
  }
  showEditModalHandler = () => {
    this.setState({ editModal: true })
  }

  hideEditModalHandler = () => {
    this.setState({ editModal: false })
  }

  checkIfPaidHandler = (id) => {
    const paidIds = this.props.orderPaids.map(item => item.kit_id)
    return paidIds.includes(id)
  }
  render () {
    let { classes } = this.props
    let configTable = null
    if (this.state.showConfigItems) {
      configTable = (
        <React.Fragment>
          <ConfigItems
            selectedTotal={this.state.selectedTotal}
            erpCode={this.props.erp}
            session={this.props.session}
            checkedKits={this.state.checkedKits}
            isUniformBought={this.props.isUniformBought}
            isStationaryBought={this.props.isStationaryBought}
            hasSubjectChoosen={this.props.hasSubjectChoosen}
            isNewStudent={this.props.isNewStudent}
            getBack={this.getBackHandler}
            alert={this.props.alert}
            user={this.props.user}
            isStudent={this.props.isStudent}
            isDelivery={this.state.deliveryValue}
            selectedKits={this.state.selectedKits}
          /> 
        </React.Fragment>
      )
    }
    let grade = null
    let commonKit = false
    let changeModal = null
    if (this.state.editModal) {
      changeModal = (
        <Modal open={this.state.editModal} click={this.hideEditModalHandler} medium>
          <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '-20px' }}>Assign Languages</h2>
          <Grid container spacing={2} style={{ padding: 15, justifyContent: 'center' }}>
            <Grid item xs={9}>
              <Grid item xm={3}>
                <div style={{ marginBottom: '10px', marginTop: '10px' }}>
                  <label >2nd Language</label>
                </div>
                <Select
                  placeholder='Not Assigned'
                  value={this.state.secondLang ? {
                    value: this.state.secondLang.id ? this.state.secondLang.id : 'Not Assigned',
                    label: this.state.secondLang.subject_name ? this.state.secondLang.subject_name : 'Not Assigned'
                  } : null}
                  options={
                    this.props.subject
                      ? this.props.subject.filter(subject => subject.is_second_language || subject.id === 'none').map(subject => ({
                        value: subject.id,
                        label: subject.subject_name
                      }))
                      : []
                  }
                  // defaultValue={{ value: this.props.language && this.props.language[0] && this.props.language[0].second_lang && this.props.language[0].second_lang.id ? (this.props.language && this.props.language[0] && this.props.language[0].second_lang && this.props.language[0].second_lang.id) : 'Not Assigned',
                  //   label: this.props.language[0] && this.props.language[0].second_lang && this.props.language[0].second_lang.second_lang ? (this.props.language[0] && this.props.language[0].second_lang && this.props.language[0].second_lang.second_lang) : 'Not Assigned' }}
                  onChange={this.secondLangHandler}
                />
              </Grid>
              <Grid item xm={3}>
                <div style={{ marginBottom: '10px', marginTop: '10px', fontWeight: '900' }}>
                  <label >3rd Language</label>
                </div>
                <Select
                  placeholder='Not Assigned'
                  value={this.state.thirdLang ? {
                    value: this.state.thirdLang.id ? this.state.thirdLang.id : 'Not Assigned',
                    label: this.state.thirdLang.subject_name ? this.state.thirdLang.subject_name : 'Not Assigned'
                  } : null}
                  options={
                    this.props.subject
                      ? this.props.subject.filter(subject => subject.is_third_language || subject.id === 'none').map(subject => ({
                        value: subject.id,
                        label: subject.subject_name
                      }))
                      : []
                  }
                  // defaultValue={{ value: this.props.language && this.props.language[0] && this.props.language[0].third_lang && this.props.language[0].third_lang.id ? (this.props.language && this.props.language[0] && this.props.language[0].third_lang && this.props.language[0].third_lang.id) : 'Not Assigned',
                  //   label: this.props.language[0] && this.props.language[0].third_lang && this.props.language[0].third_lang.third_lang ? (this.props.language[0] && this.props.language[0].third_lang && this.props.language[0].third_lang.third_lang) : 'Not Assigned' }}
                  onChange={this.thirdLangHandler}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  // disabled={!this.state.secondLang || !this.state.thirdLang}
                  style={{ marginTop: '20px' }}
                  variant='contained'
                  color='primary'
                  onClick={this.submitLangHandler}>
                      Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Modal>
      )
    }

    let deliveryModal = null
    if (this.state.deliveryValue === 'home' && this.state.showDeliveryModal) {
      deliveryModal = (
        <Modal open={this.state.showDeliveryModal} justifyContent='center' click={this.hideDeliveryHandler} style={{ width: '30%', padding: 20 }}>
          <h2 style={{ textAlign: 'center' }}>Enter Shipping Address</h2>
          <Grid container spacing={1}>
            <Grid item xs={6} style={{ margin: '0px auto' }}>
              <TextField id='name' value={this.state.delivery.name} label='Contact Person Name' variant='outlined' onChange={this.handleData} />
            </Grid>
            <Grid item xs={6} style={{ margin: '0px auto' }}>
              <TextField id='phone' label='Phone Number' value={this.state.delivery.phone} variant='outlined' type='number' onChange={this.handleData} />
            </Grid>
            <Grid item xs={6} style={{ margin: '0px auto' }}>
              <TextField id='address1' multiline rowsMax='4' value={this.state.delivery.address1} label='Address Line 1' variant='outlined' onChange={this.handleData} />
            </Grid>
            <Grid item xs={6} style={{ margin: '0px auto' }}>
              <TextField id='address2' multiline rowsMax='4' value={this.state.delivery.address2} label='Address Line 2' variant='outlined' onChange={this.handleData} />
            </Grid>
            <Grid item xs={6} style={{ margin: '0px auto' }}>
              <TextField id='zipcode' label='Zip Code' variant='outlined' value={this.state.delivery.zipcode} type='number' onChange={this.handleData} />
            </Grid>
            <Grid item xs={6} style={{ margin: '0px auto' }}>
              <TextField id='city' label='City' variant='outlined' value={this.state.delivery.city} onChange={this.handleData} />
            </Grid>
            <Grid item xs={6} style={{ margin: '0px auto' }}>
              <TextField id='state' label='State' variant='outlined' value={this.state.delivery.state} onChange={this.handleData} />
            </Grid>
            <Grid item xs={6} style={{ margin: '0px auto' }} />
            <Grid item xs={6}>
              <Button
                // disabled={!this.state.secondLang || !this.state.thirdLang}
                style={{ marginTop: '20px' }}
                variant='contained'
                color='primary'
                onClick={this.sendAddress}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Modal>
      )
    }
    return (
      <React.Fragment>
        {!this.props.hasSubjectChoosen && this.state.getData
          ? <div>
            <Grid container spacing={3} style={{ padding: '15px' }}>
              <Grid item xs={3}>
                <label>2nd Language</label>
                <Select
                  placeholder='Not Assigned'
                  value={this.state.secondLang ? {
                    value: this.state.secondLang.id ? this.state.secondLang.id : 'Not Assigned',
                    label: this.state.secondLang.subject_name ? this.state.secondLang.subject_name : 'Not Assigned'
                  } : null}
                  options={
                    this.props.subject
                      ? this.props.subject.filter(subject => subject.is_second_language).map(subject => ({
                        value: subject.is_second_language && subject.id,
                        label: subject.is_second_language && subject.subject_name
                      }))
                      : []
                  }
                  onChange={this.secondLangHandler}
                />
              </Grid>
              <Grid item xs={3}>
                <label>3rd Language</label>
                <Select
                  placeholder='Not Assigned'
                  value={this.state.thirdLang ? {
                    value: this.state.thirdLang.id ? this.state.thirdLang.id : 'Not Assigned',
                    label: this.state.thirdLang.subject_name ? this.state.thirdLang.subject_name : 'Not Assigned'
                  } : null}
                  options={
                    this.props.subject
                      ? this.props.subject.filter(subject => subject.is_third_language).map(subject => ({
                        value: subject.id,
                        label: subject.subject_name
                      }))
                      : []
                  }
                  onChange={this.thirdLangHandler}
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  // disabled={!this.state.secondLang || !this.state.thirdLang}
                  style={{ marginLeft: '10px', marginTop: '25px' }}
                  variant='contained'
                  color='primary'
                  onClick={this.submitLangHandler}>
                    Submit
                </Button>
              </Grid>
            </Grid>
          </div>
          : null
        }
        {this.props.storeList.length && this.props.getData && !this.state.showConfigItems
          ? <div style={{ marginLeft: '25px' }}>
            {this.props.storeList.length === 1 ? <p style={{ color: 'red', fontWeight: 600, fontSize: 18 }}>Book Kit for selected subject does not exist, Please contact {this.state.role === 'student' ? 'respective branch!' : 'Store admin!'}</p> : ''}
            {this.props.storeList.length === 2 && grade > 4 && commonKit ? <p style={{ color: 'red', fontWeight: 600, fontSize: 18 }}>Book Kit for selected subject does not exist, Please contact {this.state.role === 'student' ? 'respective branch!' : 'Store admin!'}</p> : ''}
            {/* <Grid container spacing={2} justify='center'>
              <Grid item xs={6}>
                {this.props.isUniformBought
                  ? <div style={{ padding: '20px 20px', backgroundColor: '#73ea73', fontSize: '18px', margin: '10px auto', borderRadius: 10, width: 'fit-content' }}>Uniform Kit has been Paid Successfully!</div>
                  : <div style={{ padding: '20px 20px', backgroundColor: '#fd626d', fontSize: '18px', color: '#fff', margin: '10px auto', borderRadius: 10, width: 'fit-content' }}>Uniform Kit has not been Paid!</div>}
              </Grid>
              <Grid item xs={6}>
                {this.props.isStationaryBought
                  ? <div style={{ padding: '20px 20px', backgroundColor: '#73ea73', fontSize: '18px', margin: '10px auto', borderRadius: 10, width: 'fit-content' }}>Stationary Kit has been Paid Successfully!</div>
                  : <div style={{ padding: '20px 20px', backgroundColor: '#fd626d', fontSize: '18px', color: '#fff', margin: '10px auto', borderRadius: 10, width: 'fit-content' }}>Stationary Kit has not been Paid!</div>}
              </Grid>
            </Grid> */}
            <div className={classes.tableWrapper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><h4>2nd Language : { this.props.language && this.props.language[0] && this.props.language[0].second_lang && this.props.language[0].second_lang.second_lang ? this.props.language[0].second_lang && this.props.language[0].second_lang.second_lang : 'Not Assigned'}</h4> </TableCell>
                    <TableCell><h4>3rd Language: {this.props.language && this.props.language[0] && this.props.language[0].third_lang && this.props.language[0].third_lang.third_lang ? this.props.language[0].third_lang && this.props.language[0].third_lang.third_lang : 'Not Assigned'}</h4></TableCell>
                    {/* <TableCell> <Fab size='small' color='primary' style={{ marginBottom: '5px' }} onClick={this.showEditModalHandler}>
                      <Edit style={{ cursor: 'pointer' }} />
                    </Fab>,</TableCell> */}
                    <TableCell>
                      <Button
                        // style={{ margin: '25px' }}
                        variant='contained'
                        color='primary'
                        onClick={this.showEditModalHandler}
                        Configure Items
                      >
                        Change Language
                      </Button>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell />
                    <TableCell>Kit Name</TableCell>
                    <TableCell>Kit Color</TableCell>
                    <TableCell>Kit Type</TableCell>
                    <TableCell>Kit Price</TableCell>
                    <TableCell>No of Items</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.storeList.map((row, i) => {
                    grade = row.grade
                    commonKit = row.is_common_kit
                    return (
                      <TableRow key={i + 1}>
                        <TableCell>
                          <input
                            type='checkbox'
                            name='checking'
                            value={i + 1}
                            // checked={Object.keys(this.state.isChecked).length ? this.state.isChecked[row.id] : true}
                            checked={this.state.isChecked[row.id]}
                            disabled={this.checkDisable(row.is_uniform_kit, row.is_mandatory)}
                            onChange={
                              this.addBalance(row.id)
                            } />
                        </TableCell>
                        <TableCell>{row.kit_name}</TableCell>
                        <TableCell>{row.kit_colour}</TableCell>
                        <TableCell>{row.is_uniform_kit === true ? 'Uniform Kit' : 'Stationary Kit'}</TableCell>
                        <TableCell>{row.kit_price}</TableCell>
                        <TableCell>{row.item && row.item.length}</TableCell>
                        <TableCell>
                          {this.checkIfPaidHandler(row.id) ? <Button variant='outlined' style={{ border: '2px solid #07c316' }}>Paid</Button> : <Button variant='outlined' style={{ border: '2px solid #c30707' }}>Not Paid</Button>}
                          {/* <Stepper activeStep={row.is_uniform_kit ? (this.props.isStationaryBought === true ? 1 : this.props.isStationaryBought === true ? 2 : 0) : (this.props.isUniformBought === true ? 1 : row.order_status === '3' ? 2 : 0)} alternativeLabel>
                            {this.state.steps.map(label => (
                              <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                              </Step>
                            ))}
                          </Stepper> */}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {this.props.storeList.length > 0
                    ? <TableRow>
                      <TableCell colSpan={3} style={{ fontSize: '16px' }}>Total Selected Amount: {this.state.selectedTotal}</TableCell>
                      {/* <TableCell colSpan={3}>{this.state.feeDetailsList}</TableCell> */}
                    </TableRow>
                    : null
                  }
                </TableBody>
              </Table>
            </div>
            <div>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Delivery Option</FormLabel>
                <RadioGroup aria-label='delivery' name='delivery1' value={this.state.deliveryValue} onChange={this.handleDeliveryOption}>
                  <FormControlLabel value='branch' control={<Radio />} label='Pick up At Branch' />
                  <FormControlLabel
                    value='home'
                    disabled={this.checkRadioDisable(this.state.isChecked)}
                    // disabled
                    control={<Radio />} label='Home Delivery'
                  />
                </RadioGroup>
              </FormControl>
              {this.state.deliveryValue === 'home' ? <Button color='secondary' variant='outlined' onClick={this.showDeliveryModalHandler}> Enter/Modify Delivery Address</Button> : ''}
              {this.state.deliveryValue === 'home' && this.props.deliveryList.length
                ? <div>
                  <h3>Shipping Details</h3>
                  <p>Contact Person Name: {this.props.deliveryList.length && this.props.deliveryList[0].name}</p>
                  <p>Mobile Number: {this.props.deliveryList.length && this.props.deliveryList[0].phone_number}</p>
                  <p>Address: {this.props.deliveryList.length && this.props.deliveryList[0].address1} <br />
                    {this.props.deliveryList.length && this.props.deliveryList[0].address2} <br />
                    {this.props.deliveryList.length && this.props.deliveryList[0].city} <br />
                    {this.props.deliveryList.length && this.props.deliveryList[0].zip_code} <br />
                    {this.props.deliveryList.length && this.props.deliveryList[0].state} <br />
                  </p>
                </div>
                : ''}
            </div>
            {this.state.selectedTotal > 0
              ? <Button
                style={{ margin: '25px' }}
                variant='contained'
                color='primary'
                disabled={this.state.deliveryValue === 'home' && this.props.deliveryList.length === 0}
                onClick={this.itemsHandler}>
                  Configure Items
              </Button>
              : null}
          </div>
          : null}
        {configTable}
        {changeModal}
        {deliveryModal}
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  // session: state.academicSession.items,
  subject: state.inventory.branchAcc.storeAtAcc.kitSubjectList,
  hasSubjectChoosen: state.inventory.branchAcc.storeAtAcc.hasSubjectChoosen,
  dataLoading: state.finance.common.dataLoader,
  storeList: state.inventory.branchAcc.storeAtAcc.storeList,
  isUniformBought: state.inventory.branchAcc.storeAtAcc.isUniformBought,
  isStationaryBought: state.inventory.branchAcc.storeAtAcc.isStationaryBought,
  isNewStudent: state.inventory.branchAcc.storeAtAcc.isNewStudent,
  ErpSuggestions: state.finance.makePayAcc.erpSuggestions,
  sectionData: state.finance.accountantReducer.changeFeePlan.sectionData,
  kitSubjectList: state.inventory.branchAcc.storeAtAcc.kitSubjectList,
  language: state.inventory.branchAcc.storeAtAcc.language,
  orderPaids: state.inventory.branchAcc.storeAtAcc.orderPaid,
  deliveryList: state.inventory.branchAcc.storeAtAcc.deliveryList,
  status: state.inventory.branchAcc.storeAtAcc.status
})

const mapDispatchToProps = dispatch => ({
  // loadSession: dispatch(apiActions.listAcademicSessions()),
  // listSubjects: dispatch(apiActions.listSubjects()),
  orderPaid: (session, erp, alert, user) => dispatch(actionTypes.orderPaid({ session, erp, alert, user })),
  updateStudentProfile: (data, alert, user) => dispatch(actionTypes.updateStudentProfile({ data, alert, user })),
  fetchStuProfile: (session, erp, alert, user) => dispatch(actionTypes.fetchStuProfile({ session, erp, alert, user })),
  subjectChoosen: (session, role, erp, user, alert) => dispatch(actionTypes.subjectChoosen({ session, role, erp, user, alert })),
  submitLanguage: (secondLangId, thirdLangId, erp, role, sessionYear, user, alert) => dispatch(actionTypes.submitLanguage({ secondLangId, thirdLangId, erp, role, sessionYear, user, alert })),
  fetchStoreItems: (data, user, alert) => dispatch(actionTypes.listStoreItemsAccountant({ data, user, alert })),
  fetchGrades: (session, alert, user, moduleId) => dispatch(actionTypes.fetchGrades({ session, alert, user, moduleId })),
  fetchErpSuggestions: (type, session, grade, section, status, erp, alert, user) => dispatch(actionTypes.fetchErpSuggestions({ type, session, grade, section, status, erp, alert, user })),
  fetchAllSections: (session, gradeId, alert, user, moduleId) => dispatch(actionTypes.fetchAllSections({ session, gradeId, alert, user, moduleId })),
  fetchKitSubjects: (session, role, erp, alert, user) => dispatch(actionTypes.fetchKitSubjects({ session, role, erp, alert, user })),
  fetchDeliveryDetails: (erp, alert, user) => dispatch(actionTypes.fetchDeliveryDetails({ erp, alert, user })),
  sendDeliveryDetails: (data, alert, user) => dispatch(actionTypes.sendDeliveryDetails({ data, alert, user })),
  fetchWalletInfo: (session, erp, alert, user) => dispatch(actionTypes.fetchWalletInfo({ session, erp, alert, user }))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(StoreAtAcc)))
