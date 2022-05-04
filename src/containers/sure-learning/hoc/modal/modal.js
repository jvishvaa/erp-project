import React from 'react';
import PropTypes from 'prop-types';
import classes from './modal.module.css';
import Backdrop from '../backdrop/backdrop';

const Modal = ({
  open, small, medium, large, click, style, children,
}) => {
  let classNames = '';
  if (open && small) {
    classNames = classes.modal__small;
  } else if (open && medium) {
    classNames = classes.modal__medium;
  } else if (open && large) {
    classNames = classes.modal__large;
  } else if (open) {
    classNames = classes.modal;
  } else {
    classNames = classes.noModal;
  }
  return (
    <>
      <Backdrop
        open={open}
        click={click}
        zIndex={
          style && (style.zIndex || style['z-index'])
            ? style.zIndex || style['z-index']
            : null
        }
      />
      <div className={classNames} style={style}>
        {children}
      </div>
    </>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired,
  small: PropTypes.bool,
  medium: PropTypes.bool,
  large: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  children: PropTypes.node,
};

Modal.defaultProps = {
  small: false,
  medium: false,
  large: false,
  style: null,
  children: null,
};

export default Modal;
