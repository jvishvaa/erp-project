import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
// import Dialog from '@material-ui/core/Dialog'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
// import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
// import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
// import CloseIcon from '@material-ui/icons/Close'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import './publications.css'
import PdfGenerator from './pdfGenerator'
import { InternalPageStatus } from '../../ui'

const useStyles = (theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0)
  },
  paper: {
    paddingBottom: 50
  },
  list: {
    marginBottom: theme.spacing(2)
  },
  subheader: {
    backgroundColor: theme.palette.background.paper
  },
  appBar: {
    top: 'auto',
    bottom: 0
  },
  grow: {
    flexGrow: 1
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto'
  }
})

class PdfView extends Component {
  constructor (props) {
    super(props)
    this.state = {

      pageNumber: 1,
      totalpage: 1

    }
    this.getTotalPages.bind(this)
    this.handleLoading.bind(this)
  }

   onNextPageClick = () => {
     let{ pageNumber, totalpage } = this.state

     if (pageNumber < totalpage) {
       this.setState({ pageNumber: pageNumber + 1 })
       //   this.renderPage(pageNumber + 1)
     }
   }
   onPreviousPageClick = () => {
     let{ pageNumber } = this.state
     if (pageNumber > 1) {
       this.setState({ pageNumber: pageNumber - 1 })
       //   this.renderPage(pageNumber - 1)
     }
   }

   getTotalPages =(tpages) => {
     this.setState({ totalpage: tpages })
   }
   handleLoading =(loading) => {
     this.setState({ loading: loading })
   }
   //   const propsObj = {}
   render () {
     //  const { url, open, handleClick, classes } = this.props
     const { url } = this.props
     let{ pageNumber, totalpage, loading } = this.state

     return (
       <div>

         {/* <Dialog fullScreen open={open} onClose={handleClick} > */}
         {/* <AppBar > */}
         <Toolbar className='pdf-top-app-box'>
           <Button onClick={e => this.onPreviousPageClick()} style={{ background: '#8a8a8a' }}>
             <ArrowBackIcon disabled={!(pageNumber > 1)} />
           </Button>
           <Typography>{pageNumber} of {totalpage}</Typography>
           <Button
             onClick={e => this.onNextPageClick()}
             style={{ background: '#8a8a8a' }}
             disabled={!(pageNumber < totalpage)}
           >
             <ArrowForwardIcon />
           </Button>

         </Toolbar>
         {/* </AppBar> */}
         {loading && <InternalPageStatus label='loading...' /> }
         <React.Fragment>
           <PdfGenerator pageNumber={pageNumber} url={url} getTotalPages={this.getTotalPages} handleLoading={this.handleLoading} />
         </React.Fragment>
         {/* <AppBar position='fixed' color='primary' className={classes.appBar}>
           <Toolbar className='pdf-bottom-app-box'>
               <IconButton edge='start' color='black' onClick={handleClick} aria-label='close' style={{ background: 'aliceblue', color: 'black' }}>
                 <CloseIcon />
               </IconButton>
             </Toolbar>
         </AppBar> */}

         {/* </Dialog> */}
       </div>
     )
   }
}
export default (withStyles(useStyles)(withRouter(PdfView)))
