import React from 'react'
// import JSZip from 'jszip'
// import { saveAs } from 'file-saver'
import { Button } from '@material-ui/core'

class STAFFIDCANVAS extends React.Component {
    designIDCanvas = () => {
      // var canvas = document.getElementById("id-card");
      var {
        staffId,
        logoURI,
        primaryImgDataURI,
        primaryNameValue,
        ERP,
        designation,
        contactNo,
        address,
        signDataURI
      } = this.props.payLoad

      var canvas = document.createElement('CANVAS')
      canvas.width = 992
      canvas.height = 1542
      canvas.innerHTML = 'Your browser does not support the HTML5 canvas tag.'
      canvas.id = `staff-canvas-${staffId}`
      canvas.style.border = '1px solid black'
      this.canvas = canvas
      var context = canvas.getContext('2d')

      // white background
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      // context.fillStyle = '#000'
      // context.fillRect(0, 0, canvas.width, canvas.height)
      // context.fillStyle = '#ffffff'
      // context.fillRect(2, 2, canvas.width - 4, canvas.height - 4)

      function schoolLogo () {
        var logoImage = new window.Image()
        logoImage.src = logoURI
        context.drawImage(logoImage, 162, refY, 664, 207)
      }
      var refY = 30
      schoolLogo()
      refY += 207

      function getMetrics (context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines, isbold) {
        var noOfLines = 0
        var words = text.split(' ')
        var line = ''
        var heightOftext
        var fontSize = defaultFontSize
        function calculate () {
          noOfLines = 0
          words = text.split(' ')
          line = ''
          for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' '
            context.font = isbold ? `bold ${fontSize}px Calibri` : `${fontSize}px Calibri`
            var metrics = context.measureText(testLine)
            var testWidth = metrics.width
            if (testWidth > maxWidth && n > 0) {
              line = words[n] + ' '
              noOfLines = noOfLines + 1
            } else {
              line = testLine
            }
          }
          noOfLines = noOfLines + 1 // lastline count
          heightOftext = ((lineHeight * noOfLines) + 30)
        }
        calculate()
        if (heightOftext > minAndMaxHeight) {
          do {
            fontSize -= 0.005
            lineHeight -= 0.005
            calculate()
          }
          while (heightOftext > minAndMaxHeight)
        }
        var responsiveLineHeight = lineHeight
        // console.log({ heightOftext, fontSize, responsiveLineHeight })
        return { heightOftext, fontSize, responsiveLineHeight }
      }

      function wrapText (context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines, isbold) {
        // background
        context.fillStyle = '#faeb23'
        // var fontSize = 50
        // var noOfLines = 4

        var { heightOftext, fontSize, responsiveLineHeight } = getMetrics(context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines, isbold)
        // context.fillRect(0, 225, canvas.width, heightOftext + 15);
        context.fillRect(0, y - responsiveLineHeight, canvas.width, heightOftext)

        context.font = isbold ? `bold ${fontSize}px Calibri` : `${fontSize}px Calibri`
        context.fillStyle = '#000000'

        var words = text.split(' ')
        var line = ''
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' '
          var metrics = context.measureText(testLine)
          var testWidth = metrics.width
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y)
            line = words[n] + ' '
            y += responsiveLineHeight
          } else {
            line = testLine
          }
        }
        // console.log('mk', x, y)
        context.fillText(line, x, y)
        refY = refY + heightOftext
      }

      // staff Image
      staffImageFunc()

      function staffImageFunc () {
        var staffImage = new window.Image()
        staffImage.src = primaryImgDataURI
        // staffImage.onload = function () { console.log('imgonload', staffId) }
        var staffImageHeight = 495
        var staffImageWidth = canvas.width / 2
        staffImageHeight = 400
        staffImageWidth = 400
        var x = canvas.width / 2 - staffImageWidth / 2 // logic to position image in center of canvas
        refY = refY + 20 // 20 is spacing to above element
        let minYpos = 280
        var y = refY < minYpos ? minYpos : refY

        // border to employe img
        context.fillStyle = '#000'
        context.fillRect(x - 5, y - 5, staffImageWidth + 10, staffImageHeight + 10)
        context.fillStyle = '#fff'
        context.fillRect(x, y, staffImageWidth, staffImageHeight)

        context.drawImage(staffImage, x, y, staffImageWidth, staffImageHeight)
        refY = refY + staffImageHeight + 60
      }

      // staff details
      var totalHeightOfStD
      var endYOfStD
      staffDetails()
      function staffDetails () {
        let data = { primaryNameValue, designation, ERP, contactNo }
        var defaultFontSize = 50 // px
        context.font = `bold ${defaultFontSize}px Calibri`

        var stDX = 45 // 45 900 45
        // var stDY = 895// y start
        let minYPosition = 780
        var stDY = refY < minYPosition ? minYPosition : refY
        var spanRight = context.measureText('Grade & Section').width // max char size in left columns
        var marginLeft = 80 // 45|staff name(width=spanright)|80|:25|575|45
        var spanTop = 55

        var lineHeight = 50
        var minAndMaxHeight = 210
        var defaultNoOfLines = 4
        var maxWidth = 579 // stdnt details 2nd column max -width

        // estime whole staff details height
        let totalHeight = 0
        Object.values(data).map(value => {
          totalHeight += estimateHeight(context, value, x, y, maxWidth, lineHeight, defaultFontSize)
        })
        totalHeightOfStD = totalHeight
        spanTop = totalHeight >= 370 ? spanTop : 60
        // 370 is max height with max chars of data
        // if hght >= 370 spanTop 50
        // if 33o <=hght < 370 spanTop 60
        // if hght < 330 spanTop 65
        if (totalHeight >= 370) {
          spanTop = 55
        } else if (totalHeight >= 330 && totalHeight < 370) {
          spanTop = 65
        } else {
          spanTop = 75
        }

        // background color for primary persons name row
        var x = 0
        var y = stDY - 40
        let bgHeght = 55
        var text = primaryNameValue
        bgHeght = estimateHeight(context, text, x, y, maxWidth, lineHeight, defaultFontSize)
        context.fillStyle = '#faeb23'
        context.fillRect(x, y, canvas.width, bgHeght)

        context.fillStyle = '#000000'
        context.textAlign = 'left'
        context.fillText('Name', stDX, stDY)

        // |992|
        // |-45->|-336->|582|<-45->|
        x = spanRight + marginLeft
        y = stDY
        text = primaryNameValue

        context.fillText(': ', x, y)
        x = x + 25
        stDY = wrapTextSTDetails(context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines)

        // ERP no
        stDY = stDY + spanTop
        context.textAlign = 'left'
        context.fillStyle = '#000000'
        context.fillText('ERP Code', stDX, stDY)

        x = spanRight + marginLeft
        y = stDY
        context.fillText(': ', x, y)
        x = x + 25

        context.textAlign = 'left'
        context.fillStyle = '#000000'
        // context.fillText('20180422631', x, y)
        context.fillText(ERP, x, y)

        // Designation
        stDY = stDY + spanTop
        context.textAlign = 'left'
        context.fillText('Designation', stDX, stDY)

        x = spanRight + marginLeft
        y = stDY
        context.fillText(': ', x, y)
        x = x + 25

        context.textAlign = 'left'
        context.fillText(designation, x, y)

        // Contact
        stDY = stDY + spanTop
        context.textAlign = 'left'
        context.fillStyle = '#000000'
        context.fillText('Contact', stDX, stDY)

        x = spanRight + marginLeft
        y = stDY
        context.fillText(': ', x, y)
        x = x + 25

        context.textAlign = 'left'
        context.fillStyle = '#000000'
        context.fillText(contactNo, x, y)

        endYOfStD = y
      }

      function estimateHeight (context, text, x, y, maxWidth, lineHeight, defaultFontSize) {
        var noOfLines = 0
        let heightOftext
        let fontSize = defaultFontSize
        context.font = `bold ${fontSize}px Calibri`
        context.fillStyle = '#000000'

        var words = text.split(' ')
        var line = ''
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' '
          var metrics = context.measureText(testLine)
          var testWidth = metrics.width
          if (testWidth > maxWidth && n > 0) {
            // context.fillText(line, x, y);
            line = words[n] + ' '
            noOfLines = noOfLines + 1
          } else {
            line = testLine
          }
        }
        noOfLines = noOfLines + 1 // lastline count
        heightOftext = ((lineHeight * noOfLines) + 10)
        return heightOftext
      }
      function wrapTextSTDetails (context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines) {
        let fontSize = defaultFontSize
        context.font = `bold ${fontSize}px Calibri`
        context.fillStyle = '#000000'

        var words = text.split(' ')
        var line = ''
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' '
          var metrics = context.measureText(testLine)
          var testWidth = metrics.width
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y)
            line = words[n] + ' '
            y += lineHeight
          } else {
            line = testLine
          }
        }
        context.fillText(line, x, y)
        return y // for next line position
      }

      // staff address
      staffAddress()
      function staffAddress () {
        var maxWidth = 900
        var lineHeight = 50
        var x = (canvas.width - maxWidth) / 2
        var y = endYOfStD + 80 // relative to above data position
        var text = `Address: ${address}`
        var minAndMaxHeight = (580 - totalHeightOfStD) < 200 ? (580 - totalHeightOfStD) : 200
        var defaultFontSize = 50 // px
        var defaultNoOfLines = 2
        var isbold = true
        wrapText(context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines, isbold)
      }

      // principal signature
      principalSignature()
      function principalSignature () {
        var signImage = new window.Image()
        signImage.src = signDataURI

        let imageWidth = 250
        let imageHeight = 100
        let x = (canvas.width - 60) - imageWidth
        let y = canvas.height - 200

        context.drawImage(signImage, x, y, imageWidth, imageHeight)

        context.font = `bold 50px Calibri`
        context.fillText('Principal', x + 30, y + 120)
      }

      this.idCardDataURI = this.canvas.toDataURL('image/png')
    }
    downloadURI = (uri, name) => {
      let confirm = window.confirm('Please make sure images are loaded in id card preview, if not press "REFRESH" button')
      if (!confirm) {
        return null
      }
      var link = document.createElement('a')
      link.download = name
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    // downloadAsZip = (dataURIs) => {
    //   var zip = new JSZip()
    //   zip.file('id.txt', 'Hello World\n')
    //   var img = zip.folder('images')
    //   img.file('id1.png', this.imgDataUrl.replace(/^data:image\/(png|jpg);base64,/, ''), { base64: true })
    //   zip.generateAsync({ type: 'blob' })
    //     .then((content) => {
    //       // see FileSaver.js
    //       saveAs(content, 'example.zip')
    //     })
    // }

    // convert = () => {
    //   let imgDataUrl = this.canvas.toDataURL('image/png')
    //   this.imgDataUrl = imgDataUrl

    //   this.downloadAsZip([imgDataUrl, imgDataUrl])
    // }

    componentWillReceiveProps (nextProps) {
      if (nextProps.reload !== this.props.reload) {
        // re drawsing canvas and rending to container to load images
        this.reloadCanvas()
        console.log('reload check, componentWillReceiveProps')
      }
    }

    componentDidMount () {
      let { staffId } = this.props.payLoad
      this.preview(null, `staff-canvas-container-${staffId}`)
    }

    print = (imagePath) => {
      let confirm = window.confirm('Please make sure all images are loaded in id card preview, if not press "REFRESH"')
      if (!confirm) {
        return null
      }
      window.confirm('For better print quality, download images to your computer then print')

      var width = window.innerWidth
      var height = window.innerHeight
      var content = '<!DOCTYPE html>' +
                      '<html>' +
                      '<head><title></title></head>' +
                      '<style>@page {' +
                        'size: 54mm 85mm;' +
                        'margin: 0;</style>' +
                      '<body onload="window.focus(); window.print(); window.close();" style="margin: 0; padding: 0; page-break-after: always;">' +
                      '<img src="' + imagePath + '" style="width: 100%; margin: 0; padding: 0;" />' +
                      '</body>' +
                      '</html>'
      var options = 'toolbar=no,location=no,directories=no,menubar=no,scrollbars=yes,width=' + width + ',height=' + height
      var printWindow = window.open('', 'print', options)
      if (printWindow) {
        printWindow.document.open()
        printWindow.document.write(content)
        printWindow.document.close()
        printWindow.focus()
      }
    }
    preview = (imgDataUrl, divId) => {
      let { staffId } = this.props.payLoad
      imgDataUrl = imgDataUrl || this.idCardDataURI
      if (!imgDataUrl) {
        return null
      }
      var image = new window.Image()
      image.src = imgDataUrl
      // ratio (canvas msrmnts) 1554(h)/992(w) = 1.5665
      image.width = 300
      image.height = (image.width * 1.5665)
      let containerDiv = document.getElementById(divId)
      let oldNode = containerDiv.childNodes[0]
      containerDiv.replaceChild(image, oldNode)
      // send idCardDataURI to parent
      let { branchId, primaryNameValue, department } = this.props.payLoad
      this.props.sendDataURI({ [`${staffId}`]: { dataURI: imgDataUrl, name: primaryNameValue }, folderName: `branch${branchId}-${department}` })
    }
    reloadCanvas=() => {
      console.log('reload check, reloadCanvas')
      let { staffId } = this.props.payLoad
      this.designIDCanvas()
      this.preview(null, `staff-canvas-container-${staffId}`)
    }
    render () {
      let { staffId, primaryNameValue } = this.props.payLoad
      if (!this.idCardDataURI) {
        // draws canvas sets idCardDataURI for very render
        this.designIDCanvas()
      }
      return (
        <React.Fragment>
          <Button variant='outlined' size='small' onClick={this.reloadCanvas}>Refresh </Button>
          <Button variant='outlined' size='small' onClick={e => this.downloadURI(this.idCardDataURI, `${primaryNameValue}-sid${staffId}`)}>Download</Button>
          <Button variant='outlined' size='small' onClick={e => { this.print(this.idCardDataURI) }}>Print</Button>
          <div id={`staff-canvas-container-${staffId}`} >.</div>
        </React.Fragment>
      )
    }
}
export default STAFFIDCANVAS
