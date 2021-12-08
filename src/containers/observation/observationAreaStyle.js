import { makeStyles } from "@material-ui/core";

const drawerWidth = 450;

const useStyles = makeStyles((theme) => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    girdWeight: {
        fontWeight: 'bold',
        marginBottom: '5px',
        marginLeft: '61px'
    },

    gridFont: {
        fontWeight: 'bold',
        fontSize: '20px',
        paddingLeft: '60px'
    },
    drawerPaper: {
      width: drawerWidth,
    },
    tablePadding: {
        paddingTop: '15px'
    },
    tableWidth: {
        paddingLeft: '18px'
    },
    cancelbutton: {
        marginRight: '246px'
    },
    deleteButton: {
      padding: '0px',
      paddingLeft: '10px',
      paddingRight: '10px'
    },
    editButton: {
      padding:'0px',
      paddingLeft: '10px',
      paddingRight: '10px',
      marginBottom: '5px'
    },
    tableGrid: {
      position: 'relative',
      left: '118px'
    },
    tableMargin: {
      width: '1px',
    },
    buttonColor: {
      color: 'white',
    },
    observationheading: {
      fontSize: '20px',
      marginTop: '80px',
      marginLeft: '20px'
    },
    observationinput: {
      paddingLeft: '20px',
      paddingRight: '24px',
    },
    statustyle: {
      fontSize: '20px',
      marginTop: '16px',
      marginLeft: '20px'
    },
    statusfield: {
      marginLeft: '20px',
      paddingRight: '38px',
    },
    dropdowndata: {
      marginTop: '24px',
      marginLeft: '20px',
      paddingRight: '38px'
    }
  }));

  export {useStyles};