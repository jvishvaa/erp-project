import React from 'react'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import withStyles from '@material-ui/core/styles/withStyles'
import axios from 'axios'
import { urls } from '../../urls'
import PdfView from './pdfView'
import { InternalPageStatus, Pagination } from '../../ui'
import './publications.css'
import Download from '../../assets/download.png'

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
})

class Publications extends React.Component {
  state={
    btnChange: true,
    totalPage: 0,
    magazineData: [],
    clicked: false,
    fileUrl: '',
    loading: true,
    loadingLabel: 'Loading magazine...',
    pageSize: 0,
    pageNumber: 1,
    open: false,
    currentPage: 1,
    PublicationZone: [],
    zoneID: '',
    publicationType: ''
  }
  magazine = (type, page) => {
    if (type === 'tabloid') {
      this.setState({ publicationType: 'tabloid', btnChange: false, clicked: false, loadingLabel: 'Loading newsletter...' })
    } else {
      this.setState({ publicationType: 'magazine', btnChange: true, clicked: false, loadingLabel: 'Loading magazine...' })
    }
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
    path += `?type=` + type + `&is_delete=false&page_size=12&page_number=` + pageNo + `&status=published`
    // path += `?page_size=${pageSize}&page_no=${currentPage}&ebook_type=General`
    axios.get(`${urls.Publishing}${path}`, {
      headers: {
        Authorization: 'Bearer ' + this.props.user
      }
    })
      .then(({ data }) => {
        this.setState({ magazineData: data.result, currentPage: data.current_page, totalPage: data.total_pages, loading: false })
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
        }
      })
  }
  newspaper = () => {
    this.setState({ btnChange: false })
  }
  onView = (fileUrl) => {
    this.setState({ clicked: true, fileUrl: fileUrl })
    this.handleClick()
  }
  handlePagination = (page) => {
    this.setState({ currentPage: page, loading: true }, () => {
      this.magazine(this.state.publicationType)
    })
  }
  onBackButtonEvent = () => {
    window.history.forward()
  }
  componentDidMount () {
    window.addEventListener('popstate', this.onBackButtonEvent)
    this.setState({ loading: true }, () => {
      this.magazine('magazine')
    })
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
  // handleZone=(e) => {
  //   this.setState({ zoneID: e.value })
  //   this.setState({ loading: true }, () => {
  //     this.magazine('magazine')
  //   })
  // }
  handleClick=() => {
    let { open } = this.state
    this.setState({ open: !open })
  }
  // componentDidMount () {
  //   this.setState({ loading: true }, () => {
  //     this.magazine('magazine')
  //   })
  //   // Listing the publication zone
  //   axios.get(`${urls.PublicationZone}`, {
  //     headers: {
  //       Authorization: 'Bearer ' + this.props.user
  //     }
  //   })
  //     .then(({ data }) => {
  //       this.setState({ PublicationZone: data.result })
  //     })
  //     .catch(error => {
  //       if (error.response && error.response.status === 404) {
  //       }
  //     })
  // }

  render () {
    const { btnChange, magazineData, fileUrl, loading, loadingLabel } = this.state
    return (
      <React.Fragment>
        <div>
          {/* <div>
            <OmsSelect
              className='omselect1'
              placeholder='Select Zone'
              // change={this.handleSubject}
            />
          </div> */}
          <div className='mainContainer'>
            <div className={btnChange ? 'magazineBtn' : 'newspaperBtn'} onClick={() => this.magazine('magazine', 1)}>Magazines</div>
            <div className='pubLine' />
            <div className={btnChange ? 'newspaperBtn' : 'magazineBtn'} onClick={() => this.magazine('tabloid', 1)}>Newspaper</div>
          </div>
          {/* <div>Close</d
          iv> */}

          { this.state.clicked
            ? <PdfView url={fileUrl} handleClick={e => this.handleClick()} open={this.state.open} />
            : <div>
              {/* <div className='pubSection'>
              <div className='magImg'>
                  Img
              </div>
              <div>
                <div className='pubSection1'>
                  <div className='pubSection1Text1'>Invictus</div>
                  <div className='pubSectionLine' />
                  <div className='pubSection1Text2'>Orchids</div>
                  <div className='pubSectionLine' />
                  <div className='pubSection1Text2'>April 2020</div>
                </div>
                <div className='pubSection2'>
                  Featured Stories
                  <ul className='pubSectionList'>
                    <li>Coffee</li>
                    <li>Tea</li>
                    <li>mag</li>
                  </ul>
                  <div className='readBtn'>
                    Read More
                  </div>
                </div>
              </div>
            </div> */}
              { loading
                ? <div style={{ marginTop: '50px' }}><InternalPageStatus label={loadingLabel} /></div>
                : <Grid container spacing={1} style={{ padding: '5px' }}>
                  { !magazineData
                    ? <div style={{ textAlign: 'center', width: '100%' }}>No Data</div>
                    : <Grid container spacing={1}>{
                      magazineData.map(item => {
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
                                { this.state.publicationType === 'tabloid' ? (<div className='listHead'>Scholarly Ink</div>) : (<div className='listHead'>Invictus</div>)}
                                <div className='listImg'><img src={item.thumbnail_url} width='100px' height='120px' /></div>
                                <div className='listHeadCont'>
                                  <div className='btnCont'>
                                    <div className='listTitle'>{ item.title }</div>
                                    <div className='listDate'>{item.edition}</div>
                                  </div>
                                  <div className='viewBtn' onClick={() => this.onView(item.file_url)}>View</div>
                                  {/* <Link to={item.file_url} target='_blank' download>Download</Link> */}
                                </div>
                                {/* <DownloadLink
                                  label='Save'
                                  filename={item.file_url}
                                  exportFile={() => item.file_url}
                                /> */}
                                {/* <a href='https://letseduvate.s3.amazonaws.com/dev/media/newsletters/files/Invictus-April_2020-Bangalore_final.pdf' download target='_blank'>download PDF file</a> */}
                                {/* <div className='downloadBtn'><a href={item.file_url} target='_blank' rel='noopener noreferrer' download><img src={Download} width='13px' /></a></div> */}
                                <div className='downloadBtn' onClick={() => this.download(item.file_url)}><img src={Download} width='15px' /></div>
                              </div>
                            </div>
                          </div>
                        </Grid>
                      })
                    }
                    </Grid>
                  }
                  {/* </Grid> */}
                  {/* <Grid style={{ display: 'flex' }}> */}
                  {/* <OmsSelect
                    style={{ marginRight: '5px' }}
                    className='omselect1'
                    placeholder='Select Zone'
                    options={
                      PublicationZone &&
                      PublicationZone.map(grade => ({
                        value: grade.id,
                        label: grade.zone_name
                      }))
                    }
                    change={this.handleZone}

                  /> */}
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

        </div>

      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
})

export default connect(
  mapStateToProps
)(withStyles(styles)(Publications))
