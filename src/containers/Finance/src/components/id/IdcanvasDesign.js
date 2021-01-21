import React from 'react'
// import JSZip from 'jszip'
// import { saveAs } from 'file-saver'
import { Button } from '@material-ui/core'

class IDCANVAS extends React.Component {
    designIDCanvas = () => {
      // var canvas = document.getElementById("id-card");
      var { keeper, studentId, address, contactNo, studentImgDataURI, rollNo, erp, DOB, branchAddress, logoURI, gradeAndSec, academicSessionYear, primaryNameKey, primaryNameValue, secondayNameValue, secondayNameKey, signDataURI, parentImgDataURI } = this.props.payLoad
      var canvas = document.createElement('CANVAS')
      canvas.width = 992
      canvas.height = 1542
      canvas.innerHTML = 'Your browser does not support the HTML5 canvas tag.'
      canvas.id = `student-canvas-${studentId}`
      this.canvas = canvas
      var context = canvas.getContext('2d')

      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)

      function schoolLogo () {
        var logoImage = new window.Image()
        logoImage.src = logoURI
        context.drawImage(logoImage, 162, 20, 664, 207)
      }
      var refY = 20 + 207
      schoolLogo()

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
        context.fillText(line, x, y)
        refY = refY + heightOftext
      }

      // school address
      var maxWidth = 900
      var lineHeight = 40
      var x = (canvas.width - maxWidth) / 2
      refY = refY + 35
      var y = refY
      // var text = 'bathin shedbahd Jodthbhim, Newtown, Kolkata, West Bengal 700156'
      var text = branchAddress
      var minAndMaxHeight = 170
      var defaultFontSize = 40// px
      var defaultNoOfLines = 4
      var isbold = true
      wrapText(context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines, isbold)
      // refY = refY + minAndMaxHeight

      // academic year
      academicYear()
      function academicYear () {
        context.font = 'bold 40px Calibri'
        context.textAlign = 'center'
        refY = refY + 5
        let minYPosition = 345
        let y = refY < minYPosition ? minYPosition : refY
        context.fillText(`Academic Year: ${academicSessionYear}`, canvas.width / 2, y)
        // alert(refY + 40)
        // refY = refY + 40
      }

      // student Image
      if (keeper === 'student') {
        studentImageFunc()
      } else {
        studentCumParentImageFunc()
      }
      function studentImageFunc () {
        var studentImage = new window.Image()
        studentImage.src = studentImgDataURI
        // studentImage.onload = function () { console.log('imgonload', studentId) }
        var studentImageHeight = 495
        var studentImageWidth = canvas.width / 2
        studentImageHeight = 400
        studentImageWidth = 400
        var x = canvas.width / 2 - studentImageWidth / 2 // logic to position image in center of canvas
        refY = refY + 20 // 20 is spacing to above element
        let minYpos = 365
        var y = refY < minYpos ? minYpos : refY
        // image border
        context.fillStyle = '#000'
        context.fillRect(x - 5, y - 5, studentImageWidth + 10, studentImageHeight + 10)
        context.fillStyle = '#fff'
        context.fillRect(x, y, studentImageWidth, studentImageHeight)

        context.drawImage(studentImage, x, y, studentImageWidth, studentImageHeight)
        refY = refY + studentImageHeight + 60
      }

      function studentCumParentImageFunc () {
        var studentImage = new window.Image()
        studentImage.src = studentImgDataURI
        var parentImage = new window.Image()
        parentImage.src = parentImgDataURI

        var imageHeight = 325
        var imageWidth = 300
        var x1 = canvas.width / 2 - imageWidth
        var x2 = canvas.width / 2 + 20

        refY = refY + 55 // 20 is spacing to above element
        let minYpos = 365
        var y = refY < minYpos ? minYpos : refY

        // student img border
        context.fillStyle = '#000'
        context.fillRect(x1 - 5, y - 5, imageWidth + 10, imageHeight + 10)
        context.fillStyle = '#fff'
        context.fillRect(x1, y, imageWidth, imageHeight)

        context.drawImage(studentImage, x1, y, imageWidth, imageHeight)
        // parent img border
        context.fillStyle = '#000'
        context.fillRect(x2 - 5, y - 5, imageWidth + 10, imageHeight + 10)
        context.fillStyle = '#fff'
        context.fillRect(x2, y, imageWidth, imageHeight)

        context.drawImage(parentImage, x2, y, imageWidth, imageHeight)
        refY = refY + imageHeight + 60
      }

      // student details
      var totalHeightOfStD
      var endYOfStD
      studentDetails()
      function studentDetails () {
        // student name limit upto  100char
        // student father name limit upto 76 char
        // let data = { stdName: 'Veera venkata naga hema manikanta satya harischandhra hegde medicherla srikrishna', stdFName: 'Satyanayana murthy medicherla hari vipindeva rangdhi ranga', stdDob: '2019-0-09', stdContact: '9666650723', stdGrade: 'Grade 1 Sec A' }
        let data = { primaryNameValue, secondayNameKey, gradeAndSec, rollNo, DOB, contactNo }
        // let { stdName, stdFName, stdDob, stdContact, stdGrade } = data
        var defaultFontSize = 40 // px
        context.font = `bold ${defaultFontSize}px Calibri`

        var stDX = 45 // 45 900 45
        // var stDY = 895// y start
        let minYPosition = 840
        var stDY = refY < minYPosition ? minYPosition : refY
        var spanRight = context.measureText('Grade & Section').width // max char size in left columns
        var marginLeft = 80 // 45|student name(width=spanright)|80|:25|575|45
        var spanTop = 50

        var lineHeight = 40
        var minAndMaxHeight = 210
        var defaultNoOfLines = 4
        var maxWidth = 579 // stdnt details 2nd column max -width

        // estime whole student details height
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
          spanTop = 50
        } else if (totalHeight >= 330 && totalHeight < 370) {
          spanTop = 60
        } else {
          spanTop = 65
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
        context.fillText(primaryNameKey, stDX, stDY)

        // |992|
        // |-45->|-336->|582|<-45->|
        x = spanRight + marginLeft
        y = stDY
        text = primaryNameValue
        // context.textAlign = 'left'
        // context.fillText("" + stdName, spanRight + marginLeft, stDY);
        context.fillText(': ', x, y)
        x = x + 25
        stDY = wrapTextSTDetails(context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines)

        // background color for secondary persons name row
        // stDX += spanTop
        stDY = stDY + spanTop
        context.textAlign = 'left'
        context.fillStyle = '#000000'
        // context.fillText('Father Name', stDX, stDY)
        context.fillText(secondayNameKey, stDX, stDY)

        text = secondayNameValue
        x = spanRight + marginLeft
        y = stDY

        context.fillText(': ', x, y)
        x = x + 25
        stDY = wrapTextSTDetails(context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines)

        // Roll no
        stDY = stDY + spanTop
        context.textAlign = 'left'
        context.fillStyle = '#000000'
        // context.fillText('Roll No', stDX, stDY)
        context.fillText('Enrollment Code', stDX, stDY)

        x = spanRight + marginLeft
        y = stDY
        context.fillText(': ', x, y)
        x = x + 25

        context.textAlign = 'left'
        context.fillStyle = '#000000'
        // context.fillText('20180422631', x, y)
        // context.fillText(rollNo, x, y)
        context.fillText(erp, x, y)

        // Grade and section
        stDY = stDY + spanTop
        context.textAlign = 'left'
        // context.fillText('Grade & Section', stDX, stDY)
        context.fillText('Grade', stDX, stDY)

        x = spanRight + marginLeft
        y = stDY
        context.fillText(': ', x, y)
        x = x + 25

        context.textAlign = 'left'
        context.fillText(gradeAndSec, x, y)

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

        // DOB
        stDY = stDY + spanTop
        context.textAlign = 'left'
        context.fillStyle = '#000000'
        context.fillText('D.O.B', stDX, stDY)

        x = spanRight + marginLeft
        y = stDY
        context.fillText(': ', x, y)
        x = x + 25

        context.textAlign = 'left'
        context.fillStyle = '#000000'
        context.fillText(DOB, x, y)

        // context.fillStyle = "#000000";
        // context.textAlign = 'left'
        // context.fillText('-----2-------', 100, y)
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

      // student address
      studentAddress()
      function studentAddress () {
        var maxWidth = 900
        var lineHeight = 40
        var x = (canvas.width - maxWidth) / 2
        // var y = 1350;
        var y = endYOfStD + 50 // relative to above data position
        // var text = 'Address: Acharya Jodthbhim, Major Arterial Road(South-East), Newtown, Jodthbhim, Newtown, Kolkata, West Bengal 700156'
        var text = `Address: ${address}`
        var minAndMaxHeight = (580 - totalHeightOfStD) < 170 ? (580 - totalHeightOfStD) : 170
        // minAndMaxHeight = (540 - totalHeightOfStD)
        var defaultFontSize = 40 // px
        var defaultNoOfLines = 2
        var isbold = true
        wrapText(context, text, x, y, maxWidth, lineHeight, minAndMaxHeight, defaultFontSize, defaultNoOfLines, isbold)
      }
      // principal signature
      principalSignature()
      function principalSignature () {
        var signImage = new window.Image()
        signImage.src = signDataURI
        // let imageWidth = 130
        // let imageHeight = 50
        // x = (canvas.width - 45) - imageWidth
        // y = canvas.height - 90
        // // x = 45
        // // y = 500
        let imageWidth = 200
        let imageHeight = 75
        x = (canvas.width - 60) - imageWidth
        y = canvas.height - 140
        // x = 45
        // y = 500
        context.drawImage(signImage, x, y, imageWidth, imageHeight)

        context.font = `bold 45px Calibri`
        // context.textAlign = "center";
        context.fillText('Principal', x + 30, y + 90)
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
                      '<body onload="window.focus(); window.print(); window.close();" style="margin: 0; padding: 0;">' +
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
      }
    }

    componentDidMount () {
      let { studentId } = this.props.payLoad
      this.preview(null, `student-canvas-container-${studentId}`)
    }

    preview = (imgDataUrl, divId) => {
      let { studentId } = this.props.payLoad
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
      let { branchId, gradeAndSec, academicSessionYear, primaryNameValue } = this.props.payLoad
      this.props.sendDataURI({ [`${studentId}`]: { dataURI: imgDataUrl, name: primaryNameValue }, folderName: `branch${branchId}-${gradeAndSec.replace(/\s/gi, '-')}-${academicSessionYear}` })
    }
    reloadCanvas=() => {
      let { studentId } = this.props.payLoad
      this.designIDCanvas()
      this.preview(null, `student-canvas-container-${studentId}`)
    }
    render () {
      let { studentId, primaryNameValue } = this.props.payLoad
      if (!this.idCardDataURI) {
        // draws canvas sets idCardDataURI for very render
        this.designIDCanvas()
      }
      return (
        <React.Fragment>
          <Button variant='outlined' size='small' onClick={this.reloadCanvas}>Refresh </Button>
          <Button variant='outlined' size='small' onClick={e => this.downloadURI(this.idCardDataURI, `${primaryNameValue}-sid${studentId}`)}>Download</Button>
          <Button variant='outlined' size='small' onClick={e => { this.print(this.idCardDataURI) }}>Print</Button>
          <div id={`student-canvas-container-${studentId}`} >.</div>
        </React.Fragment>
      )
    }
}
export default IDCANVAS
