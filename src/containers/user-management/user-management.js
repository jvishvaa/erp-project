import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { DataGrid } from '@material-ui/data-grid';

import { fetchUsers } from '../../redux/actions';

class UserManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { fetchUsers } = this.props;
    fetchUsers();
  }

  render() {
    const { match, users } = this.props;
    const columns = [
      { field: 'id', headerName: 'ID' },
      { field: 'erp_id', headerName: 'ERP_ID' },
      { field: 'first_name', headerName: 'First name', width: 130 },
      { field: 'last_name', headerName: 'Last name' },
      { field: 'email', headerName: 'Email' },
      { field: 'roles', headerName: 'Roles' },
      { field: 'gender', headerName: 'Gender' },
      { field: 'contact', headerName: 'Contact' },
    ];
    return (
      <div>
        <Button
          startIcon={<AddOutlinedIcon />}
          href={`${match.url}/create-user`}
          style={{ marginTop: '3rem', marginBottom: '3rem' }}
        >
          Add user
        </Button>
        <div style={{ height: '70vh', width: '100%' }}>
          <DataGrid rows={users} columns={columns} pageSize={10} checkboxSelection />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  users: state.userManagement.users,
  current_page: state.userManagement.current_page,
  total_pages: state.userManagement.total_pages,
  count: state.userManagement.count,
});
const mapDispatchToProps = (dispatch) => ({
  fetchUsers: () => {
    return dispatch(fetchUsers());
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
