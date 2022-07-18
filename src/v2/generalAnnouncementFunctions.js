import moment from 'moment';
export const getCategoryColor = (category) => {
  switch (category.toUpperCase()) {
    case 'HOLIDAY':
      return '#ac00ea';
    case 'EXAM':
      return '#f8222f';
    case 'EVENT':
      return '#20c51c';
    case 'MISCELLANEOUS':
      return '#ff9922';
    case 'TIMETABLE':
      return '#00b1df';
    default:
      return '#32334a';
  }
};
export const getRole = (type) => {
  switch (type) {
    case 1:
      return 'Super Admin';
    case 2:
      return 'Central Academic';
    case 3:
      return 'Tech Support';
    case 4:
      return 'Owner';
    case 5:
      return 'School Admin';
    case 6:
      return 'Accounts';
    case 7:
      return 'HR Admin';
    case 8:
      return 'Principal';
    case 9:
      return 'Operations';
    case 10:
      return 'Academic Coordinators';
    case 11:
      return 'Teacher';
    case 12:
      return 'Parent';
    case 13:
      return 'Student';
    case 14:
      return 'Receptionist';
    case 15:
      return 'Driver';
    case 16:
      return 'Librarian';
    case 17:
      return 'Hostel Manager';
    case 18:
      return 'Warden';
    case 19:
      return 'Store Manager';
    case 20:
      return 'MIS';
    case 21:
      return 'Vendor';
    case 22:
      return 'Security';
    case 23:
      return 'Other Staff';
    case 24:
      return 'Guest';
    case 25:
      return 'Finance Admin';
    case 26:
      return 'Operation Manager';
    case 27:
      return 'Operation City Head';
    case 28:
      return 'Transport Incharge';
    case 29:
      return 'Central Finance';
    case 30:
      return 'Logistics Manager';
    case 31:
      return 'Trustee';
    case 32:
      return 'Finance Accountant';
    case 33:
      return 'Store Admin';
    default:
      return '--';
  }
};

export const getSortedAnnouncements = (announcementData, showDate) => {
  if (announcementData.length > 0) {
    const dateWiseEvents = announcementData?.reduce((initialValue, data) => {
      const date = moment(data.created_time).format('DD/MM/YYYY');

      let key =
        date === moment().format('DD/MM/YYYY')
          ? `Today ${showDate ? `(${date})` : ''}`
          : date === moment().subtract(1, 'days').format('DD/MM/YYYY')
          ? `Yesterday ${showDate ? `(${date})` : ''}`
          : moment(data.created_time).isBetween(
              moment().subtract(7, 'd'),
              moment().subtract(2, 'd'),
              '[]'
            )
          ? 'This Week'
          : 'This Month';
      if (!initialValue[key]) {
        initialValue[key] = [];
      }
      initialValue[key].push(data);
      return initialValue;
    }, {});

    const sortedAnnouncements = Object.keys(dateWiseEvents)
      .map((date) => {
        return {
          date,
          events: dateWiseEvents[date],
        };
      })
      .sort(
        (a, b) => new Date(b.events[0].created_time) - new Date(a.events[0].created_time)
      );
    return sortedAnnouncements;
  }
};
