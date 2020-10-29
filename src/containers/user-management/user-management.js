import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';

class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { match } = this.props;
    return (
      <div>
        <Button startIcon={<AddOutlinedIcon />} href={`${match.url}/create-user`}>
          Add user
        </Button>
      </div>
    );
  }
}

export default UserManagement;
