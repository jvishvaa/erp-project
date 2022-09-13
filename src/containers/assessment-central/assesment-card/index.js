import React, { useState, useContext } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Popover,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from "@material-ui/core";
import moment from "moment";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import "./styles.scss";
import {
  deleteAssessmentTest,
  fetchAssesmentTests,
} from "../../../redux/actions";
import { AlertNotificationContext } from "../../../context-api/alert-context/alert-state";
import ConfirmModal from "./confirm-modal";
import Badge from "@material-ui/core/Badge";

const menuOptions = ["Delete"];

const ITEM_HEIGHT = 48;

const AssesmentCard = ({
  value,
  onClick,
  isSelected,
  selectedFilterData,
  activeTab,
  filterResults,
  addedId,
  selectAssetmentCard,
  handleClose,
  filteredAssesmentTests,
  isdisable,
  filterbasedonsub
}) => {
  const themeContext = useTheme();
  console.log("treecheckassessmentcardvalue", value);
  console.log('added', addedId)
  console.log("treecheckassessmentcardonclick", onClick);
  console.log("treecheckassessmentcardiselected", isSelected);
  console.log("treecheckassessmentcardfilteredresults", filterResults);
  console.log('filterbasedonsubeeeisdisable', isdisable);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const { setAlert } = useContext(AlertNotificationContext);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const isSuper =
    JSON.parse(localStorage.getItem("userDetails"))?.is_superuser || {};

  const handleOpen = () => {
    setOpen(true);
  };

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = async testId => {
    const { results } = await deleteAssessmentTest(testId);
    if (results.status_code === 200) {
      setAlert("success", results?.message);
      filterResults(1); // 1 is the current page no.
    } else {
      setAlert("error", results.error || results.message);
    }
    handleMenuClose();
  };

  const toggleComplete = (e) => {
    // if (disabled && !addedId.includes(value.id)) {
    //   return
    // }
    const { checked } = e.target;
    console.log('treechckvlue', checked, value);
    selectAssetmentCard(value?.id, checked);
    // filterbasedonsub()
  };


  return (
    <div className={`assesment-card ${isSelected ? "selected" : ""}`}>
      <div className="card-header">
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div className={value?.test_mode == 1 ? "greenDot" : "redDot"}></div>
          <p className={`${isSelected ? "selected" : "header"}`}>
            {value.test_type__exam_name}
          </p>
        </div>
        {handleClose &&
          value.subject_count == 1 &&

          // <Tooltip title={isdisable && !addedId.includes(value.id) ? 'Multiple tests cannot be selected with same subject.' : ''}>
          <Checkbox
            checked={addedId.includes(value.id)}
            onChange={e => toggleComplete(e)}
            // title={isdisable && !addedId.includes(value.id) ? 'Multiple tests cannot be selected with same subject.' : ''}
            name="allSelect"
          // disabled={isdisable && !addedId.includes(value.id)}
          />
          // </Tooltip>
        }
        {isSuper == true ? (
          <div className="menu">

            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
            >
              <MoreHorizIcon color="primary" />
            </IconButton>

            <Popover
              id=""
              open={menuOpen}
              anchorEl={anchorEl}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              className="assesment-card-popup-menu"
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                  border: `1px solid ${themeContext.palette.primary.main}`,
                  boxShadow: 0,
                  "&::before": {
                    content: "",
                    position: "absolute",
                    right: "50%",
                    top: "-6px",
                    backgroundColor: "#ffffff",
                    width: "10px",
                    height: "10px",
                    transform: "rotate(45deg)",
                    border: "1px solid #ff6b6b",
                    borderBottom: 0,
                    borderRight: 0,
                    zIndex: 10,
                  },
                },
              }}
            >
              {menuOptions.map(option => (
                <MenuItem
                  className="assesment-card-popup-menu-item"
                  key={option}
                  selected={option === "Pyxis"}
                  // onClick={(e) => handleDelete(value?.id)}
                  onClick={e => {
                    setOpenModal(true);
                  }}
                  style={{
                    color: themeContext.palette.primary.main,
                  }}
                >
                  {option}
                </MenuItem>
              ))}
              {openModal && (
                <ConfirmModal
                  submit={e => handleDelete(value?.id)}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                />
              )}
            </Popover>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="name">
        <p style={{ marginLeft: "10px" }}>{value.test_name}</p>
      </div>
      <div className="grade-details">
        <div>
          <p style={{ marginLeft: "10px" }}>
            {
              `${value.question_paper__grade_name || value.grade_name} `
              // ${value.question_paper_subject_name && value.question_paper_subject_name?.join(', ')}`
            }
          </p>
          {/* <p className='completed'>Completed -30.12.2020</p> */}
          {value.test_date != null ? 
          <p className="scheduled" style={{ marginLeft: "10px" }}>
            {`Scheduled on - ${moment(value.test_date).format("DD-MM-YYYY")}`}
            {", "}
            {value?.test_date?.slice(11, 16)}
          </p>
          : '' }
        </div>
        <div className="btn-container">
          {!isSelected && (
            <Button
              style={{ width: "100%", color: "white" }}
              variant="contained"
              color="primary"
              onClick={() => {
                onClick(value);
              }}
            >
              View More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default AssesmentCard;