/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import html2canvas from 'html2canvas'
import axios from 'axios'
import moment from 'moment'
import { InternalPageStatus } from '../../../ui'

const useStyles = theme => ({
  root: {
    maxWidth: 345
  }
})

function Home (props) {
  let src = props.src
  let { erp, name, rank, grade, event, mapId, sectionMapId, signatureName, signatureDesignation, branch } = props
  let date = props.eventDate
  let signature_id = props.signId
  let stringDate = moment(date).format('DD-MMM-YYYY')
  stringDate = stringDate.replace(/-/g, ' ')
  let signature = props.signature
  const [data, setData] = React.useState(null)
  const [url, setUrl] = useState(true)
  useEffect(() => {
    loadTemplate()
  })
  const loadTemplate = () => {
    let blob = null
    if (data === null) {
      axios
        .get(src, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'text/plain'
          } })
        .then(res => {
          blob = res.data
          // blob = ``
          // setBlobdata(blob)
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
    HTMLString = HTMLString.replace('<p hidden>{{student-name}}</p>', `<h1 draggable style="color:#826d03;font-size: 40px; position: relative; top:-43px; right:${right || 0}px; bottom:${bottom || 0}px; left:${left || 0}px;" >${name}</h1>`)
    HTMLString = HTMLString.replace('<p hidden style="display: none!important;">{{student-class}}</p>', `<h2 draggable style="color:#826d03;font-weight: 300;font-size: 35px;position: relative; top:-43px; right:${right || 0}px; bottom:${bottom || 0}px; left:50px;" >${grade}</h1>`)
    HTMLString = HTMLString.replace('<p hidden style="display: none!important;">{{student-position}}</p>', `<h2 draggable style="color:#826d03;font-weight: 300;font-size: 35px;position: relative; top:-43px; right:${right || 0}px; bottom:${bottom || 0}px; left:80px;" >${rank}${rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : ''} </h1>`)
    HTMLString = HTMLString.replace('<p hidden style="display: none!important;">{{student-event}}</p>', `<h2 draggable style="color:#826d03;font-weight: 300;font-size: 35px; position: relative; top:-43px; right:${right || 0}px; bottom:${bottom || 0}px; left:70px;" >${event}</h1>`)
    HTMLString = HTMLString.replace('<p hidden>{{event-date}}</p>', `<h2 draggable style="color:#826d03;font-weight: 300;font-size: 35px;position: relative; top:7px; right:${right || 0}px; bottom:${bottom || 0}px; left:0px;" >${stringDate}</h2>`)
    HTMLString = HTMLString.replace('<p hidden>{{signature-name}}</p>', `<p draggable style="font-weight: 300;font-size: 35px;position: relative; top:5px; right:${right || 0}px; bottom:${bottom || 0}px; left:0px;" >${signatureName}</p>`)
    HTMLString = HTMLString.replace('<p hidden>{{signature-designation}}</p>', `<p draggable style="font-weight: 300;font-size: 24px;position: relative; top:5px; right:${right || 0}px; bottom:${bottom || 0}px; left:0px;" >${signatureDesignation}</p>`)
    HTMLString = HTMLString.replace('<p hidden>{{signature-img}}</p>', `<img height='20px' src=${signature} />`)
    let doc = document.implementation.createHTMLDocument()
    doc.open()
    doc.write(HTMLString)
    doc.close()
    console.log('hel')
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
    setTimeout(function () {
      let iframedoc = iframe.contentDocument || iframe.contentWindow.document
      iframedoc.body.innerHTML = HTMLString
      html2canvas(iframedoc.body, { scrollX: 0, scrollY: 0, x: -10 }, { type: 'view' })
        .then(function (canvas) {
          setTimeout(() => {
            //   document.getElementsByTagName('iframe').parentNode.style.overflow = 'hidden'
            document.body.appendChild(iframe)
            let imgSrcExt = 'png'
            const imageData64 = canvas.toDataURL('image/' + imgSrcExt)
            // downloadBase64File(imageData64, 'certificate')
            let myFilename = String(new Date().getTime()) + '.' + imgSrcExt
            const fileObj = base64StringtoFile(imageData64, myFilename)
            // document.body.appendChild(canvas)
            let img = document.getElementById('canvas')
            if (img) {
              img.setAttribute('src', imageData64)
              props.handleSubmit(erp, rank, branch, mapId, sectionMapId, signature_id, fileObj)
              document.body.removeChild(iframe)
            }
          }, 1000)
          setUrl(false)
        })
    }, 1000)
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
          {url ? <InternalPageStatus label={'Please wait.. Certificate is Loading...!'} />
            : <img style={{ maxWidth: '100%',
              height: 'auto' }}id='canvas' />
          }
        </div>
      </div>
    </div>
  </React.Fragment>
}
export default (withStyles(useStyles)(Home))
