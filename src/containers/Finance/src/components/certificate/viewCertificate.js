import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { fade } from '@material-ui/core/styles/colorManipulator'
// import CircularProgress from '@material-ui/core/CircularProgress'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import moment from 'moment'
import {
  Grid, Card, Button,
  Backdrop, Fade, Modal, CardActions,
  CardMedia, CardActionArea
} from '@material-ui/core'
import { urls } from '../../urls'
// eslint-disable-next-line camelcase
import './styleView.css'
import { InternalPageStatus } from '../../ui'

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

const styles = theme => ({
  root: {
    maxWidth: 345,
    borderRadius: '4px'
  },
  media: {
    height: 140,
    backgroundColor: '#9a9292'
  },
  gridroot: {
    flexGrow: 1,
    padding: 20,
    background: '#a9a9a933'
  },
  loader__circularPro: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  content: {
    // backgroundColor: '#DCDCDC'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  card_root: {
    maxWidth: '100%'
  },
  title_row: {
    fontWeight: 'bold',
    margin: '5px',
    display: 'flex',
    color: '#fff',
    background: '#5d2449',
    'text-align': 'center',
    padding: '5px 7px'
  },
  modalroot: {
    minWidth: 345,
    maxWidth: 900
  },
  img__sign: {
    width: '100%',
    height: 'auto'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200
      }
    }
  },
  viewButton: {
    width: '100%',
    color: '#fff'
  },
  title_row1: {
    marginRight: '10px',
    display: 'block',
    margin: '0 auto'
  },
  view__remove: {
    display: 'flex',
    background: '#5d2449',
    width: '100%'
  },
  grow: {
    flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

})

class ViewCertificate extends Component {
  constructor () {
    super()
    this.state = {
      open: false,
      currentTab: 0,
      firstElement: [],
      badges: [],
      certificate: '',
      isCertificateLoading: false,
      isBadgesLoading: false,
      loadingLabel: 'loading ...',
      showBadgesResMessage: false,
      showCertificateResMessage: false
    }
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  componentWillMount () {
    this.getCertificates()
  }
  getCertificates=() => {
    this.setState({ isCertificateLoading: true, templateUrl: [], firstElement: [] })
    axios.get(urls.CertificateStudentView, {
      headers: {
        Authorization: 'Bearer ' + this.props.user,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log(res.data, 'll')
      let{ data: { data = [], status: { Message, Success } = {} } = {} } = res
      this.props.alert.success(Message)
      if (data && data.length) {
        let data1 = [data.shift()]

        this.setState({
          templateUrl: data,
          firstElement: data1,
          showCertificateResMessage: Success

        })
      }

      this.setState({ isCertificateLoading: false })
    }).catch(error => {
      let { response: { data: { status: { Message } = {} } = {} } = {}, message } = error
      if (!Message && message) {
        this.props.alert.error(JSON.stringify(message))
      } else {
        this.props.alert.error(JSON.stringify(Message))
        this.setState({ noData: true, errorMessage: Message })
      }
      this.setState({ isCertificateLoading: false })
    })
  }

    download = (imgUrl) => {
      const method = 'GET'
      const url = (imgUrl)
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
          link.setAttribute('download', 'certificate.png') // any other extension
          document.body.appendChild(link)
          link.click()
          link.remove()
        })
    }
    openCertificate = (img) => {
      this.setState({ open: true, certificate: img })
    }

      handleClose = () => {
        this.setState({ open: false })
      }
      a11yProps (index) {
        return {
          id: `wrapped-tab-${index}`,
          'aria-controls': `wrapped-tabpanel-${index}`
        }
      }
  handleSearchChange = e => {
    const { value } = e.target
    const lowercasedValue = value.toLowerCase()

    this.setState(prevState => {
      const filteredData = prevState.data.filter(el =>
        el.dataConnectionName.toLowerCase().includes(lowercasedValue)
      )

      return { filteredData }
    })
  };

   getBadge = () => {
     this.setState({ isBadgesLoading: true, badges: [] })
     axios.get(urls.showBadges, {
       headers: {
         Authorization: 'Bearer ' + this.props.user,
         'Content-Type': 'application/json'
       }
     }).then(res => {
       //  // eslint-disable-next-line no-debugger
       //  debugger
       let{ data: { data, status: { Message, Success } = {} } = {} } = res

       if (data && data.length) {
         this.props.alert.success(Message)
         this.setState({
           badges: data,
           isBadgesLoading: !Success,
           showBadgesResMessage: Success
         })
       }
     }).catch(error => {
       let { response: { data: { status: { Message, Success } = {} } = {} } = {}, message } = error

       if (!Success) {
         this.props.alert.error(JSON.stringify(Message))
         this.setState({
           noData: true,
           errorMessage: Message,
           isBadgesLoading: Success,
           showBadgesResMessage: Success
         })
       } else {
         this.props.alert.error(JSON.stringify(message))
         this.setState({ isBadgesLoading: false })
       }
     })
   }

   handleTabChange = (event, newValue) => {
     console.log(newValue, 'newwww')
     this.setState({ currentTab: newValue })
     if (newValue === 0) {
       this.getCertificates()
     } else if (newValue === 1) {
       this.getBadge()
     }
   }
   render () {
     let { classes } = this.props
     let { open, templateUrl, certificate, firstElement, badges, isBadgesLoading, isCertificateLoading, loadingLabel, showBadgesResMessage, showCertificateResMessage } = this.state

     return (
       <React.Fragment>
         <AppBar position='static'>
           <Tabs variant='fullWidth' value={this.state.currentTab}
             onChange={this.handleTabChange}
             aria-label='simple tabs example'>
             <Tab label='Certificates' {...this.a11yProps(0)} />
             <Tab label='Badges' {...this.a11yProps(1)} />
           </Tabs>
         </AppBar>

         {(isBadgesLoading || isCertificateLoading) && <div style={{ marginTop: '70px' }}>
           <InternalPageStatus label={loadingLabel} /></div> }

         <TabPanel value={this.state.currentTab} index={0}>
           {this.state.firstElement && firstElement.length
             ? <Grid className={classes.loader_icon}>

               {firstElement && firstElement.length
                 ? firstElement.map((data) => {
                   return <Grid container spacing={2} className='container_padding'>
                     <grid style={{ margin: '0 auto', display: 'block' }}>
                       <div item xs={12} md={12} sm={12}>
                         <div style={{ marginTop: '10%' }}>
                           <Card key={data.id} className={classes.card_root}>
                             <CardActionArea>
                               <CardMedia
                                 className={classes.img__sign}
                                 component='img'

                                 src={`${data.certificate_file}`}
                               />
                             </CardActionArea>
                             <CardActions>
                               <div className={classes.view__remove}>
                                 <Button
                                   className={classes.viewButton}
                                   size='small'
                                   color='primary'
                                   onClick={() => this.openCertificate(`${data.certificate_file}`)}
                                 >
                      View
                                 </Button>
                                 <Button
                                   className={classes.viewButton}
                                   size='small'
                                   color='primary'
                                   onClick={() => this.download(data.certificate_file)}
                                 >
                      Download
                                 </Button>
                               </div>
                             </CardActions>
                           </Card>
                         </div>
                       </div>
                     </grid>
                   </Grid>
                 }) : ''
               }
               {
                 <Grid container spacing={2} style={{ marginTop: '2%', background: '#cac3c3' }}>
                   { templateUrl && templateUrl.length
                     ? templateUrl.map((data) => {
                       return <Grid item xs={12} md={4} sm={4}>
                         <Card key={data.id} {...data} className={classes.card_root}>
                           <div className={classes.title_row}>
                             <p className={classes.title_row1}>position  : {data.position}</p> <span className='vl' /> &nbsp;
                             <p className={classes.title_row1}>Event : {data.recieved_from.event_name}</p> <span className='vl' />&nbsp;
                             <p className={classes.title_row1}>Awarded Date : {moment(data.recieved_from.conducted_date).format('DD-MM-YYYY')}</p>
                           </div>
                           <CardActionArea>
                             <CardMedia
                               className={classes.img__sign}
                               component='img'
                               //  alt={`${data.certificate_file}`}
                               height='140'
                               src={`${data.certificate_file}`}
                               title={`${data.user.first_name}`}
                             />
                           </CardActionArea>
                           <CardActions>
                             <div className={classes.view__remove}>
                               <Button
                                 className={classes.viewButton}
                                 size='small'
                                 color='primary'
                                 onClick={() => this.openCertificate(`${data.certificate_file}`)}
                               >
                      View
                               </Button>
                               <Button
                                 className={classes.viewButton}
                                 size='small'
                                 color='primary'
                                 onClick={() => this.download(`${data.certificate_file}`)}
                               >
                      Download
                               </Button>
                             </div>
                           </CardActions>
                         </Card>
                         <Modal
                           aria-labelledby='transition-modal-title'
                           aria-describedby='transition-modal-description'
                           className={classes.modal}
                           open={open}
                           onClose={this.handleClose}
                           closeAfterTransition
                           BackdropComponent={Backdrop}
                           BackdropProps={{
                             timeout: 500
                           }}
                         >
                           <Fade in={open}>
                             <div className='modal__scroll'>
                               {/* <h2 id='transition-modal-title'>{data.name}</h2> */}
                               <img src={certificate} id='transition-modal-description' height='100%' />
                             </div>
                           </Fade>
                         </Modal>
                       </Grid>
                     }) : ''
                   }

                 </Grid>
               }
               <Grid />
             </Grid>
             : (!isCertificateLoading && !showCertificateResMessage) && <Typography align='center' style={{ marginTop: '100px' }}>There are  no certificates</Typography>}
         </TabPanel>
         <TabPanel value={this.state.currentTab} index={1}>

           <Grid container spacing={2} style={{ marginTop: '2%' }}>
             {badges && badges.length
               ? badges.map((data) => {
                 return <Grid item xs={12} md={4} sm={4}>
                   <Card key={data.id}>
                     <CardActionArea>
                       <img src={`${data.badges}`}
                         width='100%' />
                     </CardActionArea>
                   </Card>
                 </Grid>
               }) : ''}

           </Grid>
           {(!isBadgesLoading && !showBadgesResMessage) && <Typography align='center' style={{ marginTop: '100px' }}>There are no badges</Typography>}

         </TabPanel>

       </React.Fragment>
     )
   }
}

const mapStateToProps = state => ({
  user: state.authentication.user,
  roles: state.roles.items
})
export default connect(mapStateToProps)(withStyles(styles)(ViewCertificate))
