/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useContext, useEffect } from 'react';

import './styles.scss';
import { makeStyles} from '@material-ui/core';


const useStyles = makeStyles((theme) =>({
  tabListItem:{
      padding: "10px 15px",
      cursor: "pointer",
      color : theme.palette.secondary.main,
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "5px",
      margin: "0.5rem",
      minWidth: "max-content",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      '&.active' : {
        color: "#ffffff",
        backgroundColor: theme.palette.primary.main,
      }
    }
}))

const ClapContext = React.createContext();
const { Provider } = ClapContext;

export const Tabs = ({ defaultActiveTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
 
  const onClickTabItem = (activeTab) => {
    setActiveTab(activeTab);
  };

  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  return (
    <div className='homework-tabs'>
      <ol className='tab-list'>
        {children.map((child, index) => {
          const { label } = child.props;
          return (
            <TabButton
              activeTab={activeTab}
              key={index}
              label={label}
              onClick={onClickTabItem}
            />
          );
        })}
      </ol>
      <div className='tab-content'>
        <Provider value={{ activeTab }}>
          {/* <AnimatePresence
            exitBeforeEnter
            onExitComplete={() => console.log("tab exited!!!")}
          > */}
          {children}
          {/* </AnimatePresence> */}
        </Provider>
      </div>
    </div>
  );
};

const buttonUnderlineVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

const TabButton = ({ activeTab, label, onClick }) => {
  let isActive = false;
  const classes = useStyles()

  if (activeTab === label) {
    isActive = true;
  }

  const handleClick = () => {
    onClick(label);
  };
  return (
    <>
      <li
        className={` ${classes.tabListItem} ${isActive && 'active'}`}
        onClick={handleClick}
        onKeyDown={() => {}}
      >
        <div>{label}</div>
      </li>
    </>
  );
};

export const Tab = ({ key, label, children }) => {
  const { activeTab } = useContext(ClapContext);
  let isActive = false;
  if (activeTab === label) {
    isActive = true;
  }

  if (isActive) {
    return (
      <div key={key} className='tab'>
        {children}
      </div>
    );
  }

  return null;
};

const TabHeader = ({ children }) => {
  return <div className='tab-header'>{children}</div>;
};

const TabContent = ({ children }) => {
  return <div className='tab-content'>{children}</div>;
};

Tab.Header = TabHeader;
Tab.Content = TabContent;
