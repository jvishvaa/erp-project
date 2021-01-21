import React from 'react'

function FormLayer ({ textBoxes, values, setValues, onChange }) {
  console.log(values, textBoxes)
  return <div className='editor-form-layer'>
    {textBoxes.map(textBox => {
      let rect = textBox.rect
      return <textarea
        key={textBox.annotation.fieldName}
        value={values[textBox.annotation.fieldName]}
        name={textBox.annotation.fieldName}
        onChange={(e) => {
          console.log(e.target)
          if (e.target) {
            const value = e.target.value
            setValues(currentValues => {
              if (!currentValues) {
                currentValues = {}
              }
              let newCurrentValues = { ...currentValues }
              newCurrentValues[textBox.annotation.fieldName] = value
              onChange({ formData: newCurrentValues })
              return newCurrentValues
            })
          }
        }
        }
        style={{ position: 'absolute',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          left: rect[0],
          top: rect[1],
          fontFamily: "'Architects Daughter', cursive",
          fontSize: 18,
          color: 'blue',
          width: rect[2] - rect[0],
          height: rect[3] - rect[1]
        }
        } type='text' />
    })}
  </div>
}

export default FormLayer
