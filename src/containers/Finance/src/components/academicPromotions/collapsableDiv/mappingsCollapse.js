import React from 'react'
import axios from 'axios'
import LinkTag from '@material-ui/core/Link'
import NestedList from './nestedList'
import { urls } from '../../../urls'

class CollapsableBar extends React.Component {
  // input props with key--> filterData =
  //   {
  //     "sectionMappingIds": ["69193"]
  //   }
  //   or
  //   {
  //     "acadBranchGradeMappingIds": ["2445", "2494"]
  //   }
  //   or
  //   {
  //     "academicYear": "2020-21",
  //     "branchIds": ["8", "101"]
  //   }
  constructor (props) {
    super(props)
    this.state = {}
    let token = localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + token } }
    this.getMappingDetails = this.getMappingDetails.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
  }
    createQuery = params => params.filter(param => (param[1] !== undefined)).map(param => `${param[0]}=${param[1]}`).join('&')

    getMappingDetails () {
      let { filterData } = this.props
      let { GetMappingDetails } = urls
      let query = this.createQuery(Object.entries(filterData))
      let apiUrl = GetMappingDetails + '?' + query
      if (Object.keys(filterData).length <= 0) {
        this.setState({ items: [] })
        return
      }
      // branchIds:3,5,8
      // academicYear:2019-20
      // or
      // acadBranchGradeMappingIds:889
      // or
      // sectionMappingIds:3863'
      // eslint-disable-next-line no-debugger
      //   debugger
      this.setState({ fetching: true, fetchFailed: null })
      axios.get(apiUrl, this.headers)
        .then(res => {
          let { status, data } = res
          if (status === 200) {
            let { result = [] } = data
            result.forEach(item => {
              let { year, branch_name: branchName, grade, section, is_deleted: isDeleted } = item
              isDeleted = isDeleted ? 'Mapping is deleted, Please Deselect this Mapping or contact Developers' : false
              const label = [year, branchName, grade, section, isDeleted].filter(item => !!item).join(' - ')
              Object.assign(item, { label })
            })
            this.setState({ items: result })
          }
          this.setState({ fetching: false })
        })
        .catch(err => {
          this.setState({ fetching: false, fetchFailed: true })
          let { message: errorMessage, response: { data: { message: msgFromDeveloper } = {} } = {} } = err
          if (msgFromDeveloper) {
            //   window.alert(`${msgFromDeveloper}`)
          } else if (errorMessage) {
            //   window.alert(`${errorMessage}`)
          } else {
            window.alert('Failed to fetch mappings')
          }
        })
    }
    handleItemClick (itemId, index, item) {
      this.props.handleItemClick(itemId, index, item)
    }
    componentWillMount () {
      this.getMappingDetails()
    }
    componentWillReceiveProps (newProps) {
    //   const oldProps = this.props
      this.getMappingDetails()
    }
    render () {
      let { fetching, fetchFailed, items } = this.state
      let { title, ...restProps } = this.props
      title = fetching ? 'Please Wait Mapping are getting loaded...' : fetchFailed ? <p>Error occured in fetching mappings&nbsp;
        <LinkTag
          component='button'
          onClick={this.getMappingDetails}>
          <b>Click here to reload_</b>
        </LinkTag>
      </p> : `${title} - ( ${Array.isArray(items) ? items.length : ''} )`
      return <NestedList
        title={title}
        items={items || []}
        onItemClick={this.handleItemClick}
        {...fetching ? { diasbleClick: true } : {}}
        {...restProps}
      />
    }
}
export default CollapsableBar
