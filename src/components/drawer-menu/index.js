import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import MenuItem from './menu-item';
import SuperUserMenu from './super-user-menu';
import './styles.scss';
import { TramOutlined } from '@material-ui/icons';


const resolveMenu = (url) => {
  if (url.includes('user-management')) return 'User Management';
  if (url.includes('lesson-plan')) return 'Lesson Plan';
  if (url.includes('master-management')) return 'Master Management';
  if (url.includes('subject/grade')) return 'Master Management';
  if (url.includes('online-class')) return 'Online Class';
  if (url.includes('classwork')) return 'Online Class';
  if (url.includes('homework')) return 'Homework';
  if (url.includes('communication')) return 'Communication';
  if (url.includes('homework')) return 'Homework';
  if (url.includes('blog')) return 'Blogs';
  if (url.includes('diary')) return 'Diary';
  if (url.includes('time-table')) return 'Time Table';
  if (url.includes('Appointment')) return 'Appointments';
  if (url.includes('role-management')) return 'Role Management';
  if (url.includes('BulkOperation')) return 'Bulk Operations';

  if (url.includes('Report')) return 'Reports';
  if (url.includes('ReceiptBook')) return 'Reports';
  if (url.includes('TransactionStatus')) return 'Reports';


  if (url.includes('intelligent-book')) return 'Ibook';
  if (url.includes('assessment')) return 'Assessment';
  if (url.includes('attendance-calendar')) return 'Calendar & Attendance';
  if (url.includes('ConcessionSetting')) return 'Concession';
  if (url.includes('Approval')) return 'Approvals/Requests';
  if (url.includes('UnassignFeeRequests')) return 'Approvals/Requests';
  if (url.includes('Student/ActiveInactive/Admin')) return 'Approvals/Requests';

  if (url.includes('assign_other_fees')) return 'Transport Fees';
  if (url.includes('OtherFeeType')) return 'Transport Fees';
  if (url.includes('assesment')) return 'Assessment';
  if (url.includes('question-bank')) return 'Assessment';
  if (url.includes('orchadio')) return 'Orchadio';
  if (url.includes('student-strength')) return 'School Strength';
  if (url.includes('student-strength')) return 'School Strength';

  if (url.includes('Store')) return 'Store';
  if (url.includes('student-id-card')) return 'ID Card';
  if (url.includes('circular')) return 'Circular';
  if (url.includes('E-Mandate')) return 'E-Mandate';
  if (url.includes('MiscFeeClass')) return 'Misc. Fee To Class';
  if (url.includes('feePlan')) return 'Fee Plan';
  if (url.includes('feeType')) return 'Fee Type';

  if (url.includes('griviences')) return 'Griviences';
  if (url.includes('appointments')) return 'Appointment';
  if (url.includes('contact-us')) return 'Appointment';
  if (url.includes('responder-view')) return 'Appointment';
  if (url.includes('forum')) return 'Discussion Forum';

  if (url.includes('ebook')) return 'Ebook';
  if (url.includes('publications')) return 'Publication';
  if (url.includes('Expanse')) return 'Expanse Management';
  if (url.includes('Setting')) return 'Settings';
  if (url.includes('IncomeTaxCertificate')) return 'Settings';
  if (url.includes('ReceiptRange')) return 'Settings';

  if (url.includes('BankAndFeeAccounts')) return 'Banks & Fee Accounts';
  if (url.includes('applicationFrom')) return 'Admissions';
  if (url.includes('admission')) return 'Admissions';
  if (url.includes('student')) return 'student';
  if (url.includes('Student')) return 'student';
  if (url.includes('Coupon')) return 'Coupons';
  if (url.includes('Ledger')) return 'Expense Management';
  if (url.includes('DepositTab')) return 'Expense Management';
  if (url.includes('ManagePayments')) return 'Finance';
  if (url.includes('finance/FeeStructure')) return 'Finance';
  if (url.includes('BooksAndUniform')) return 'Finance';
  if (url.includes('ShippingPayment')) return 'Finance';
  if (url.includes('ManagePayments')) return 'Finance';

  return null;
};

const DrawerMenu = ({ navigationItems, superUser, onClick ,flag ,drawerOpen}) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [openParent, setOpenParent] = useState(false);
  const { location } = useHistory();
  useEffect(() => {
    setOpenMenu(resolveMenu(location.pathname));
  }, []);
  return (
    <>
      {superUser && (
        <SuperUserMenu
          onClickMenuItem={onClick}
          openMenu={openMenu}
          onChangeMenuState={(menu) => {
            if (menu === openMenu) {
              setOpenMenu(null);
            } else {
              setOpenMenu(menu);
            }
          }}
        />
      )}
      {navigationItems &&
        navigationItems
          .filter((item) => item.child_module && item.child_module.length > 0)
          .map((item,index) => (
            <MenuItem
              item={item}
              menuOpen={item.parent_modules === openMenu}
              index={index}
              onChangeMenuState={() => {
                if (item.parent_modules === openMenu) {
                  setOpenMenu(null);
                  setOpenParent(false);


                } else {
                  setOpenMenu(item.parent_modules);
                  setOpenParent(true);

                }
              }}
              openMenu={openMenu}
              navigationItems = {navigationItems}
              openParent = {openParent}
              drawerOpen={drawerOpen}

              onClick={onClick}
              flag={flag}
            />
          ))}
    </>
  );
};

export default DrawerMenu;
