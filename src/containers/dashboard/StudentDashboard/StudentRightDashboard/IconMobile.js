import React from 'react'
import announcementIcon from "./announcementIcon.svg";
import calenderIcon from "./calenderIcon.svg";
import playIcon from "./playIcon.svg";
import Announcement from "../StudentRightDashboard/Announcement/Announcement";
import Calender from "../StudentRightDashboard/Calendar/Calendar";
import Orchadio from "../StudentRightDashboard/Orchadio/MediaOrchadioCard";
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';

const IconMobile = () => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [open2, setOpen2] = React.useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);
    const [open3, setOpen3] = React.useState(false);
    const handleOpen3 = () => setOpen3(true);
    const handleClose3 = () => setOpen3(false);
  
  
    return (
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-end", position: "absolute", top:"350px", right:'20px'}}>
           <div style={{border:"2px solid white", borderRadius: "10px", marginBottom: "10px"}} onClick={handleOpen}>
           <img src={announcementIcon} alt="announcementIcon"/>
           </div>
           <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                >
                {/* <Box sx={style}>
                    <Announcement/>
                </Box> */}
                <div style={{width:"80vw",  position:"relative", top:"200px", left:"10%", fontSize:"0.7em"}}>
                <Announcement/>
                </div>
            </Modal>
           <div style={{border:"2px solid white", borderRadius: "10px", marginBottom: "10px"}} onClick={handleOpen2}>
           <img src={calenderIcon} alt="calenderIcon" />
           </div>
           <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                >
                <div style={{width:"80vw",  position:"relative", top:"200px", left:"10%", fontSize:"0.7em"}}>
                <Calender/>
                </div>
            </Modal>
           <div style={{border:"2px solid white", borderRadius: "10px", marginBottom: "10px"}} onClick={handleOpen3}>
           <img src={playIcon} alt="playIcon" />
           </div>
           <Modal
                open={open3}
                onClose={handleClose3}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                >
                <div style={{width:"80vw",  position:"relative", top:"300px", left:"10%", fontSize:"0.7em"}}>
                <Orchadio/>
                </div>
            </Modal>
        </div>
    )
}

export default IconMobile;
