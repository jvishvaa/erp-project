import React, { Component } from 'react'
import { Grid, Button, TextField, Checkbox, Modal
} from '@material-ui/core/'
import { withRouter } from 'react-router-dom'
import Select from 'react-select'
import { connect } from 'react-redux'
import AutoSuggest from '../../../ui/AutoSuggest/autoSuggest'
import '../../../css/staff.css'
import * as actionTypes from '../store/actions'
import { apiActions } from '../../../_actions'
import CircularProgress from '../../../ui/CircularProgress/circularProgress'
import { debounce } from '../../../utils'
import shirt from '../../../assets/shirt.jpg'
import pant from '../../../assets/pant.jpg'
import Student from '../../Finance/Profiles/studentProfile'
// import { Button } from 'semantic-ui-react'

const defaultUniformShirt = {
  index: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  chest: [66.0, 71.1, 74.9, 80.0, 85.1, 90.2, 95.3, 101.6, 106.7, 109.2, 111.8, 111.8, 121.9, 125.7, 127.0],
  length: [40.6, 42.5, 44.5, 48.9, 53.3, 54.6, 59.7, 61.0, 61.6, 64.1, 66.0, 71.1, 69.9, 72.4, 76.2],
  sleeveLength: [35.6, 36.2, 38.1, 40.6, 43.2, 48.3, 53.3, 53.3, 54.6, 55.9, 55.9, 57.2, 57.8, 57.8, 61.0],
  shoulder: [24.8, 27.3, 29.2, 31.8, 34.3, 38.1, 39.4, 41.3, 43.2, 44.5, 47.0, 47.0, 49.5, 50.2, 52.1]
}
const defaultDenimPant = {
  index: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
  length: [53.3, 55.9, 58.4, 61.0, 63.5, 68.6, 73.7, 78.7, 83.8, 86.4, 91.4, 94.0, 99.1, 101.6, 101.6, 104.1, 106.7, 106.7, 106.7, 111.8, 111.8],
  waist: [40.6, 43.2, 45.7, 48.3, 53.3, 55.9, 55.9, 58.4, 61.0, 63.5, 66.0, 68.6, 71.1, 73.7, 76.2, 78.7, 81.3, 83.8, 86.4, 88.9, 91.4]
}
const defaultDenimShort = {
  index: ['S', 0, 2, 4, 6, 8, 10, 12, 14],
  length: [24.1, 25.4, 26.7, 27.9, 29.2, 30.5, 31.8, 34.3, 36.8],
  waist: [35.6, 38.1, 40.6, 43.2, 45.7, 48.3, 53.3, 55.9, 55.9]
}
const defaultSportTrackPant = {
  // index: [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26],
  length: [50.8, 55.9, 61, 66, 71.1, 76.2, 81.3, 86.4, 91.4, 96.5, 101.6, 106.7, 111.8, 111.8, 111.8],
  waist: [19.1, 20.3, 21.6, 22.9, 22.9, 24.1, 25.4, 26.7, 27.9, 29.2, 30.5, 31.8, 33, 35.6, 38.1],
  index: [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26]
}
const defaultDaywearShirt = {
  index: [2, 4, 6, 8, 12, 14, 16, 18, 20, 22, 24, 26, 28],
  chest: [ 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 114, 118 ],
  length: [ 39, 42, 45, 49, 53, 57, 61, 64, 67, 69, 70, 72, 74 ],
  sleeveLength: [ 12.6, 13.3, 14.9, 15.6, 16.9, 17, 18.8, 19.9, 20.9, 22.3, 22.5, 24.5, 25.2 ],
  shoulder: [ 24.8, 27.3, 29.2, 31.8, 34.3, 38.1, 39.4, 41.3, 43.2, 44.5, 47, 47, 49.5 ]
}
const defaultSportsTshirt = {
  index: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26],
  chest: [ 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 114, 118 ],
  length: [ 39, 42, 45, 49, 53, 57, 61, 64, 67, 69, 70, 72, 74 ],
  collar: [ 31, 31.5, 31.5, 33, 35, 35, 35, 35, 41, 41, 41, 41, 47 ],
  shoulder: [ 24.8, 27.3, 29.2, 31.8, 34.3, 38.1, 39.4, 41.3, 43.2, 44.5, 47, 47, 49.5 ]
}
class StudentUniform extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 'one',
      session: {
        label: '2019-20',
        value: '2019-20'
      },
      sessionData: null,
      getData: false,
      showTabs: false,
      erpNo: null,
      gradeId: 'all',
      gradeData: {
        label: 'All Grades',
        id: 'all'
      },
      sectionId: null,
      sectionData: null,
      studentTypeData: {
        label: 'Active',
        value: 1
      },
      // studentTypeId: null,
      searchTypeData: {
        label: 'Student Name',
        value: 2
      },
      searchTypeId: 2,
      student: '',
      selectedErpStatus: false,
      studentName: '',
      selectedNameStatus: false,
      studentErp: '',
      allSections: true,
      isStoreManager: false,
      shirtCheck: false,
      pantCheck: false,
      showShirt: false,
      showPant: false,
      showUniformDetails: false,
      color: null,
      acrossShoulder: null,
      chest: null,
      sleeveLength: null,
      waist: null,
      collar: null,
      length: null,
      modelOpen: false,
      updatedChest: null,
      updatedLength: null,
      updatedSleeveLength: null,
      updatedAcrossShoulder: null,
      overallChestSize: null,
      overallShirtLength: null,
      overallSleeveLength: null,
      overallAcrossShoulder: null,
      overallShirtSize: null,
      // Denim Pant
      denimPantWaist: null,
      denimPantRise: null,
      denimPantThigh: null,
      denimPantOutseamLength: null,
      denimPantBottomHem: null,
      denimPantInseamLength: null,
      overallDenimPantSize: null,
      // Denim Short Pant
      overallDenimShortSize: null,
      denimShortWaist: null,
      denimShortRise: null,
      denimShortThigh: null,
      denimShortOutseamLength: null,
      denimShortBottomHem: null,
      denimShortInseamLength: null,
      denimShortCheck: false,
      showDenimShort: false,
      // Sport Track Pant
      overallSportTrackPantSize: null,
      sportTrackPantWaist: null,
      sportTrackPantRise: null,
      sportTrackPantThigh: null,
      sportTrackPantOutseamLength: null,
      sportTrackPantBottomHem: null,
      sportTrackPantInseamLength: null,
      sportTrackPantCheck: false,
      showSportTrackPant: false,
      // Daywear shirt
      daywearShirtAcrossShoulder: null,
      daywearShirtChest: null,
      daywearShirtSleeveLength: null,
      daywearShirtWaist: null,
      daywearShirtCollar: null,
      daywearShirtLength: null,
      daywearShirtCheck: false,
      showDaywearShirt: false,
      overallDaywearShirtSize: null,
      // Sports-T-Shirt
      sportsTshirtAcrossShoulder: null,
      sportsTshirtChest: null,
      sportsTshirtSleeveLength: null,
      sportsTshirtWaist: null,
      sportsTshirtCollar: null,
      sportsTshirtLength: null,
      sportsTshirtCheck: false,
      showSportsTshirt: false,
      overallSportsTshirtSize: null
    }
  }

  componentDidMount = () => {
    const role = (JSON.parse(localStorage.getItem('user_profile'))).personal_info.role
    if (role === 'StoreManager') {
      this.setState({
        isStoreManager: true
      })
    } else {
      this.props.uniformDetails(this.state.student, this.state.isStoreManager, this.props.alert, this.props.user)
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.uniform) {
      this.setState({
        acrossShoulder: this.props.uniform && this.props.uniform.shirt && this.props.uniform.shirt.across_shoulder,
        chest: this.props.uniform && this.props.uniform.shirt && this.props.uniform.shirt.chest,
        sleeveLength: this.props.uniform && this.props.uniform.shirt && this.props.uniform.shirt.sleeve_length,
        waist: this.props.uniform && this.props.uniform.shirt && this.props.uniform.shirt.waist,
        collar: this.props.uniform && this.props.uniform.shirt && this.props.uniform.shirt.collar,
        length: this.props.uniform && this.props.uniform.shirt && this.props.uniform.shirt.length,
        // Denim pant
        denimPantWaist: this.props.uniform && this.props.uniform.denim_pant && this.props.uniform.denim_pant.waist,
        denimPantRise: this.props.uniform && this.props.uniform.denim_pant && this.props.uniform.denim_pant.rise,
        denimPantThigh: this.props.uniform && this.props.uniform.denim_pant && this.props.uniform.denim_pant.thigh,
        denimPantOutseamLength: this.props.uniform && this.props.uniform.denim_pant && this.props.uniform.denim_pant.outseam_length,
        denimPantBottomHem: this.props.uniform && this.props.uniform.denim_pant && this.props.uniform.denim_pant.bottom_hem,
        denimPantInseamLength: this.props.uniform && this.props.uniform.denim_pant && this.props.uniform.denim_pant.inseam_length,
        // Denim short
        denimShortWaist: this.props.uniform && this.props.uniform.denim_short && this.props.uniform.denim_short.waist,
        denimShortRise: this.props.uniform && this.props.uniform.denim_short && this.props.uniform.denim_short.rise,
        denimShortThigh: this.props.uniform && this.props.uniform.denim_short && this.props.uniform.denim_short.thigh,
        denimShortOutseamLength: this.props.uniform && this.props.uniform.denim_short && this.props.uniform.denim_short.outseam_length,
        denimShortBottomHem: this.props.uniform && this.props.uniform.denim_short && this.props.uniform.denim_short.bottom_hem,
        denimShortInseamLength: this.props.uniform && this.props.uniform.denim_short && this.props.uniform.denim_short.inseam_length,
        // Sport Track Pant
        sportTrackPantWaist: this.props.uniform && this.props.uniform.sport_track_pant && this.props.uniform.sport_track_pant.waist,
        sportTrackPantRise: this.props.uniform && this.props.uniform.sport_track_pant && this.props.uniform.sport_track_pant.rise,
        sportTrackPantThigh: this.props.uniform && this.props.uniform.sport_track_pant && this.props.uniform.sport_track_pant.thigh,
        sportTrackPantOutseamLength: this.props.uniform && this.props.uniform.sport_track_pant && this.props.uniform.sport_track_pant.outseam_length,
        sportTrackPantBottomHem: this.props.uniform && this.props.uniform.sport_track_pant && this.props.uniform.sport_track_pant.bottom_hem,
        sportTrackPantInseamLength: this.props.uniform && this.props.uniform.sport_track_pant && this.props.uniform.sport_track_pant.inseam_length,
        // Daywear Shirt
        daywearShirtAcrossShoulder: this.props.uniform && this.props.uniform.daywear_shirt && this.props.uniform.daywear_shirt.across_shoulder,
        daywearShirtChest: this.props.uniform && this.props.uniform.daywear_shirt && this.props.uniform.daywear_shirt.chest,
        daywearShirtSleeveLength: this.props.uniform && this.props.uniform.daywear_shirt && this.props.uniform.daywear_shirt.sleeve_length,
        daywearShirtWaist: this.props.uniform && this.props.uniform.daywear_shirt && this.props.uniform.daywear_shirt.waist,
        daywearShirtCollar: this.props.uniform && this.props.uniform.daywear_shirt && this.props.uniform.daywear_shirt.collar,
        daywearShirtLength: this.props.uniform && this.props.uniform.daywear_shirt && this.props.uniform.daywear_shirt.length,
        // Sports T-Shirt
        sportsTshirtAcrossShoulder: this.props.uniform && this.props.uniform.sports_tshirt && this.props.uniform.sports_tshirt.across_shoulder,
        sportsTshirtChest: this.props.uniform && this.props.uniform.sports_tshirt && this.props.uniform.sports_tshirt.chest,
        sportsTshirtSleeveLength: this.props.uniform && this.props.uniform.sports_tshirt && this.props.uniform.sports_tshirt.sleeve_length,
        sportsTshirtWaist: this.props.uniform && this.props.uniform.sports_tshirt && this.props.uniform.sports_tshirt.waist,
        sportsTshirtCollar: this.props.uniform && this.props.uniform.sports_tshirt && this.props.uniform.sports_tshirt.collar,
        sportsTshirtLength: this.props.uniform && this.props.uniform.sports_tshirt && this.props.uniform.sports_tshirt.length

      })
    }
  }
  handleShirtChange = (event) => {
    this.setState({ shirtCheck: event.target.checked })
  }
  handleDaywearShirtChange = (event) => {
    this.setState({ daywearShirtCheck: event.target.checked })
  }
  handleSportsTshirtChange = (event) => {
    this.setState({ sportsTshirtCheck: event.target.checked })
  }
  handlePantChange = (event) => {
    this.setState({ pantCheck: event.target.checked })
  }
  handleDenimShortChange = (event) => {
    this.setState({ denimShortCheck: event.target.checked })
  }
  sportsTs
  handleSportTrackPantChange= (event) => {
    this.setState({ sportTrackPantCheck: event.target.checked })
  }

  handleChangeIndex = index => {
    this.setState({ value: index })
  }

  handleAcademicyear = (e) => {
    // console.log('current session: ', e.target.value)
    this.setState({
      session: e,
      getData: false
    }, () => {
      this.props.fetchGrades(this.state.session.value, this.props.alert, this.props.user)
    })
  }

  gradeHandler = (e) => {
    this.setState({ gradeId: e.value, gradeData: e, sectionData: [] }, () => {
      if (this.state.gradeId === 'all') {
        this.setState({
          allSections: true,
          sectionId: 'all',
          getData: false
        })
      } else {
        this.props.fetchAllSections(this.state.session.value, this.state.gradeId, this.props.alert, this.props.user)
        this.setState({
          allSections: false,
          getData: false
        })
      }
    })
  }

  sectionHandler = (e) => {
    let sectionIds = []
    e.forEach(section => {
      sectionIds.push(section.value)
    })
    this.setState({ sectionId: sectionIds, sectionData: e, getData: false })
  }

  allSectionHandler = (e) => {
    this.setState({ sectionId: e.target.value, sectionData: e, getData: false })
  }

  searchTypeHandler = (e) => {
    this.setState({
      searchTypeData: e,
      searchTypeId: e.value,
      getData: false,
      showTabs: false,
      studentName: ''
    }, () => {
      this.props.clearAllProps()
    })
  }

  uniformUpdateHandler = (e) => {
    this.setState({ modelOpen: !this.state.modelOpen })
    // winter wear shirt
    var overallSize = []
    let chest = defaultUniformShirt.chest
    console.log('chest', chest)
    for (let i = 0; i < chest.length; i++) {
      if (chest[i] < this.state.chest) {
        console.log('yes')
      } else {
        console.log('your size will be: ', chest[i])
        this.setState({ updatedChest: chest[i] })
        this.setState({ overallChestSize: i * 2 + 2 })
        console.log('overallchestsize', i * 2 + 2)
        overallSize.push(i * 2 + 2)
        break
      }
    }

    let length = defaultUniformShirt.length
    console.log('length', length)
    for (let i = 0; i < length.length; i++) {
      if (length[i] < this.state.length) {
        console.log('yes')
      } else {
        console.log('your size will be: ', length[i])
        this.setState({ overallShirtLength: i * 2 + 2 })
        this.setState({ updatedLength: length[i] })
        overallSize.push(i * 2 + 2)
        break
      }
    }

    let sleeveLength = defaultUniformShirt.sleeveLength
    console.log('Sleeve Length', sleeveLength)
    for (let i = 0; i < sleeveLength.length; i++) {
      if (sleeveLength[i] < this.state.sleeveLength) {
        console.log('yes')
      } else {
        console.log('your size will be: ', sleeveLength[i])
        this.setState({ overallSleeveLength: i * 2 + 2 })
        this.setState({ updatedSleeveLength: sleeveLength[i] })
        overallSize.push(i * 2 + 2)
        break
      }
    }

    let shoulder = defaultUniformShirt.shoulder
    console.log('Shoulder', shoulder)
    for (let i = 0; i < shoulder.length; i++) {
      if (shoulder[i] < this.state.acrossShoulder) {
        console.log('yes')
      } else {
        console.log('your size will be: ', shoulder[i])
        this.setState({ overallAcrossShoulder: i * 2 + 2 })
        this.setState({ updatedAcrossShoulder: shoulder[i] })
        overallSize.push(i * 2 + 2)
        break
      }
    }
    const overallMax = Math.max(...overallSize)
    console.log('overallSize', overallMax)
    this.setState({ overallShirtSize: overallMax })

    // Daywear Shirt
    var overallDaywearShirtSize = []
    console.log('chest', defaultDaywearShirt.chest)
    for (let i = 0; i < defaultDaywearShirt.chest.length; i++) {
      if (defaultDaywearShirt.chest[i] < this.state.daywearShirtChest) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDaywearShirt.chest[i])
        overallDaywearShirtSize.push(i)
        break
      }
    }

    console.log('length', defaultDaywearShirt.length)
    for (let i = 0; i < defaultDaywearShirt.length.length; i++) {
      if (defaultDaywearShirt.length[i] < this.state.daywearShirtLength) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDaywearShirt.length[i])
        overallDaywearShirtSize.push(i)
        break
      }
    }

    console.log('Sleeve Length', defaultDaywearShirt.sleeveLength)
    for (let i = 0; i < defaultDaywearShirt.sleeveLength.length; i++) {
      if (defaultDaywearShirt.sleeveLength[i] < this.state.daywearShirtSleeveLength) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDaywearShirt.sleeveLength[i])
        overallDaywearShirtSize.push(i)
        break
      }
    }

    console.log('Shoulder', defaultDaywearShirt.shoulder)
    for (let i = 0; i < defaultDaywearShirt.shoulder.length; i++) {
      if (defaultDaywearShirt.shoulder[i] < this.state.daywearShirtAcrossShoulder) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDaywearShirt.shoulder[i])
        overallDaywearShirtSize.push(i)
        break
      }
    }
    const overallDaywearShirtMax = Math.max(...overallDaywearShirtSize)
    console.log('overallSize', overallDaywearShirtMax)
    this.setState({ overallDaywearShirtSize: overallDaywearShirtMax })

    // Sport-T-Shirt
    var overallSportsTshirtSize = []
    console.log('chest', defaultSportsTshirt.chest)
    for (let i = 0; i < defaultSportsTshirt.chest.length; i++) {
      if (defaultSportsTshirt.chest[i] < this.state.sportsTshirtChest) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultSportsTshirt.chest[i])
        overallSportsTshirtSize.push(i * 2 + 2)
        break
      }
    }

    console.log('length', defaultSportsTshirt.length)
    for (let i = 0; i < defaultSportsTshirt.length.length; i++) {
      if (defaultSportsTshirt.length[i] < this.state.sportsTshirtLength) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultSportsTshirt.length[i])
        overallSportsTshirtSize.push(i * 2 + 2)
        break
      }
    }

    console.log('Collar', defaultSportsTshirt.collar)
    for (let i = 0; i < defaultSportsTshirt.collar.length; i++) {
      if (defaultSportsTshirt.collar[i] < this.state.sportsTshirtCollar) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultSportsTshirt.collar[i])
        overallSportsTshirtSize.push(i * 2 + 2)
        break
      }
    }

    console.log('Shoulder', defaultSportsTshirt.shoulder)
    for (let i = 0; i < defaultSportsTshirt.shoulder.length; i++) {
      if (defaultSportsTshirt.shoulder[i] < this.state.sportsTshirtAcrossShoulder) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultSportsTshirt.shoulder[i])
        overallSportsTshirtSize.push(i * 2 + 2)
        break
      }
    }
    const overallSportsTshirtMax = Math.max(...overallSportsTshirtSize)
    console.log('overallSize', overallSportsTshirtMax)
    this.setState({ overallSportsTshirtSize: overallSportsTshirtMax })

    // Denim Pant
    const overallSizeDenimPant = []
    console.log('denimPantLength', defaultDenimPant.length.length)
    for (let i = 0; i < defaultDenimPant.length.length; i++) {
      if (defaultDenimPant.length[i] < this.state.denimPantOutseamLength) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDenimPant.length[i])
        overallSizeDenimPant.push(i * 2 + 2)
        break
      }
    }

    console.log('denimPantWaist', defaultDenimPant.waist.length)
    for (let i = 0; i < defaultDenimPant.waist.length; i++) {
      if (defaultDenimPant.waist[i] < this.state.denimPantWaist) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDenimPant.waist[i])
        overallSizeDenimPant.push(i * 2 + 2)
        break
      }
    }
    const overallMaxDenimPant = Math.max(...overallSizeDenimPant)
    console.log('overallDenimPantSize', overallMaxDenimPant)
    this.setState({ overallDenimPantSize: overallMaxDenimPant })

    // Denim Short
    const overallSizeDenimShort = []
    console.log('denimShortLength', defaultDenimShort.length.length)
    for (let i = 0; i < defaultDenimShort.length.length; i++) {
      if (defaultDenimShort.length[i] < this.state.denimShortOutseamLength) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDenimShort.length[i])
        overallSizeDenimShort.push(i)
        break
      }
    }

    console.log('denimShortWaist', defaultDenimShort.waist.length)
    for (let i = 0; i < defaultDenimShort.waist.length; i++) {
      if (defaultDenimShort.waist[i] < this.state.denimShortWaist) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultDenimShort.waist[i])
        overallSizeDenimShort.push(i)
        break
      }
    }
    const overallMaxDenimShort = Math.max(...overallSizeDenimShort)
    console.log('overallDenimPantSize', overallMaxDenimShort)
    this.setState({ overallDenimShortSize: overallMaxDenimShort })

    // Sport Track Pant
    const overallSizeSportTrackPant = []
    console.log('sportTrackPantLength', defaultSportTrackPant.length.length)
    for (let i = 0; i < defaultSportTrackPant.length.length; i++) {
      if (defaultSportTrackPant.length[i] < this.state.sportTrackPantOutseamLength) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultSportTrackPant.length[i])
        // overallSizeSportTrackPant.push(i * 2 + 2)
        overallSizeSportTrackPant.push(i)
        break
      }
    }

    console.log('sportTrackPantWaist', defaultSportTrackPant.waist.length)
    for (let i = 0; i < defaultSportTrackPant.waist.length; i++) {
      if (defaultSportTrackPant.waist[i] < this.state.sportTrackPantWaist) {
        console.log('yes')
      } else {
        console.log('your size will be: ', defaultSportTrackPant.waist[i])
        // overallSizeSportTrackPant.push(i * 2 + 2)
        overallSizeSportTrackPant.push(i)
        break
      }
    }
    const overallMaxSportTrackPant = Math.max(...overallSizeSportTrackPant)
    console.log('overallDenimPantSize', overallMaxSportTrackPant)
    this.setState({ overallSportTrackPantSize: overallMaxSportTrackPant })
  }

  erpHandler = () => {
    // const erp = document.querySelectorAll('[name=searchBox]')
    if (this.state.searchTypeData.value === 1 && this.state.selectedErpStatus) {
      this.props.fetchAllPayment(this.state.session.value, this.state.studentLabel, this.props.user, this.props.alert)
    } else if (this.state.searchTypeData.value === 2 && this.state.selectedNameStatus) {
      this.props.fetchAllPayment(this.state.session.value, this.state.studentErp, this.props.user, this.props.alert)
    } else {
      this.props.alert.warning('Select Valid Erp')
    }
    // makePayState = this.state
  }

  myErpFunc = debounce(() => {
    this.props.fetchErpSuggestions(
      'erp',
      this.state.session.value,
      this.state.gradeId,
      this.state.sectionId,
      this.state.studentTypeData.value,
      this.state.student,
      this.props.alert,
      this.props.user
    )
  }, 500)

  studentErpChangeHandler = (e, selected) => {
    this.setState({ student: e.target.value, studentLabel: e.target.label, selectedErpStatus: selected, showTabs: false, getData: false }, () => {
      if (this.state.student.length >= 3) {
        this.myErpFunc()
      }
    })
    if (this.state.selectedNameStatus || this.state.selectedErpStatus) {
      this.setState({
        showTabs: false,
        getData: false
      })
    }
  }

  myStudentFun = debounce(() => {
    const { searchTypeId } = this.state
    this.props.fetchErpSuggestions(
      searchTypeId === 2 ? 'student' : searchTypeId === 3 ? 'fatherName' : searchTypeId === 4 ? 'fatherNo' : searchTypeId === 5 ? 'motherName' : searchTypeId === 6 ? 'motherNo' : 'na',
      this.state.session.value,
      this.state.gradeId,
      this.state.sectionId,
      this.state.studentTypeData.value,
      this.state.studentName,
      this.props.alert,
      this.props.user
    )
  }, 500)

  studentNameChangeHandler = (e, selected) => {
    this.setState({ studentName: e.target.value, selectedNameStatus: selected, showTabs: false, getData: false }, () => {
      const student = this.props.ErpSuggestions && this.props.ErpSuggestions.length > 0 ? this.props.ErpSuggestions.filter(item => item.name === this.state.studentName)[0] : ''
      this.setState({
        studentErp: student && student.erp ? student.erp : null
      })
      if (this.state.studentName.length >= 3) {
        this.myStudentFun()
      }
    })
  }
  showLedgerHandler = () => {
    if (!this.state.session && !this.state.studentErp) {
      this.props.alert.warning('Please Fill All The Fields')
      return
    }
    if (this.state.selectedNameStatus || this.state.selectedErpStatus) {
      this.setState({
        showTabs: true,
        getData: true
      })
    } else {
      this.props.alert.warning('Select Valid Student')
    }
    this.props.uniformDetails(this.state.student, this.state.isStoreManager, this.props.alert, this.props.user)
    this.setState({ showUniformDetails: true })
  }

  activeHandler = (e) => {
    this.setState({
      // studentTypeId: e.value,
      studentTypeData: e,
      getData: false
    })
  }
  shirtImageHandeler = (e) => {
    if (this.state.showShirt) {
      this.setState({ showShirt: false })
    } else {
      this.setState({ showShirt: true })
    }
  }
  pantImageHandeler = (e) => {
    if (this.state.showPant) {
      this.setState({ showPant: false })
    } else {
      this.setState({ showPant: true })
    }
  }
  denimShortImageHandeler = (e) => {
    if (this.state.showDenimShort) {
      this.setState({ showDenimShort: false })
    } else {
      this.setState({ showDenimShort: true })
    }
  }
  daywearShirtImageHandeler = (e) => {
    if (this.state.showDaywearShirt) {
      this.setState({ showDaywearShirt: false })
    } else {
      this.setState({ showDaywearShirt: true })
    }
  }
  sportTshirtImageHandeler = (e) => {
    if (this.state.showSportsTshirt) {
      this.setState({ showSportsTshirt: false })
    } else {
      this.setState({ showSportsTshirt: true })
    }
  }
  sportsTshirtImageHandeler = (e) => {
    if (this.state.showSportsTshirt) {
      this.setState({ showSportsTshirt: false })
    } else {
      this.setState({ showSportsTshirt: true })
    }
  }
  sportTrackPantImageHandeler = (e) => {
    if (this.state.showSportTrackPant) {
      this.setState({ showSportTrackPant: false })
    } else {
      this.setState({ showSportTrackPant: true })
    }
  }
  // winter wear
  collarHandler = (e) => {
    this.setState({ collar: e.target.value })
  }
  acrossShoulderHandler = (e) => {
    this.setState({ acrossShoulder: e.target.value })
  }
  chestHandler = (e) => {
    this.setState({ chest: e.target.value })
  }
  sleeveLengthHandler = (e) => {
    this.setState({ sleeveLength: e.target.value })
  }
  waistHandler = (e) => {
    this.setState({ waist: e.target.value })
  }
  lengthHandler = (e) => {
    this.setState({ length: e.target.value })
  }
  // DayWear shirt
  daywearShirtCollarHandler = (e) => {
    this.setState({ daywearShirtCollar: e.target.value })
  }
  daywearShirtAcrossShoulderHandler = (e) => {
    this.setState({ daywearShirtAcrossShoulder: e.target.value })
  }
  daywearShirtChestHandler = (e) => {
    this.setState({ daywearShirtChest: e.target.value })
  }
  daywearShirtSleeveLengthHandler = (e) => {
    this.setState({ daywearShirtSleeveLength: e.target.value })
  }
  daywearShirtWaistHandler = (e) => {
    this.setState({ daywearShirtWaist: e.target.value })
  }
  daywearShirtLengthHandler = (e) => {
    this.setState({ daywearShirtLength: e.target.value })
  }

  // Sports t-shirt
  sportsTshirtCollarHandler = (e) => {
    this.setState({ sportsTshirtCollar: e.target.value })
  }
  sportsTshirtAcrossShoulderHandler = (e) => {
    this.setState({ sportsTshirtAcrossShoulder: e.target.value })
  }
  sportsTshirtChestHandler = (e) => {
    this.setState({ sportsTshirtChest: e.target.value })
  }
  sportsTshirtSleeveLengthHandler = (e) => {
    this.setState({ sportsTshirtSleeveLength: e.target.value })
  }
  sportsTshirtWaistHandler = (e) => {
    this.setState({ sportsTshirtWaist: e.target.value })
  }
  sportsTshirtLengthHandler = (e) => {
    this.setState({ sportsTshirtLength: e.target.value })
  }

  // denim pant

  denimPantWaistHandler = (e) => {
    this.setState({ denimPantWaist: e.target.value })
  }
  denimPantRiseHandler = (e) => {
    this.setState({ denimPantRise: e.target.value })
  }
  denimPantThighHandler = (e) => {
    this.setState({ denimPantThigh: e.target.value })
  }
  denimPantOutseamLengthHandler = (e) => {
    this.setState({ denimPantOutseamLength: e.target.value })
  }
  denimPantBottomHemHandler = (e) => {
    this.setState({ denimPantBottomHem: e.target.value })
  }
  denimPantInseamLengthHandler = (e) => {
    this.setState({ denimPantInseamLength: e.target.value })
  }
  // denim short
  denimShortWaistHandler = (e) => {
    this.setState({ denimShortWaist: e.target.value })
  }
  denimShortRiseHandler = (e) => {
    this.setState({ denimShortRise: e.target.value })
  }
  denimShortThighHandler = (e) => {
    this.setState({ denimShortThigh: e.target.value })
  }
  denimShortOutseamLengthHandler = (e) => {
    this.setState({ denimShortOutseamLength: e.target.value })
  }
  denimShortBottomHemHandler = (e) => {
    this.setState({ denimShortBottomHem: e.target.value })
  }
  denimShortInseamLengthHandler = (e) => {
    this.setState({ denimShortInseamLength: e.target.value })
  }
  // Sport track Pant
  sportTrackPantWaistHandler = (e) => {
    this.setState({ sportTrackPantWaist: e.target.value })
  }
  sportTrackPantRiseHandler = (e) => {
    this.setState({ sportTrackPantRise: e.target.value })
  }
  sportTrackPantThighHandler = (e) => {
    this.setState({ sportTrackPantThigh: e.target.value })
  }
  sportTrackPantOutseamLengthHandler = (e) => {
    this.setState({ sportTrackPantOutseamLength: e.target.value })
  }
  sportTrackPantBottomHemHandler = (e) => {
    this.setState({ sportTrackPantBottomHem: e.target.value })
  }
  sportTrackPantInseamLengthHandler = (e) => {
    this.setState({ sportTrackPantInseamLength: e.target.value })
  }

  updateUniform = (e) => {
    if (this.state.shirtCheck || this.state.pantCheck || this.state.denimShortCheck || this.state.sportTrackPantCheck || this.state.daywearShirtCheck || this.state.sportsTshirtCheck) {
      const data = {
        // winter wear
        id: this.props.uniform.id,
        is_shirt_size_changed: this.state.shirtCheck,
        chest: defaultUniformShirt.chest[(this.state.overallShirtSize - 2) / 2],
        length: defaultUniformShirt.length[(this.state.overallShirtSize - 2) / 2],
        across_shoulder: defaultUniformShirt.shoulder[(this.state.overallShirtSize - 2) / 2],
        sleeve_length: defaultUniformShirt.sleeveLength[(this.state.overallShirtSize - 2) / 2],
        collar: this.state.collar,
        waist: this.state.waist,
        overall_shirt_size: this.state.overallShirtSize,
        // Denim Pant
        is_denim_pant_size_changed: this.state.pantCheck,
        overall_denim_pant_size: this.state.overallDenimPantSize,
        denim_pant_waist: defaultDenimPant.waist[(this.state.overallDenimPantSize - 2) / 2],
        denim_pant_rise: this.state.denimPantRise,
        denim_pant_thigh: this.state.denimPantThigh,
        denim_pant_outseam_length: defaultDenimPant.length[(this.state.overallDenimPantSize - 2) / 2],
        denim_pant_bottom_hem: this.state.denimPantBottomHem,
        denim_pant_inseam_length: this.state.denimPantInseamLength,
        // Denim short
        is_denim_short_size_changed: this.state.denimShortCheck,
        overall_denim_short_size: defaultDenimShort.index[(this.state.overallDenimShortSize)],
        denim_short_waist: defaultDenimShort.waist[(this.state.overallDenimShortSize)],
        denim_short_rise: this.state.denimShortRise,
        denim_short_thigh: this.state.denimShortThigh,
        denim_short_outseam_length: defaultDenimShort.length[(this.state.overallDenimShortSize)],
        denim_short_bottom_hem: this.state.denimShortBottomHem,
        denim_short_inseam_length: this.state.denimShortInseamLength,
        // Sport Track Pant
        is_sport_track_pant_size_changed: this.state.sportTrackPantCheck,
        overall_sport_track_pant_size: defaultSportTrackPant.index[(this.state.overallSportTrackPantSize)],
        sport_track_pant_waist: defaultSportTrackPant.waist[(this.state.overallSportTrackPantSize)],
        sport_track_pant_rise: this.state.sportTrackPantRise,
        sport_track_pant_thigh: this.state.sportTrackPantThigh,
        sport_track_pant_outseam_length: defaultSportTrackPant.length[(this.state.overallSportTrackPantSize)],
        sport_track_pant_bottom_hem: this.state.sportTrackPantBottomHem,
        sport_track_pant_inseam_length: this.state.sportTrackPantInseamLength,
        // Daywear Shirt
        is_daywear_shirt_size_changed: this.state.daywearShirtCheck,
        daywear_shirt_chest: defaultDaywearShirt.chest[(this.state.overallDaywearShirtSize)],
        daywear_shirt_length: defaultDaywearShirt.length[(this.state.overallDaywearShirtSize)],
        daywear_shirt_across_shoulder: defaultDaywearShirt.shoulder[(this.state.overallDaywearShirtSize)],
        daywear_shirt_sleeve_length: defaultDaywearShirt.sleeveLength[(this.state.overallDaywearShirtSize)],
        daywear_shirt_collar: this.state.daywearShirtCollar,
        daywear_shirt_waist: this.state.daywearShirtWaist,
        overall_daywear_shirt_size: defaultDaywearShirt.index[(this.state.overallDaywearShirtSize)],
        // Sports t-shirt
        is_sports_tshirt_size_changed: this.state.sportsTshirtCheck,
        sports_tshirt_chest: defaultSportsTshirt.chest[(this.state.overallSportsTshirtSize - 2) / 2],
        sports_tshirt_length: defaultSportsTshirt.length[(this.state.overallSportsTshirtSize - 2) / 2],
        sports_tshirt_across_shoulder: defaultSportsTshirt.shoulder[(this.state.overallSportsTshirtSize - 2) / 2],
        sports_tshirt_sleeve_length: this.state.sportsTshirtSleeveLength,
        sports_tshirt_collar: defaultSportsTshirt.collar[(this.state.overallSportsTshirtSize - 2) / 2],
        sports_tshirt_waist: this.state.sportsTshirtWaist,
        overall_sports_tshirt_size: this.state.overallSportsTshirtSize
      }
      this.props.uniformDetailsUpdate(data, this.props.alert, this.props.user)
    }
    this.setState({ modelOpen: false })
  }
  render () {
    let sectionRow = null
    if (this.state.allSections) {
      sectionRow = 'All Sections'
    } else {
      sectionRow = (
        <Select
          placeholder='Select Section'
          isMulti
          disabled={this.state.allSections}
          value={this.state.sectionData ? this.state.sectionData : ''}
          options={
            this.props.sectionData
              ? this.props.sectionData.map(sec => ({
                value: sec.section.id,
                label: sec.section.section_name
              }))
              : []
          }
          onChange={this.sectionHandler}
        />
      )
    }

    // auto suggestions dropdown
    const { searchTypeData, searchTypeId } = this.state
    let searchBox = null
    if (searchTypeData.value === 1) {
      searchBox = (
        <div style={{ position: 'relative', marginLeft: '33px' }}>
          <label style={{ display: 'block' }}>Search*</label>
          <AutoSuggest
            label='Search ERP'
            style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.student || ''}
            onChange={this.studentErpChangeHandler}
            margin='dense'
            variant='outlined'
            data={this.props.ErpSuggestions && this.props.ErpSuggestions.length > 0 ? this.props.ErpSuggestions.map(item => ({ value: item.erp ? item.erp : '', label: item.erp ? item.erp : '' })) : []}
          />
        </div>
      )
    } else {
      searchBox = (
        <div style={{ position: 'relative', marginLeft: '33px' }}>
          <label style={{ display: 'block' }}>Search*</label>
          <AutoSuggest
            label={searchTypeId === 2 ? 'Search Student Name' : searchTypeId === 3 ? 'Search Father Name' : searchTypeId === 4 ? 'Search Father Number' : searchTypeId === 5 ? 'Search Mother Name' : searchTypeId === 6 ? 'Search Mother Number' : 'na'}
            style={{ display: 'absolute', top: '10px', width: '240px' }}
            value={this.state.studentName || ''}
            onChange={this.studentNameChangeHandler}
            margin='dense'
            variant='outlined'
            data={this.props.ErpSuggestions && this.props.ErpSuggestions.length > 0 ? this.props.ErpSuggestions.map(item => ({ value: item.name ? item.name : '', label: item.name ? item.name : '' })) : []}
          />
        </div>
      )
    }
    return (
      <React.Fragment>
        <Modal
          open={this.state.modelOpen}
          style={{ height: '300px', width: '320px', justifyItems: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', margin: 'auto' }}
          onClose={() => this.setState({ modelOpen: false })}
        >
          <React.Fragment>
            <Grid container direction='column' spacing='3' style={{ height: '300px', width: '320px' }}>
              <Grid container spacing='3' style={{ background: 'white', overflowY: 'scroll' }}>
                <p style={{ fontSize: '16px' }}># Do you want to proceed with these sizes.</p>
                {this.state.shirtCheck
                  ? <Grid item xs='14' style={{ fontSize: '14px' }}>
                    <p style={{ textDecoration: 'underline' }}><b>Winter Wear</b></p>
                    <p>Overall Size: {this.state.overallShirtSize} </p>
                    <p>Chest : {defaultUniformShirt.chest[(this.state.overallShirtSize - 2) / 2]}</p>
                    <p>Length : {defaultUniformShirt.length[(this.state.overallShirtSize - 2) / 2]}</p>
                    <p>Sleeve Length : {defaultUniformShirt.sleeveLength[(this.state.overallShirtSize - 2) / 2]}</p>
                    <p>Shoulder : {defaultUniformShirt.shoulder[(this.state.overallShirtSize - 2) / 2]}</p>
                  </Grid>
                  : [] }
                {this.state.daywearShirtCheck
                  ? <Grid item xs='14' style={{ fontSize: '14px' }}>
                    <p style={{ textDecoration: 'underline' }}><b> Daywear shirt</b></p>
                    <p>Overall Size: {defaultDaywearShirt.index[(this.state.overallDaywearShirtSize)]} </p>
                    <p>Chest : {defaultDaywearShirt.chest[(this.state.overallDaywearShirtSize)]}</p>
                    <p>Length : {defaultDaywearShirt.length[(this.state.overallDaywearShirtSize)]}</p>
                    <p>Sleeve Length : {defaultDaywearShirt.sleeveLength[(this.state.overallDaywearShirtSize)]}</p>
                    <p>Shoulder : {defaultDaywearShirt.shoulder[(this.state.overallDaywearShirtSize)]}</p>
                  </Grid>
                  : [] }
                {this.state.sportsTshirtCheck
                  ? <Grid item xs='14' style={{ fontSize: '14px' }}>
                    <p style={{ textDecoration: 'underline' }}><b> Sports T-Shirt</b></p>
                    <p>Overall Size: {this.state.overallSportsTshirtSize} </p>
                    <p>Chest : {defaultSportsTshirt.chest[(this.state.overallSportsTshirtSize - 2) / 2]}</p>
                    <p>Length : {defaultSportsTshirt.length[(this.state.overallSportsTshirtSize - 2) / 2]}</p>
                    <p>Collar : {defaultSportsTshirt.collar[(this.state.overallSportsTshirtSize - 2) / 2]}</p>
                    <p>Shoulder : {defaultSportsTshirt.shoulder[(this.state.overallSportsTshirtSize - 2) / 2]}</p>
                  </Grid>
                  : [] }
                {this.state.pantCheck
                  ? <Grid item xs='12' style={{ fontSize: '14px' }}>
                    <p style={{ textDecoration: 'underline' }}><b>Denim Pant</b></p>
                    <p>Overall Size: {this.state.overallDenimPantSize} </p>
                    <p>waist : {defaultDenimPant.waist[(this.state.overallDenimPantSize - 2) / 2]}</p>
                    <p>Outseam Length : {defaultDenimPant.length[(this.state.overallDenimPantSize - 2) / 2]}</p>
                  </Grid>
                  : [] }
                {this.state.denimShortCheck
                  ? <Grid item xs='12' style={{ fontSize: '14px' }}>
                    <p style={{ textDecoration: 'underline' }}><b>Denim Short</b></p>
                    <p>Overall Size: {defaultDenimShort.index[(this.state.overallDenimShortSize)]} </p>
                    <p>waist : {defaultDenimShort.waist[(this.state.overallDenimShortSize)]}</p>
                    <p>Outseam Length : {defaultDenimShort.length[(this.state.overallDenimShortSize)]}</p>
                  </Grid>
                  : [] }
                {this.state.sportTrackPantCheck
                  ? <Grid item xs='12' style={{ fontSize: '14px' }}>
                    <p style={{ textDecoration: 'underline' }}><b>Sport Track Pant</b></p>
                    <p>Overall Size: { defaultSportTrackPant.index[(this.state.overallSportTrackPantSize)]} </p>
                    <p>waist : {defaultSportTrackPant.waist[(this.state.overallSportTrackPantSize)]}</p>
                    <p>Outseam Length : {defaultSportTrackPant.length[(this.state.overallSportTrackPantSize)]}</p>
                  </Grid>
                  : [] }
                <Grid item xs='12' justify='center' style={{ background: 'white' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => this.setState({ modelOpen: false })}>
                      CLOSE
                  </Button>
                  <Button
                    style={{ marginLeft: '15px' }}
                    variant='contained'
                    color='primary'
                    onClick={this.updateUniform}>
                      PROCEED
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        </Modal>
        {this.state.isStoreManager
          ? <Grid container spacing={3} style={{ padding: 15 }}>
            <Grid item xs={3} style={{ zIndex: '1103' }}>
              <label>Academic Year*</label>
              <Select
                placeholder='Select Year'
                value={this.state.session ? this.state.session : null}
                options={
                  this.props.session
                    ? this.props.session.session_year.map(session => ({
                      value: session,
                      label: session
                    }))
                    : []
                }
                onChange={this.handleAcademicyear}
              />
            </Grid>
            <Grid item xs={3} style={{ zIndex: '1102' }}>
              <label>Grade*</label>
              <Select
                placeholder='Select Grade'
                value={this.state.gradeData ? this.state.gradeData : null}
                options={
                  this.props.gradeData
                    ? this.props.gradeData.map(grades => ({
                      value: grades.grade.id,
                      label: grades.grade.grade
                    }))
                    : []
                }
                onChange={this.gradeHandler}
              />
            </Grid>
            <Grid item xs={3} style={{ zIndex: '1101' }}>
              <label>Section*</label>
              {sectionRow}
            </Grid>
            <Grid item xs={3} style={{ zIndex: '1100' }}>
              <label>Active/Inactive*</label>
              <Select
                placeholder='Select State'
                value={this.state.studentTypeData ? this.state.studentTypeData : ''}
                options={[
                  {
                    label: 'Active',
                    value: 1
                  },
                  {
                    label: 'InActive',
                    value: 2
                  },
                  {
                    label: 'Both',
                    value: 3
                  }
                ]}
                onChange={this.activeHandler}
              />
            </Grid>
            <Grid item xs={3} style={{ zIndex: '1000' }}>
              <label>Search Type*</label>
              <Select
                placeholder='Select Type'
                value={this.state.searchTypeData ? this.state.searchTypeData : ''}
                options={[
                  {
                    label: 'ERP',
                    value: 1
                  },
                  {
                    label: 'Student Name',
                    value: 2
                  },
                  {
                    label: 'Father Name',
                    value: 3
                  },
                  {
                    label: 'Father Number',
                    value: 4
                  },
                  {
                    label: 'Mother Name',
                    value: 5
                  },
                  {
                    label: 'Mother Number',
                    value: 6
                  }
                ]}
                onChange={this.searchTypeHandler}
              />
            </Grid>
            <Grid item xs={3}>
              {searchBox}
            </Grid>
            <Grid item xs={2} >
              <Button
                style={{ marginLeft: '10px', marginTop: '20px' }}
                variant='contained'
                color='primary'
                disabled={!this.state.session}
                // onClick={this.erpHandler}
                onClick={this.showLedgerHandler}>
              GET
              </Button>
            </Grid>
            {this.state.searchTypeData.value === 1
              ? <Student erp={this.state.studentLabel} session={this.state.session.value} user={this.props.user} alert={this.props.alert} />
              : <Student erp={this.state.studentErp} session={this.state.session.value} user={this.props.user} alert={this.props.alert} />}
            {this.props.dataLoading ? <CircularProgress open /> : null}
          </Grid>
          : []}
        {this.state.showUniformDetails || !this.state.isStoreManager
          ? <React.Fragment>
            <Grid container spacing={3} style={{ padding: '15px' }}>
              <Grid item xs='2' style={{ fontSize: 18 }}>Winter Wear</Grid>
              <Grid item xs='1'style={{ marginBottom: 10 }}>  <Checkbox
                checked={this.state.shirtCheck}
                onChange={this.handleShirtChange}
                value='primary'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              /></Grid>
              <Grid item xs='2'>
                <Button variant='outlined' color='primary' onClick={this.shirtImageHandeler}>
              Image
                </Button>
              </Grid>
              {this.state.showShirt
                ? <Grid item xs='4'>
                  <div style={{ height: '300px', width: '300px' }}><img style={{ height: '300px', width: '300px' }} src={shirt} alt='logo' /></div>
                </Grid>
                : [] }
            </Grid>
            {this.state.shirtCheck
              ? <Grid container direction='row' spacing={3} style={{ padding: '10px' }}>
                <Grid item xs='4'> <TextField
                  label='Collar'
                  id='winter-wear-collar'
                  value={this.state.collar}
                  onChange={this.collarHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Across Shoulder'
                  id='winter-wear-across-shoulder'
                  value={this.state.acrossShoulder}
                  onChange={this.acrossShoulderHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Chest'
                  id='winter-wear-chest'
                  value={this.state.chest}
                  onChange={this.chestHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Sleeve Length'
                  id='winter-wear-sleeve-length'
                  value={this.state.sleeveLength}
                  onChange={this.sleeveLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Waist'
                  id='winter-wear-waist'
                  value={this.state.waist}
                  onChange={this.waistHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Length'
                  id='winter-wear-length'
                  value={this.state.length}
                  onChange={this.lengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
              </Grid>
              : []}
            <Grid container spacing={3} style={{ padding: '15px' }}>
              <Grid item xs='2' style={{ fontSize: 18 }}> Daywear Shirt</Grid>
              <Grid item xs='1'style={{ marginBottom: 10 }}>  <Checkbox
                checked={this.state.daywearShirtCheck}
                onChange={this.handleDaywearShirtChange}
                value='primary'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              /></Grid>
              <Grid item xs='2'>
                <Button variant='outlined' color='primary' onClick={this.daywearShirtImageHandeler}>
              Image
                </Button>
              </Grid>
              {this.state.showDaywearShirt
                ? <Grid item xs='4'>
                  <div style={{ height: '300px', width: '300px' }}><img style={{ height: '300px', width: '300px' }} src={shirt} alt='logo' /></div>
                </Grid>
                : [] }
            </Grid>
            {this.state.daywearShirtCheck
              ? <Grid container direction='row' spacing={3} style={{ padding: '10px' }}>
                <Grid item xs='4'> <TextField
                  label='Collar'
                  id='daywear-shirt-collar'
                  value={this.state.daywearShirtCollar}
                  onChange={this.daywearShirtCollarHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Across Shoulder'
                  id='daywear-shirt-across-shoulder'
                  value={this.state.daywearShirtAcrossShoulder}
                  onChange={this.daywearShirtAcrossShoulderHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Chest'
                  id='daywear-shirt-chest'
                  value={this.state.daywearShirtChest}
                  onChange={this.daywearShirtChestHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Sleeve Length'
                  id='daywear-shirt-sleeve-length'
                  value={this.state.daywearShirtSleeveLength}
                  onChange={this.daywearShirtSleeveLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Waist'
                  id='daywear-shirt-waist'
                  value={this.state.daywearShirtWaist}
                  onChange={this.daywearShirtWaistHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Length'
                  id='daywear-shirt-length'
                  value={this.state.daywearShirtLength}
                  onChange={this.daywearShirtLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
              </Grid>
              : []}
            <Grid container spacing={3} style={{ padding: '15px' }}>
              <Grid item xs='2' style={{ fontSize: 18 }}> Sports T-Shirt</Grid>
              <Grid item xs='1'style={{ marginBottom: 10 }}>  <Checkbox
                checked={this.state.sportsTshirtCheck}
                onChange={this.handleSportsTshirtChange}
                value='primary'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              /></Grid>
              <Grid item xs='2'>
                <Button variant='contained' color='primary' onClick={this.sportTshirtImageHandeler}>
              Image
                </Button>
              </Grid>
              {this.state.showSportsTshirt
                ? <Grid item xs='4'>
                  <div style={{ height: '300px', width: '300px' }}><img style={{ height: '300px', width: '300px' }} src={shirt} alt='logo' /></div>
                </Grid>
                : [] }
            </Grid>
            {this.state.sportsTshirtCheck
              ? <Grid container direction='row' spacing={3} style={{ padding: '10px' }}>
                <Grid item xs='4'> <TextField
                  label='Collar'
                  id='sports-tshirt-collar'
                  value={this.state.sportsTshirtCollar}
                  onChange={this.sportsTshirtCollarHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Across Shoulder'
                  id='sports-tshirt-across-shoulder'
                  value={this.state.sportsTshirtAcrossShoulder}
                  onChange={this.sportsTshirtAcrossShoulderHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Chest'
                  id='sports-tshirt-chest'
                  value={this.state.sportsTshirtChest}
                  onChange={this.sportsTshirtChestHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Sleeve Length'
                  id='sports-tshirt-sleeve-length'
                  value={this.state.sportsTshirtSleeveLength}
                  onChange={this.sportsTshirtSleeveLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Waist'
                  id='sports-tshirt-waist'
                  value={this.state.sportsTshirtWaist}
                  onChange={this.sportsTshirtWaistHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Length'
                  id='sports-tshirt-length'
                  value={this.state.sportsTshirtLength}
                  onChange={this.sportsTshirtLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
              </Grid>
              : []}
            <Grid container spacing={3} style={{ padding: '15px' }}>
              <Grid item xs='2' style={{ fontSize: 18 }}>Denim Pant</Grid>
              <Grid item xs='1' style={{ marginBottom: 10 }}>  <Checkbox
                checked={this.state.pantCheck}
                onChange={this.handlePantChange}
                value='primary'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              /></Grid>
              <Grid item xs='2'>
                <Button variant='outlined' color='primary' onClick={this.pantImageHandeler}>
              Image
                </Button>
              </Grid>
              {this.state.showPant
                ? <Grid item xs='4'>
                  <div style={{ height: '300px', width: '300px' }}><img style={{ height: '300px', width: '300px' }} src={pant} alt='logo' /></div>
                </Grid>
                : [] }
            </Grid>
            {this.state.pantCheck
              ? <Grid container direction='row' spacing={3} style={{ padding: '10px' }}>
                <Grid item xs='4'> <TextField
                  label='Waist'
                  id='denim-pant-waist'
                  value={this.state.denimPantWaist}
                  onChange={this.denimPantWaistHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Rise'
                  id='denim-pant-rise'
                  value={this.state.denimPantRise}
                  onChange={this.denimPantRiseHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Thigh'
                  id='denim-pant-thigh'
                  value={this.state.denimPantThigh}
                  onChange={this.denimPantThighHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Outseam Length'
                  id='denim-pant-outseam-length'
                  value={this.state.denimPantOutseamLength}
                  onChange={this.denimPantOutseamLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Bottom Hem'
                  id='denim-pant-bottom-hem'
                  value={this.state.denimPantBottomHem}
                  onChange={this.denimPantBottomHemHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Inseam Length'
                  id='denim-pant-inseam-length'
                  value={this.state.denimPantInseamLength}
                  onChange={this.denimPantInseamLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
              </Grid>
              : []}
            <Grid container spacing={3} style={{ padding: '15px' }}>
              <Grid item xs='2' style={{ fontSize: 18 }}>Denim Short</Grid>
              <Grid item xs='1' style={{ marginBottom: 10 }}>  <Checkbox
                checked={this.state.denimShortCheck}
                onChange={this.handleDenimShortChange}
                value='primary'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              /></Grid>
              <Grid item xs='2'>
                <Button variant='outlined' color='primary' onClick={this.denimShortImageHandeler}>
              Image
                </Button>
              </Grid>
              {this.state.showDenimShort
                ? <Grid item xs='4'>
                  <div style={{ height: '300px', width: '300px' }}><img style={{ height: '300px', width: '300px' }} src={pant} alt='logo' /></div>
                </Grid>
                : [] }
            </Grid>
            {this.state.denimShortCheck
              ? <Grid container direction='row' spacing={3} style={{ padding: '10px' }}>
                <Grid item xs='4'> <TextField
                  label='Waist'
                  id='denim-short-waist'
                  value={this.state.denimShortWaist}
                  onChange={this.denimShortWaistHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Rise'
                  id='denim-short-rise'
                  value={this.state.denimShortRise}
                  onChange={this.denimShortRiseHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Thigh'
                  id='denim-short-thigh'
                  value={this.state.denimShortThigh}
                  onChange={this.denimShortThighHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Outseam Length'
                  id='denim-short-outseam-length'
                  value={this.state.denimShortOutseamLength}
                  onChange={this.denimShortOutseamLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Bottom Hem'
                  id='denim-short-bottom-hem'
                  value={this.state.denimShortBottomHem}
                  onChange={this.denimShortBottomHemHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Inseam Length'
                  id='denim-short-inseam-length'
                  value={this.state.denimShortInseamLength}
                  onChange={this.denimShortInseamLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
              </Grid>
              : []}
            <Grid container spacing={3} style={{ padding: '15px' }}>
              <Grid item xs='2' style={{ fontSize: 18 }}>Sports Track Pant</Grid>
              <Grid item xs='1' style={{ marginBottom: 10 }}>  <Checkbox
                checked={this.state.sportTrackPantCheck}
                onChange={this.handleSportTrackPantChange}
                value='primary'
                inputProps={{ 'aria-label': 'primary checkbox' }}
              /></Grid>
              <Grid item xs='2'>
                <Button variant='contained' color='primary' onClick={this.sportTrackPantImageHandeler}>
              Image
                </Button>
              </Grid>
              {this.state.showSportTrackPant
                ? <Grid item xs='4'>
                  <div style={{ height: '300px', width: '300px' }}><img style={{ height: '300px', width: '300px' }} src={pant} alt='logo' /></div>
                </Grid>
                : [] }
            </Grid>
            {this.state.sportTrackPantCheck
              ? <Grid container direction='row' spacing={3} style={{ padding: '10px' }}>
                <Grid item xs='4'> <TextField
                  label='Waist'
                  id='sport-track-pant-waist'
                  value={this.state.sportTrackPantWaist}
                  onChange={this.sportTrackPantWaistHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Rise'
                  id='sport-track-pant-rise'
                  value={this.state.sportTrackPantRise}
                  onChange={this.sportTrackPantRiseHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Thigh'
                  id='sport-track-pant-thigh'
                  value={this.state.sportTrackPantThigh}
                  onChange={this.sportTrackPantThighHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Outseam Length'
                  id='sport-track-pant-outseam-length'
                  value={this.state.sportTrackPantOutseamLength}
                  onChange={this.sportTrackPantOutseamLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Bottom Hem'
                  id='sport-track-pant-bottom-hem'sportTrackPantBottomHem
                  value={this.state.sportTrackPantBottomHem}
                  onChange={this.sportTrackPantBottomHemHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
                <Grid item xs='4'> <TextField
                  label='Inseam Length'
                  id='sport-track-pant-inseam-length'
                  value={this.state.sportTrackPantInseamLength}
                  onChange={this.sportTrackPantInseamLengthHandler}
                  variant='outlined'
                  size='small'
                /></Grid>
              </Grid>
              : []}
            <Grid container spacing={3} style={{ padding: 15 }}>
              <Grid item xs='8' />
              <Grid item xs='3'>
                <Button
                  style={{ marginLeft: '90px', marginTop: '20px' }}
                  variant='contained'
                  color='primary'
                  onClick={this.uniformUpdateHandler}>
                      UPDATE
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>
          : [] }
        {this.props.dataLoading ? <CircularProgress open /> : null}
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  user: state.authentication.user,
  session: state.academicSession.items,
  ErpSuggestions: state.finance.makePayAcc.erpSuggestions,
  gradeData: state.finance.accountantReducer.pdc.gradeData,
  sectionData: state.finance.accountantReducer.changeFeePlan.sectionData,
  dataLoading: state.finance.common.dataLoader,
  uniform: state.inventory.storeManager.studentUniformReducer.uniformDetails
})

const mapDispatchToProps = dispatch => ({
  loadSession: dispatch(apiActions.listAcademicSessions()),
  fetchGrades: (session, alert, user) => dispatch(actionTypes.fetchGrades({ session, alert, user })),
  fetchErpSuggestions: (type, session, grade, section, status, erp, alert, user) => dispatch(actionTypes.fetchErpSuggestions({ type, session, grade, section, status, erp, alert, user })),
  clearAllProps: (alert, user) => dispatch(actionTypes.clearAllProps({ alert, user })),
  fetchAllSections: (session, gradeId, alert, user) => dispatch(actionTypes.fetchAllSections({ session, gradeId, alert, user })),
  uniformDetails: (erp, isStoreManager, alert, user) => dispatch(actionTypes.uniformDetails({ erp, isStoreManager, alert, user })),
  uniformDetailsUpdate: (data, alert, user) => dispatch(actionTypes.uniformDetailsUpdate({ data, alert, user }))
//   fetchGrades: (session, alert, user) => dispatch(actionTypes.fetchGrades({ session, alert, user }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StudentUniform))
