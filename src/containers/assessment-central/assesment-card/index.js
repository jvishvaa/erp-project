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
import RestoreModal from './restore-model'
import axiosInstance from "config/axios";
import endpoints from "config/endpoints";

const menuOptions = ["Delete"];
const restoreOption = ["Restore"];

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
  filterbasedonsub,
  checkDel
}) => {
  const themeContext = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [restoreModel , setOpenRestoreModal] = useState(false)
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
    const  results  = await deleteAssessmentTest(testId);
    if (results?.status_code === 200) {
      setAlert("success", results?.message);
      filterResults(1); // 1 is the current page no.
    } else {
      setAlert("error", results?.response?.data?.message);
    }
    handleMenuClose();
  };

  const handleRestored = async testId => {
    axiosInstance.patch(
      `${endpoints.assessmentErp.deleteAssessmentTest}${testId}/test/`, {
        is_delete : false,
      }
    ).then((results) => {
      if (results?.data?.status_code === 200) {
        setAlert("success", results?.data?.message);
        filterResults(1); // 1 is the current page no.
      } else {
        setAlert("error", results?.response?.data?.message);
      }
    }).catch((error) => {
      setAlert("error", error?.response?.data?.message);

    })
   
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

  const getSection = () => {
    var sectionName = ''
    let getsectionname = value?.section_name.map((sec , i ) => {
      // var check = sec.split('')
      // console.log(check[ check?.length - 1 ]);
      if(value?.section_name?.length - 1 == i )
      {
        sectionName +=  `${sec}`
      }else{
        sectionName +=  `${sec},`
      }
    })
    return sectionName;
  }


  return (
    <div className={`assesment-card`}>
      {/* <div className="card-header">
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div className={value?.test_mode == 1 ? "greenDot" : "redDot"}></div>
          <p className={`${isSelected ? "selected" : "header"}`}>
            {value.test_type__exam_name}
          </p>
        </div>
        {handleClose &&
          value.subject_count == 1 &&
          <Checkbox
            checked={addedId.includes(value.id)}
            onChange={e => toggleComplete(e)}
            name="allSelect"
          />
        }
        {checkDel == true ? (
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
      </div> */}
      <div className="assessment-name row">
      {handleClose &&
          value.subject_count == 1 &&
          <Checkbox
            checked={addedId.includes(value.id)}
            onChange={e => toggleComplete(e)}
            name="allSelect"
          />
        }
        <div className = 'd-flex align-items-center' style={{marginLeft : '2%', whiteSpace: 'nowrap' , overflow: 'hidden' , textOverflow: 'ellipsis',}}>{value?.test_name?.length > 20 ? `${value?.test_name.slice(0,20)}...` : value?.test_name}</div>
        {checkDel == true ? (
          <div className="col menu d-flex justify-content-end">
            <div className="d-flex align-items-center justify-content-center">{`${value?.test_mode == 1 ? "(Online)" : "(Offline)"}`}</div>
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
                  width: "12ch",
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
              {activeTab !== 'deleted' && menuOptions.map(option => (
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
              {activeTab === 'deleted' && <MenuItem
                  className="assesment-card-popup-menu-item"
                  // key={""}
                  // selected={"Pyxis"}
                  // onClick={(e) => handleDelete(value?.id)}
                  onClick={e => {
                    setOpenRestoreModal(true);
                  }}
                  style={{
                    color: themeContext.palette.primary.main,
                  }}
                >
                  {"Restore"}
                </MenuItem>}
              {openModal && (
                <ConfirmModal
                  submit={e => handleDelete(value?.id)}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                />
              )}
              {restoreModel && (
                <RestoreModal
                  submit={e => handleRestored(value?.id)}
                  openModal={restoreModel}
                  setOpenModal={setOpenRestoreModal}
                />
              )}
            </Popover>
          </div>
        ) : ''}
      </div>
      <div className="assessment-name">
          <p className="idPara" style={{ marginLeft: "10px" , fontSize: '14px'}} >{`Test Id: ${value?.test_id}`}</p>
        </div>
      <div className="grade-details">
        <div style={{ maxWidth: '60%'}} >
          <div>
            <Tooltip title={getSection()}>
          <p style={{ marginLeft: "10px", whiteSpace: 'nowrap' , overflow: 'hidden' , textOverflow: 'ellipsis' , fontSize: '15px' }}>
            {
              `${getSection()}`
              // ${value.question_paper_subject_name && value.question_paper_subject_name?.join(', ')}`
            }
          </p>
          </Tooltip>
          </div>
          {/* <p className='completed'>Completed -30.12.2020</p> */}
          {value.test_date != null ? 
          <p className="scheduled" style={{ marginLeft: "10px"  }}>
            {`Created On - ${moment(value.test_date).format("DD-MM-YYYY")}`}
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