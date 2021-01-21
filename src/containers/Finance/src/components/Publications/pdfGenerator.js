import React, { Component } from 'react'
import pdfjsLib from 'pdfjs-dist'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

const useStyles = (theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
})

class PdfGenerator extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scale: 1,
      pageNumber: this.props.pageNumber,
      totalpage: 1,
      fetchingPdf: false,
      url: this.props.url,
      open: false,
      responsiveWidth: 0,
      responsiveHeight: 0
    }
    this.canvasElement = React.createRef()
  }
  componentWillMount () {
    this.setState({ fetchingPdf: true })
    this.props.handleLoading(true)
    let { pageNumber, url } = this.state
    var loadingTask = pdfjsLib.getDocument(url)
    loadingTask.promise.then((pdf) => {
      this.renderPage(pageNumber, pdf)
      this.setState({ pdfDoc: pdf })
    }, function (reason) {
      console.log('error while loading')
      // PDF loading error
      console.error(reason)
    })
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.pageNumber !== this.props.pageNumber) {
      this.renderPage(nextProps.pageNumber)
    }
  }

   renderPage = (pgNum, pdf) => {
     //  this.setState({ fetchingPdf: true })
     this.setState({ fetchingPdf: true })
     this.props.handleLoading(true)
     let{ pdfDoc, scale } = this.state
     console.log(pdf, pdfDoc)

     let pdfDocObj = pdf || pdfDoc
     this.props.getTotalPages(pdfDocObj.numPages)

     pdfDocObj.getPage(pgNum).then((page) => {
       console.log('rendering...........')
       var viewport = page.getViewport({ scale: scale })
       // Prepare canvas using PDF page dimensions
       var canvas = this.canvasElement.current
       var context = canvas.getContext('2d')
       if (canvas) {
         canvas.height = viewport.height
         canvas.width = viewport.width

         var newHeight = (canvas.height / 2)
         if (!window.isMobile) {
           newHeight = (canvas.height / 2) + 50
         }

         this.setState({ responsiveHeight: newHeight })
       }

       // Render PDF page into canvas context
       var renderContext = {
         canvasContext: context,
         viewport: viewport
       }
       var renderTask = page.render(renderContext)
       renderTask.promise.then(() => {
         console.log('Page rendered')
         this.setState({ fetchingPdf: false })
         this.props.handleLoading(false)
         this.setState({ open: true })
       })
     })
   }

   render () {
     //  let { responsiveHeight } = this.state
     return (

       <div style={{ width: '100%', height: '100%', display: this.state.fetchingPdf ? 'none' : 'block' }} >

         <canvas ref={this.canvasElement} className='canvas-pdf' />
       </div>

     )
   }
}

export default (withStyles(useStyles)(withRouter(PdfGenerator)))
