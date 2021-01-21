import React, { useEffect, useCallback, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { urls } from '../../urls'

function AnnotateCanvas (props) {
  const { page, id, user, undo, zoom, pdfFile, height, width } = props

  const [loading, setLoading] = useState(false)
  const drawing = useCallback(() => {
    var canvas = document.getElementById(`drawing-${page}`)
    var contextCopy = canvas.getContext('2d')

    var x, y
    const startDrawing = event => {
      isMouseDown = true;
      [x, y] = [event.offsetX, event.offsetY]
    }

    const colorPicker = document.querySelector('.js-color-picker')
    colorPicker.addEventListener('change', event => {
      // setting pencil color

      contextCopy.strokeStyle = event.target.value
    })

    contextCopy.lineCap = 'round'
    const lineWidthRange = document.querySelector('.js-line-range')
    lineWidthRange.addEventListener('input', () => {
      contextCopy.lineWidthLabel = 0.005 * canvas.width
    })

    const drawLine = event => {
      if (isMouseDown) {
        const newX = event.offsetX
        const newY = event.offsetY
        contextCopy.beginPath()
        contextCopy.moveTo(x, y)
        contextCopy.lineTo(newX, newY)
        contextCopy.stroke()
        x = newX
        y = newY
      }
    }
    let isMouseDown = false

    const stopDrawing = () => {
      isMouseDown = false
      let data = canvas.toDataURL()
      let data1 =
            {
              'anotate_image': data,
              'ebook_id': id,
              'page_number': page,
              'top_position': x,
              'left_position': y,
              'type_of_activity': 0
            }
      let AnnotateURL = urls.AnnotateEbook + '?ebook_id=' + id
      axios.post(AnnotateURL, data1, {
        headers: {
          Authorization: 'Bearer ' + user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
        })
        .catch(error => {
          console.log(error)
        })
    }

    canvas.removeEventListener('mousedown', startDrawing)
    canvas.removeEventListener('mousemove', drawLine)
    canvas.removeEventListener('mouseup', stopDrawing)

    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', drawLine)
    canvas.addEventListener('mouseup', stopDrawing)
  }, [id, page, user])

  const undoData = useCallback(() => {
    console.log(undo)
  }, [undo])

  useEffect(() => {
    if (pdfFile) {
      let AnnotateURL = urls.AnnotateEbook + '?ebook_id=' + id + '&page_number=' + page
      setLoading(true)
      axios.get(AnnotateURL, {
        headers: {
          Authorization: 'Bearer ' + user,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          setLoading(false)
          let canvas = document.getElementById(`drawing-${page}`)

          let pageCanvas = document.getElementById('canvastyleview')

          console.log(pageCanvas)
          canvas.width = width
          canvas.height = height

          let context = canvas.getContext('2d')

          if (res.data.anotate_image !== undefined && res.data.anotate_image && res.data.anotate_image) {
            context.clearRect(0, 0, canvas.width, canvas.height)

            // eslint-disable-next-line no-undef
            let imgObj = new Image()
            imgObj.src = res.data.anotate_image
            imgObj.onload = () => {
              canvas.width = width
              canvas.height = height
              context.drawImage(imgObj, 0, 0, canvas.width, canvas.height)
            }
          }

          drawing()
          undoData()
        })
        .catch(error => {
          setLoading(false)
          console.log(error)
        })
    }
  }, [drawing, height, id, page, pdfFile, undo, undoData, user, width])

  return (

    <React.Fragment>
      <div>
        {
          loading ? ''

            : <canvas
              className='drwaing-resposive'
              id={`drawing-${page}`}
              key={`drawing-${page}`}

              style={{
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                background: 'transparent',
                margin: '0 auto',
                ' margin-left': 'auto',
                'margin-right': 'auto',
                // 'margin-bottom': '5%',
                cursor: 'pointer',
                transition: 'all 0.3s ease 0s',
                'margin-top': zoom ? '18%' : '5%',
                // backgroundColor: '#ff000045',
                // height: '100vh',
                transform: zoom ? 'scale(1.5,1.5)' : 'scale(1,1)'
              }}
            />
        }
      </div>

    </React.Fragment>

  )
}

const mapStateToProps = (state) => ({
  user: state.authentication.user
})
export default connect(mapStateToProps)(AnnotateCanvas)
