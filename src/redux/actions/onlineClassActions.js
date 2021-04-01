export const types = { ATTENDANCE_LIST: 'ATTENDANCE_LIST' };

const { ATTENDANCE_LIST } = types;

export const attendanceAction = (data) => {
    return {
      type: ATTENDANCE_LIST,
      payload: data,
    };
  };