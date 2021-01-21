import React from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

class InputElements {
  constructor (props) {
    this.props = props
  }
    styles = theme => {
      if (!theme) { return {} }
      return {
        root: {
          width: '90%'
        },
        container: {
          display: 'flex',
          width: '85vw',
          flexWrap: 'wrap'
        },
        textField: {
          boxSiizing: 'border-box',
          marginLeft: theme.spacing.init * 2,
          marginRight: theme.spacing.unit * 2,
          // width: 200,
          width: '20%',
          height: 'auto'
        },
        textFieldDate: {
          // width: 310,
          width: '30.7%',
          height: 'auto'
        },
        textFieldArea: {
          // width: 850,
          width: '84%',
          height: 'auto'
        },
        dense: {
          marginTop: 19
        },
        menu: {
          width: 200
        },
        button: {
          marginTop: theme.spacing.unit,
          marginRight: theme.spacing.unit
        },
        actionsContainer: {
          marginBottom: theme.spacing.unit * 2
        },
        resetContainer: {
          padding: theme.spacing.unit * 3
        }
      }
    }
    validate = (jsonData, form = new FormData(), isAxiosTouched) => {
      let isError = false
      jsonData.forEach(input => {
        if (isError === false) {
          isError = (form.get(input.name) === '' && isAxiosTouched && input.required)
        }
        if (input.name === 'roll_no') {
          let user = localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile')).personal_info : undefined
          this.role = user ? user.role : undefined
          if (this.role === 'Student') {
            input.required = false
          }
        }
        console.log('inputelement', { name: input.name, required: input.required, 'isTOcuc': isAxiosTouched })
      })
      console.log('inputelement', isError)
      return (!isError)
    }
  render = (jsonData, form = new FormData(), isAxiosTouched, isValueRequired, dataArrived) => {
    console.log(isValueRequired, dataArrived)
    let { classes } = this.props
    return jsonData.map(input => {
      let extraProps = {}
      if (!input.type) { return null }
      if (input.type === 'date') {
        extraProps = {
          InputProps: {
            startAdornment: <InputAdornment position='start'>{input.label || 'label field is empty'}</InputAdornment>
          },
          label: null,
          className: [classes.textField, classes.textFieldDate]
        }
      }
      if (input.type === 'textarea') {
        extraProps = {
          className: [classes.textField, classes.textFieldArea],
          multiline: true
        }
      }
      return <TextField
        error={(form.get(input.name) === '' && isAxiosTouched && input.required)}
        required={input.required || false}
        key={input.name}
        autoComplete='new-password'
        id={input.name}
        label={input.label || 'label field is empty'}
        name={input.name}
        type={input.type}
        className={[classes.textField]}
        margin='normal'
        variant='outlined'
        placeholder={input.type === 'password' ? 'unchanged' : ''}
        {...extraProps}
        pattern={input.pattern}
        // {...(isValueRequired && dataArrived) ? { value: input.value } : {}}
        value={input.value}
        disabled={input.disabled}
        InputLabelProps={{ shrink: true }}
        inputProps={
          input.name === 'roll_no' ? {
            maxLength: 2
          } : ''

        }
      />
    })
  }
}
export default InputElements
