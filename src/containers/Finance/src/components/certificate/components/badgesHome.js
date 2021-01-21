/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import html2canvas from 'html2canvas'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import { urls } from '../../../urls'
import { InternalPageStatus } from '../../../ui'

const useStyles = theme => ({
  root: {
    maxWidth: 345
  }
})

function BadgesHome (props) {
  // // eslint-disable-next-line no-debugger
  // debugger
  //   let src = props.src
  //   let { erp, name, rank, grade, event, mapId, signatureName, signatureDesignation } = props
  let event = props.event
  let date = props.eventDate
  let stringDate = moment(date).format('DD-MMM-YYYY')
  stringDate = stringDate.replace(/-/g, ' ')
  //   let signature = props.signature
  // let Preview = props.preview
  let categoryId = props.catergoryId
  const [src, setSrc] = React.useState(null)
  const [data, setData] = React.useState(null)
  const [url, setUrl] = useState(true)
  useEffect(() => {
    getBadgeTemplate()
    loadTemplate()
    console.log('hello')
  })
  const getBadgeTemplate = () => {
    if (src === null) {
      axios.get(`${urls.BadgeTemplates}?category_id=${categoryId}`, {
        headers: {
          Authorization: 'Bearer ' + props.user
        }

      }).then(res => {
        let { data: { data = {} } = {} } = res
        console.log(res)
        // // eslint-disable-next-line no-debugger
        // debugger
        // data.map(item => {
        //   setSrc(item.badges_template)
        // })
        console.log(data)
        if (data && data.badges_template_url) {
          setSrc(data.badges_template_url)
        }
      }).catch(error => {
        // // eslint-disable-next-line no-debugger
        // debugger
        console.log(JSON.stringify(error), error)
        let { response: { data: { status } = {} } = {}, message } = error
        if (!status && message) {
          props.alert.error(JSON.stringify(message))
        } else {
          props.alert.error(JSON.stringify(status))
        }
      })
    }
  }
  const loadTemplate = () => {
    // // eslint-disable-next-line no-debugger
    // debugger
    let blob = null
    if (data === null && src) {
      console.log(src, 'src')
      axios
        .get(src, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'text/plain'
          } })
        .then(res => {
          blob = res.data
          // blob = ``
          //   setBlobdata(blob)
          console.log(blob)
          setData(blob)

          // blob = xhr.response// xhr.response is now a blob object
          let oMyBlo = new Blob([blob], { type: 'text/html' })
          let reader = new FileReader()
          reader.onload = function (e) {
            let HTMLStrin = e.target.result
            renerCertificate(HTMLStrin)
            let doc = document.implementation.createHTMLDocument()
            doc.open()
            doc.write(blob)
            doc.close()
          }
          reader.readAsText(oMyBlo)
          setData(oMyBlo)
        })
        .catch(e => console.log('a'))
    }
  }

  function renerCertificate (HTMLString, top, right, bottom, left) {
    console.log('hello')
    // HTMLString = HTMLString.replace('<p hidden>{{student-name}}</p>', `<h1 draggable style="color:#826d03;font-size: 40px; position: relative; top:-43px; right:${right || 0}px; bottom:${bottom || 0}px; left:${left || 0}px;" >${name}</h1>`)
    // HTMLString = HTMLString.replace('<p hidden style="display: none!important;">{{student-class}}</p>', `<h2 draggable style="color:#826d03;font-weight: 300;font-size: 40px;position: relative; top:-50px; right:${right || 0}px; bottom:${bottom || 0}px; left:50px;" >${grade}</h1>`)
    // HTMLString = HTMLString.replace('<p hidden style="display: none!important;">{{student-position}}</p>', `<h2 draggable style="color:#826d03;font-weight: 300;font-size: 40px;position: relative; top:-50px; right:${right || 0}px; bottom:${bottom || 0}px; left:60px;" >${rank}${rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : ''} </h1>`)
    HTMLString = HTMLString.replace('<h1 hidden>{{student-event}}</h1>', `<h1 draggable style="font-weight: 300;font-size: ${event.length >= 20 ? '35' : '40'}px; position: relative; top:0px; right:${right || 0}px; bottom:${bottom || 0}px; left:5px;" >${event}</h1>`)
    HTMLString = HTMLString.replace(' <h1 hidden>{{event-date}}</h1>', `<h1 draggable style="font-weight: 300;font-size: 35px;position: relative; top:5px; right:${right || 0}px; bottom:${bottom || 0}px; left:15px;" >${stringDate}</h2>`)
    // HTMLString = HTMLString.replace('<p hidden>{{signature-name}}</p>', `<p draggable style="font-weight: 300;font-size: 35px;position: relative; top:5px; right:${right || 0}px; bottom:${bottom || 0}px; left:0px;" >${signatureName}</p>`)
    // HTMLString = HTMLString.replace('<p hidden>{{signature-designation}}</p>', `<p draggable style="font-weight: 300;font-size: 24px;position: relative; top:5px; right:${right || 0}px; bottom:${bottom || 0}px; left:0px;" >${signatureDesignation}</p>`)
    // HTMLString = HTMLString.replace('<p hidden>{{signature-img}}</p>', `<img height='20px' src=${signature} />`)
    // let doc = document.implementation.createHTMLDocument()
    // doc.open()
    // doc.write(HTMLString)
    // doc.close()
    // console.log('hel')
    downloadFile(HTMLString)
    downloadFile(HTMLString)
  }
  //   function downloadBase64File (dataURL, filename) {
  //     var element = document.createElement('a')
  //     element.setAttribute('href', dataURL)
  //     element.setAttribute('download', filename)
  //     document.body.appendChild(element)
  //     console.log(element)
  //     element.click()
  //     document.body.removeChild(element)
  //     // setElement(element)
  //   }

  // Convert a Base64-encoded string to a File object
  function base64StringtoFile (base64String, filename) {
    let arr = base64String.split(','); let mime = arr[0].match(/:(.*?);/)[1]
    // eslint-disable-next-line no-undef
    let bstr = atob(arr[1]); let n = bstr.length; let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    // eslint-disable-next-line no-undef
    return new File([u8arr], filename, { type: mime })
  }
  function downloadFile (HTMLString) {
    console.log(HTMLString)
    let iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    document.getElementsByTagName('IFRAME')[0].style.opacity = '0'
    setTimeout(function () {
      let iframedoc = iframe.contentDocument || iframe.contentWindow.document
      iframedoc.body.innerHTML = HTMLString
      html2canvas(iframedoc.body, { scrollX: 0, scrollY: 0 }, { type: 'view' })
        .then(function (canvas) {
          let imgSrcExt = 'png'
          const imageData64 = canvas.toDataURL('image/' + imgSrcExt)
          // downloadBase64File(imageData64, 'certificate')
          let myFilename = String(new Date().getTime()) + '.' + imgSrcExt
          const fileObj = base64StringtoFile(imageData64, myFilename)
          // document.body.appendChild(canvas)
          document.body.removeChild(iframe)
          //   console.log(fileObj)
          props.handleBadgesSubmit(fileObj)
          //   let img = document.getElementById('canvas')
          //   if (img) {
          //     img.setAttribute('src', imageData64)
          //     props.handleBadgesSubmit(fileObj)
          //     document.body.removeChild(iframe)
          //   }
          setUrl(false)
        })
    }, 500)
  }
  // For Display Dom in  the Preview

  //   function downloadFile () {
  //     // eslint-disable-next-line no-undef
  //     // const el = document.getElementById('certificate-view')
  //     // el.style.display = 'block'
  //     document.getElementById('certificate-view').style.height = 'auto'
  //     document.getElementById('certificate-view').style.overflow = 'show'
  //     html2canvas(document.getElementById('certificate-view'), { scrollX: 0, scrollY: 0 })
  //       .then(function (canvas) {
  //         // debugger
  //         // var dataURL = canvas.toDataURL('image/png')
  //         // document.body.removeChild(element)
  //         // setUrl(dataURL)
  //         document.getElementById('certificate-view').parentNode.style.overflow = 'hidden'
  //         let imgSrcExt = 'png'
  //         const imageData64 = canvas.toDataURL('image/' + imgSrcExt)
  //         // downloadBase64File(imageData64, 'certificate')
  //         let myFilename = String(new Date().getTime()) + '.' + imgSrcExt
  //         const fileObj = base64StringtoFile(imageData64, myFilename)
  //         // document.body.appendChild(canvas)
  //         props.handleSubmit(erp, rank, fileObj)
  //       })
  //     // console.log(element)
  //   }

  // Position of the Values
  //   function movePosition (value, positionType) {
  //     window[positionType] = value
  //     renerCertificate(HTMLString, window.topP, window.rightP, window.bottomP, window.leftP)
  //   }
  return <React.Fragment>
    <div id='hello'>
      <div>
        <div>
          {
            url && <InternalPageStatus label={'Please wait.. getting participants...!'} />
            // : <img style={{ maxWidth: '100%',
            //   height: 'auto' }}id='canvas' />
          }
        </div>
      </div>
    </div>
  </React.Fragment>
}
const mapStateToProps = state => ({
  user: state.authentication.user
})
export default connect(mapStateToProps)(withStyles(useStyles)(BadgesHome))
