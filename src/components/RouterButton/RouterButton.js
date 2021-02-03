import withStyles from '@material-ui/core/styles/withStyles';
import Icon from '@material-ui/core/Icon/Icon';
import Button from '@material-ui/core/Button/Button';
import { NavLink } from 'react-router-dom';

const React = require('react');

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

class RouterButton extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.props = props;
  }

  render() {
    const { classes } = this.props;
    return (
      <Button
        className={classes.button}
        color='primary'
        variant='contained'
        style={{ paddingLeft: '1px' }}
        disabled={this.props.value.disabled}
        onClick={this.props.click ? this.props.click : null}
        component={NavLink}
        to={this.props.value.href ? this.props.value.href : '/'}
      >
        <Icon>{this.props.icon}</Icon> {this.props.value.label && this.props.value.label}
      </Button>
    );
  }
}

export default withStyles(styles)(RouterButton);
