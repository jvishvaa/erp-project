import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { fetchRoles, setSelectedRole, deleteRole } from '../../redux/actions';
import RolesTable from '../../components/roles-table';
import styles from './useStyles';

class RoleManagement extends Component {
  constructor(props) {
    super(props);
    this.state = { openDeleteModal: false, selectedRole: null };
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

  handleDeleteRole = () => {
    const { deleteRole } = this.props;
    const {
      selectedRole: { id },
    } = this.state;
    deleteRole({ role: id });
    this.handleCloseDeleteModal();
  };

  handleOpenDeleteModal = (role) => {
    this.setState({ selectedRole: role });
    this.setState({ openDeleteModal: true });
  };

  handleCloseDeleteModal = () => {
    this.setState({ openDeleteModal: false });
    this.setState({ selectedRole: null });
  };

  render() {
    const { match, roles, fetchingRoles, classes } = this.props;
    const { openDeleteModal, selectedRole } = this.state;
    return (
      <div>
        <div className={classes.buttonContainer}>
          <Button startIcon={<AddOutlinedIcon />} href={`${match.url}/create-role`}>
            Add Role
          </Button>
        </div>

        <div>
          <RolesTable
            roles={roles}
            loading={fetchingRoles}
            onEdit={this.editRole}
            onDelete={this.handleOpenDeleteModal}
          />
        </div>
        <Dialog
          open={openDeleteModal}
          onClose={this.handleCloseDeleteModal}
          aria-labelledby='draggable-dialog-title'
        >
          <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
            Delete Role
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Confirm delete role ${selectedRole?.role_name}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleCloseDeleteModal} color='secondary'>
              Cancel
            </Button>
            <Button onClick={this.handleDeleteRole}>Confirm</Button>
          </DialogActions>
        </Dialog>
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
  deleteRole: (params) => {
    dispatch(deleteRole(params));
  },
  setSelectedRole: (params) => {
    dispatch(setSelectedRole(params));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RoleManagement));
