import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { debounce } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import RoleCard from '../../components/role-card';
import {
  fetchRoles,
  setSelectedRole,
  deleteRole,
  searchRoles,
} from '../../redux/actions';
import RolesTable from '../../components/roles-table';
import Loading from '../../components/loader/loader';
import styles from './useStyles';
import './styles.scss';

class RoleManagement extends Component {
  constructor(props) {
    super(props);
    this.state = { openDeleteModal: false, selectedRole: null, searchInput: '' };
    this.handleSearchRoles = debounce(this.handleSearchRoles, 500);
  }

  componentDidMount() {
    const { fetchRoles, limit } = this.props;
    fetchRoles({ page: 1, limit });
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

  handlePageChange = (page) => {
    const { limit, fetchRoles, searchRoles } = this.props;
    const { searchInput } = this.state;
    console.log('page change ', page);
    if (searchInput) {
      fetchRoles({ page, limit });
    } else {
      searchRoles({ roleName: searchInput, page, limit });
    }
  };

  handleSearchRoles = (searchInput) => {
    const { limit, searchRoles } = this.props;
    searchRoles({ roleName: searchInput, page: 1, limit });
  };

  handleSearchInputChange = (e) => {
    this.setState({ searchInput: e.target.value });
    this.handleSearchRoles(e.target.value);
  };

  render() {
    const { match, roles, fetchingRoles, classes, page, limit, count } = this.props;
    const { openDeleteModal, selectedRole, searchInput } = this.state;

    return (
      <div>
        <div className={classes.buttonContainer}>
          <Button startIcon={<AddOutlinedIcon />} href={`${match.url}/create-role`}>
            Add Role
          </Button>
        </div>
        <Box my={2} className={classes.searchContainer}>
          <OutlinedInput
            endAdornment={<SearchOutlined color='primary' />}
            value={searchInput}
            onChange={this.handleSearchInputChange}
            placeholder='Search roles ...'
          />
        </Box>

        <div className={classes.rolesTableContainer}>
          {fetchingRoles ? (
            <Loading message='fetching roles ..' />
          ) : (
            <RolesTable
              roles={roles}
              loading={fetchingRoles}
              onEdit={this.editRole}
              onDelete={this.handleOpenDeleteModal}
              page={page}
              limit={limit}
              count={count}
              onChangePage={this.handlePageChange}
            />
          )}
        </div>
        <div className={classes.roleCardsContainer}>
          {fetchingRoles ? (
            <Loading message='fetching roles ..' />
          ) : (
            roles &&
            roles.map((role) => (
              <RoleCard
                role={role}
                onEdit={this.editRole}
                onDelete={this.handleOpenDeleteModal}
              />
            ))
          )}
        </div>
        <div className={classes.roleCardsPagination}>
          <Pagination
            page={page}
            count={Math.ceil(count / limit)}
            onChange={(e, page) => this.handlePageChange(page)}
            color='primary'
            className='pagination-white'
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
  page: state.roleManagement.page,
  limit: state.roleManagement.limit,
  count: state.roleManagement.count,
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
  searchRoles: (params) => {
    dispatch(searchRoles(params));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RoleManagement));
