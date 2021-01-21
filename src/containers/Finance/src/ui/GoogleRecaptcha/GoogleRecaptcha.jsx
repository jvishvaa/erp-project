import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { GOOGLE_RECAPTCHA_SITE_KEY } from '../../urls'

class GoogleRecaptcha extends React.Component {
  constructor (props, ...args) {
    super(props, ...args)
    this._reCaptchaRef = React.createRef()
  }

  handleChange = value => {
    this.props.onReCaptcha(value)
  };

  render () {
    return (
      <div>
        <ReCAPTCHA
          style={{ display: 'inline-block', width: '100%' }}
          theme='light'
          ref={this._reCaptchaRef}
          sitekey={GOOGLE_RECAPTCHA_SITE_KEY}
          onChange={this.handleChange}
        />

      </div>
    )
  }
}

export default GoogleRecaptcha
