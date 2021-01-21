import React from 'react'
import axios from 'axios'
import ReactTable from 'react-table'
import { withRouter } from 'react-router-dom'
import LinkTag from '@material-ui/core/Link'
import { Button } from '@material-ui/core'
import { COMBINATIONS } from '../gSelector'
import GSelect from '../../../../_components/globalselector'
import { urls } from '../../../../urls'
import { InternalPageStatus, FakeSearchParam } from '../../../../ui'
import './reacttable.css'

class StudentProfileImages extends React.Component {
  constructor () {
    super()
    this.state = { }
    let authToken = window.localStorage.getItem('id_token')
    this.headers = { headers: { Authorization: 'Bearer ' + authToken } }
  }
  componentWillMount () {
    let { sectionMappingId: sectionMappingIdSearch = undefined } = this.getSearchParams()
    let { sectionMappingId: sectionMappingIdRoute = undefined } = this.getRouteParams()
    var sectionMappingId = sectionMappingIdRoute || sectionMappingIdSearch
    if (sectionMappingId) {
      this.setState({ sectionMappingId }, this.getImages)
    }
    // console.log({ sectionMappingIdSearch, sectionMappingIdRoute, sectionMappingId }, 'ding dong')
  }
  getRouteParams = () => {
    let { match: { path, params: { sectionMappingId, studentId } } = {} } = this.props
    return { sectionMappingId, studentId, path }
  }
  getSearchParams = () => {
    let { location: { search = '' } = {} } = this.props
    const urlParams = new URLSearchParams(search) // search = ?open=true&qId=123
    const searchParamsObj = Object.fromEntries(urlParams) // {open: "true", def: "[asf]", xyz: "5"}
    return searchParamsObj
  }
    getImages = () => {
      let { sectionMappingId } = this.state
      if (!sectionMappingId) {
        return
      }
      let { ProfileImages } = urls
      let URL = ProfileImages + '?'
      URL += sectionMappingId ? `section_mapping=${sectionMappingId}` : ''
      this.setState({ loading: true, isFetchFailed: null, responseData: undefined })
      axios
        .get(URL, this.headers)
        .then(response => {
          if (response.status === 200) {
            let { data: responseData = [] } = response || {}
            if (responseData.length) {
              responseData.forEach(element => {
                let { studentprofileimages: studentAllProfileImages = [] } = element
                var studentProfileImages = studentAllProfileImages.filter(item => Number(item.section_mapping) === Number(sectionMappingId))
                element['studentprofileimages'] = studentProfileImages
              })
            }
            this.setState({ responseData, loading: false, isFetchFailed: null })
          }
        })
        .catch(er => {
          this.setState({ loading: false, isFetchFailed: true })
          //   window.alert('errorerrr')
          console.log(er)
        })
    }
    onChange = (data, fetchData) => {
      let { section_mapping_id: sectionMappingId } = data
      if (sectionMappingId) {
        console.log({ ...data })
        this.setState({ sectionMappingId }, this.getImages)
        const fakeSearchParam = new FakeSearchParam().generate(10, 9)
        this.props.history.push(`?${fakeSearchParam}&sectionMappingId=${sectionMappingId}&`)
      }
    }
    subComponent = (properties) => {
      const { original } = properties
      const row = original
      let { studentprofileimages = [], id: studentId } = row

      if (!studentprofileimages.length) {
        return <InternalPageStatus
          loader={false}
          label={
            <p>No images found&nbsp;
              <LinkTag
                component='button'
                onClick={() => { this.props.history.push(`/student/profiles/upload/${studentId}/`) }
                }
              >
                <b>Click here to upload_</b>
              </LinkTag>
            </p>
          } />
      }
      let { frontal_image: frontalImage, left_sidewise: leftSidewise, right_sidewise: rightSidewise } = studentprofileimages[0]
      //   backgroundColor: 'rgba(233,237,243, 0.1)'
      const mainDiv = { border: '0.2px solid rgba(0,0,0,0.3)', backgroundColor: 'rgb(233,237,243)' }
      const divStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }
      const imgStyle = { maxWidth: '300px',
        height: 'auto',
        margin: 20,
        padding: 5,
        //    border: '0.3px solid rgb(233,237,243)'
        border: '0.3px solid grey'
      }

      const imgSrcs = [{ src: frontalImage, label: 'Front Image' },
        { src: leftSidewise, label: 'Left side wise' },
        { src: rightSidewise, label: 'Right side wise' }]
      return <div style={mainDiv}>

        <div style={divStyle}>
          {imgSrcs.map(img => <img style={imgStyle} src={img.src} alt={img.label} />)}
        </div>
        <Button color='primary' variant='contained'
          onClick={() => { this.props.history.push(`/student/profiles/upload/${studentId}/`) }}
        >
            Upload
        </Button>
      </div>
    }
    getImageColumn = (props, keyName, checkSrcExists) => {
      let { studentprofileimages = [] } = props
      if (studentprofileimages.length) {
        let imgSrc = studentprofileimages[0][keyName]
        if (checkSrcExists) {
          return !!imgSrc
        }
        const divStyle = { backgroundColor: 'rgb(233,237,243)', border: '0.2px solid rgba(0,0,0,0.3)', display: 'flex', margin: 'auto' }
        Object.assign(divStyle, { maxWidth: '70px', height: 'auto' })
        // const img = { maxWidth: '70px', height: 'auto', margin: 'auto' }
        const img = { maxWidth: '90%', maxHeight: '90%', margin: 'auto' }
        return <div style={divStyle}>
          <img src={imgSrc} alt={keyName} style={img} />
        </div>
      } else {
        if (checkSrcExists) {
          return false
        }
        return <p style={{ textAlign: 'center' }}>No image</p>
      }
    }
getColumns =() => {
  return [
    {
      Header: 'Sr',
      accessor: 'id',
      Cell: row => <div>{row.index + 1}</div>,
      maxWidth: 60

    },
    {
      id: 'student_name',
      Header: 'Student Name',
      //   accessor: 'name'
      accessor: props => <p style={{ textAlign: 'center' }}>{props.name}</p>
    // maxWidth: 100
    },
    {
      id: 'erp',
      Header: 'erp',
      //   accessor: 'erp',
      accessor: props => <p style={{ textAlign: 'center' }}>{props.erp}</p>,
      maxWidth: 100
    },
    {
      id: 'Frontal image',
      Header: 'Frontal image',
      className: 'extendRowHeight',
      //   className: (() => this.getImageColumn(props, 'frontal_image', true) ? 'extendRowHeight' : '')(),
      accessor: props => this.getImageColumn(props, 'frontal_image')
    },

    {
      id: 'Left Side wise',
      Header: 'Left Side wise',
      className: 'extendRowHeight',
      accessor: props => this.getImageColumn(props, 'left_sidewise')
    },
    {
      id: 'Right Side wise',
      Header: 'Right Side wise',
      className: 'extendRowHeight',
      accessor: props => this.getImageColumn(props, 'right_sidewise')
    },
    {
      id: 'upload',
      Header: 'upload',
      className: 'extendRowHeight',
      accessor: props => {
        let { id: studentId } = props
        return <Button
          variant='outlined'
          onClick={() => { this.props.history.push(`/student/profiles/upload/${studentId}/`) }}
        >
          Upload
        </Button>
      }
    }
  ]
}
    renderTable = () => {
      let { responseData = [], sectionMappingId, isFetchFailed, loading } = this.state
      if (!sectionMappingId) return <InternalPageStatus label='Please Select Section' loader={false} />
      if (loading) return <InternalPageStatus label='Loading..' />

      if (isFetchFailed) {
        return <InternalPageStatus
          label={
            <p>Error occured in fetching data&nbsp;
              <LinkTag
                component='button'
                onClick={this.getImages}>
                <b>Click here to reload_</b>
              </LinkTag>
            </p>
          }
          loader={false} />
      }
      if (!responseData.length) {
        return <InternalPageStatus

          label={<p>No students found in this section&nbsp;
            <LinkTag
              component='button'
              onClick={this.getImages}>
              <b>Click here to try again_</b>
            </LinkTag>
          </p>}
          loader={false} />
      }
      return <ReactTable
        loading={this.state.loading}
        data={responseData || []}
        showPageSizeOptions
        defaultPageSize={10}
        SubComponent={this.subComponent}
        columns={this.getColumns()}
      />
    }
    render () {
      return <div>

        <GSelect config={COMBINATIONS} variant='filter' onChange={this.onChange} />
        {this.renderTable()}
      </div>
    }
}

export default withRouter(StudentProfileImages)
