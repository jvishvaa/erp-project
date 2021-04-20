
import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { COMBINATIONS } from './gsComb'
import PSelect from '../../_components/pselect'
import GSelect from '../../_components/globalselector'

import { apiActions } from '../../_actions'
import { urls } from '../../urls'
import './stylesGps.css'

class GlobalPowerSelector extends Component {
  constructor (props) {
    super(props)

    this.state = {
      globalSelector: {},
      globalSelectorKey: new Date().getTime()
    }
    let { onChangeData } = this.props
    if (typeof onChangeData !== 'function') {
      throw new Error(`onChangeData must be of function type, it is ${typeof onChangeData} in props of GlobalPowerSelector`)
    }
    this.onChange = this.onChange.bind(this)
    this.handleSelectedata = this.handleSelectedata.bind(this)
    this.getPselector = this.getPselector.bind(this)
  }

  componentDidMount () {
    this.role = JSON.parse(localStorage.getItem('user_profile')).personal_info.role
    axios.get(urls.ACADSESSION, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      let{ acad_session: academicyear } = res.data
      this.setState({ userAcadsession: academicyear })
    }).catch(err => {
      console.log(err)
    })
  }

  onChange (data, apiData) {
    var academicYear
    if (apiData && apiData[0]) {
      let branchAPIdata = apiData[0]
      let acadSessions = [...new Set(branchAPIdata.map(item => item.acad_session))]

      if (acadSessions.length === 1) {
        academicYear = acadSessions[0]
      }
    }

    let { globalSelector: { academicYear: prevAcadSession } } = this.state
    const globalSelector = { ...data, academicYear }
    const selectedData = { ...globalSelector }
    this.setState({ globalSelector, selectedData }, () => {
      let { globalSelector: { academicYear }, keyUpdated } = this.state
      if (!prevAcadSession && academicYear && keyUpdated !== true) {
        this.setState({ globalSelectorKey: new Date().getTime(), keyUpdated: true })
      }
    })
    let { onChangeData = () => {} } = this.props
    onChangeData(selectedData)
  }
  handleSelectedata () {
    let { filter: { data: { itemData = {} } = {} } = {} } = this.props
    const sectionMappingIds = Object.values(itemData).map(item => item.id).join(',')
    if (sectionMappingIds !== '') {
      const selectedData = { section_mapping_id: sectionMappingIds }
      this.setState({ selectedData })
      let { onChangeData = () => {} } = this.props
      onChangeData(selectedData)
    }
  }
  pSelectAccessROles = ['Admin', 'BDM']
  getPselector () {
    // let{ userAcadsession } = this.state
    if (this.pSelectAccessROles.includes(this.role)) {
      return <div>
        <span className='horzontalRule'>&nbsp;OR&nbsp;</span>
        {/* {userAcadsession === '2019-20' */}
        <PSelect section onClick={this.handleSelectedata} />
        {/* : <h5>Power selector not compatible for {userAcadsession}</h5>} */}
      </div>
    }
  }
  containerStyles ={
    border: '1px solid rgb(195,207,217)',
    margin: 10,
    marginTop: 15,
    padding: 10,
    paddingTop: 20,
    position: 'relative'
  }
  containerTitleStyles ={
    color: 'rgb(75,92,107)',
    position: 'absolute',
    top: -13,
    background: 'white',
    border: '0.5px solid rgb(195,207,217)',
    padding: 2.5,
    paddingLeft: 3.5,
    paddingRight: 3.5,
    margin: 2.5
  }
  render () {
    return (
      <div style={this.containerStyles}
      >
        <span style={this.containerTitleStyles}>
          Selectors / Filters
        </span>
        <GSelect
          key={this.state.globalSelectorKey}
          config={COMBINATIONS(this.state.globalSelector.academicYear ? `(${this.state.globalSelector.academicYear})` : '')}
          variant='filter'
          onChange={this.onChange}
        />
        { this.getPselector() }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  roles: state.roles.items,
  user: state.authentication.user,
  branches: state.branches.items,
  subjects: state.subjects.items,
  grades: state.gradeMap.items,
  sections: state.sectionMap.items,
  filter: state.filter

})

const mapDispatchToProps = dispatch => ({
  listBranches: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: (branchId) => dispatch(apiActions.getGradeMapping(branchId)),
  sectionMap: (acadMapId) => dispatch(apiActions.getSectionMapping(acadMapId))
})

export default connect(mapStateToProps, mapDispatchToProps)(GlobalPowerSelector)
