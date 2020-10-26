import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { fetchRoles, setSelectedRole } from '../../redux/actions';
import RolesTable from '../../components/roles-table';

class RoleManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { fetchRoles } = this.props;
    fetchRoles();
  }

  editRole = (role) => {
    const { setSelectedRole: setRole, history, match } = this.props;
    setRole(role);
    history.push(`${match.url}/edit-role/${role.id}`);
  };

  deleteRole = () => {};

  render() {
    const { match, roles, fetchingRoles } = this.props;
    return (
      <div>
        <Button startIcon={<AddOutlinedIcon />} href={`${match.url}/create-role`}>
          Add Role
        </Button>

        <div>
          <RolesTable
            roles={roles}
            loading={fetchingRoles}
            onEdit={this.editRole}
            onDelete={this.deleteRole}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  roles: state.roleManagement.roles,
  fetchingRoles: state.roleManagement.fetchingRoles,
  selectedRole: state.roleManagement.selectedRole,
});

const mapDispatchToProps = (dispatch) => ({
  fetchRoles: (params) => {
    dispatch(fetchRoles(params));
  },
  setSelectedRole: (params) => {
    dispatch(setSelectedRole(params));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(RoleManagement);
