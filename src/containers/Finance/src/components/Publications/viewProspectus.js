import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Grid } from '@material-ui/core'
import { apiActions } from '../../_actions'
import Download from '../../assets/download.png'
import { urls } from '../../urls'
import PdfView from './pdfView'
import { InternalPageStatus, Pagination } from '../../ui'

class ViewProspectus extends Component {
  constructor () {
    super()
    this.state = {

      btnChange: true,
      totalPage: 0,
      prospectusData: [],
      clicked: false,
      fileUrl: '',
      loading: true,
      loadingLabel: 'Loading...',
      pageSize: 0,
      pageNumber: 1,
      open: false,
      currentPage: 1,
      PublicationZone: [],
      zoneID: '',
      publicationType: ''

    }
  }
  componentDidMount () {
    window.addEventListener('popstate', this.onBackButtonEvent)
    this.setState({ loading: true }, () => {
      this.prospectus('prospectus')
    })
  }
  onBackButtonEvent = () => {
    window.history.forward()
  }
  prospectus = (type, page) => {
    let pageNo = ''
    if (page === 1) {
      pageNo = 1
      this.setState({ currentPage: page })
    } else {
      pageNo = this.state.currentPage
    }
    this.setState({
      loading: true
    })
    let path = ''
    path += `?type=${'prospectus'}` + `&is_delete=false&page_size=12&page_number=` + pageNo
    axios.get(`${urls.Publishing}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(({ data }) => {
        this.setState({ prospectusData: data.result, currentPage: data.current_page, totalPage: data.total_pages, loading: false })
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
        }
      })
  }
  handleClick=() => {
    let { open } = this.state
    this.setState({ open: !open })
  }
  onView = (fileUrl) => {
    this.setState({ clicked: true, fileUrl: fileUrl })
    this.handleClick()
  }
  download = (fileurl) => {
    const method = 'GET'
    const url = (fileurl)
    axios
      .request({
        url,
        method,
        responseType: 'blob' // important
      })
      .then(({ data }) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', fileurl) // any other extension
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
  }
  handlePagination = (page) => {
    this.setState({ currentPage: page, loading: true }, () => {
      this.prospectus(this.state.publicationType)
    })
  }
  render () {
    const { prospectusData, fileUrl, loading, loadingLabel } = this.state

    return (
      <React.Fragment>
        { this.state.clicked
          ? <PdfView url={fileUrl} handleClick={e => this.handleClick()} open={this.state.open} />
          : <div>
            { loading
              ? <div style={{ marginTop: '50px' }}><InternalPageStatus label={loadingLabel} /></div>
              : <Grid container spacing={1} style={{ padding: '5px' }}>
                { !prospectusData
                  ? <div style={{ textAlign: 'center', width: '100%' }}>No Data</div>
                  : <Grid container spacing={1}>{
                    prospectusData.map(item => {
                      return <Grid item xs={5} sm={4} md={2} >
                        <div className='listCon'>
                          <div className='borderDesign'>
                            <div className='listHeadCont'>
                              {/* <div className='borderDesign1' /> */}
                              {/* <div className='listHead1'>
                                    <li>Latest Publication</li>
                                  </div> */}
                            </div>
                            <div className='listMaga'>
                              {/* { this.state.publicationType === 'tabloid' ? (<div className='listHead'>Scholarly Ink</div>) : (<div className='listHead'>Invictus</div>)} */}
                              <div className='listImg'><img src={item.thumbnail_url} width='100px' height='120px' /></div>
                              <div className='listHeadCont'>
                                <div className='btnCont'>
                                  <div className='listTitle'>{ item.title }</div>
                                  <div className='listDate'>{item.edition}</div>
                                </div>
                                <div className='viewBtn' onClick={() => this.onView(item.file_url)}>View</div>
                                {/* <Link to={item.file_url} target='_blank' download>Download</Link> */}
                              </div>

                              <div className='downloadBtn' onClick={() => this.download(item.file_url)}><img src={Download} width='15px' /></div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    })
                  }
                  </Grid>
                }
                <Pagination
                  className='ebook-pagination'
                  rowsPerPageOptions={[]}
                  labelRowsPerPage={'Ebooks per page'}
                  page={this.state.currentPage - 1}
                  rowsPerPage={12}
                  count={(this.state.totalPage * 12)}
                  onChangePage={(e, i) => {
                    this.handlePagination(i + 1)
                  }}
                />

              </Grid>
            }
          </div>
        }

      </React.Fragment>
    )
  }
}
const mapStateToProps = (state) => ({
  user: state.authentication.user,
  branch: state.branches.items,
  grade: state.gradeMap.items
})

const mapDispatchToProps = dispatch => ({
  branchList: () => dispatch(apiActions.listBranches()),
  gradeMapBranch: branchId => dispatch(apiActions.getGradeMapping(branchId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewProspectus)
