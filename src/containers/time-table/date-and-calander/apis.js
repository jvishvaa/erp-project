import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';

const session_year = JSON.parse(sessionStorage.getItem('acad_session'))?.id
function createParams(params) {
    return `?${Object.entries(params)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
  }

  export const createTimeTable = async (payload) => {
    try {
      const { data = {} } = await axiosInstance.post(
        `${endpoints.timeTable.createtimeTable}`,payload
      );
      return data ; 
    } catch (e) {
      return e;
    }
  };

  export const getTTList = async (section_mapping) => {
    if (!section_mapping) return;
    const params = createParams({ section_mapping, session_year });
    try {        
      const { data = {} } = await axiosInstance.get(
        `${endpoints.timeTable.timeTableList}${params}`
      );
      return data ; 
    } catch (e) {
      return [];
    }
  };

  export const getTimeTable = async (tt) => {
    if (!tt) return;
    const params = createParams({ tt,session_year });
    try {        
      const { data = {} } = await axiosInstance.get(
        `${endpoints.timeTable.gettimeTable}${params}`
      );
      return data ; 
    } catch (e) {
      return e;
    }
  };

  export const deleteTimeTable = async (id) => {
    if (!id) return;
    try {        
      const { data = {} } = await axiosInstance.delete(
        `${endpoints.timeTable.deletetimeTable}${id}/`
      );
      return data ; 
    } catch (e) {
      return e;
    }
  };

  export const editTimeTable = async (id,payload) => {
    if (!id) return;
    try {        
      const { data = {} } = await axiosInstance.put(
        `${endpoints.timeTable.edittimeTable}${id}/`,payload
      );
      return data ; 
    } catch (e) {
      return e;
    }
  };

  export const collidingPeriod = async (payload) => {
    // if (!id) return;
    try {        
      const { data = {} } = await axiosInstance.put(
        `${endpoints.timeTable.collidingPeriod}`,payload
      );
      return data ; 
    } catch (e) {
      return e;
    }
  };

  export const getPeriodTypes = async () => {
    const params = createParams({session_year });
    try {        
      const { data = {} } = await axiosInstance.get(
        `${endpoints.timeTable.periodTypes}${params}`
      );
      return data ; 
    } catch (e) {
      return e;
    }
  };

  export const deletePeriod = async (id) => {
    if (!id) return;
    const params = createParams({ id });
    try {        
      const { data = {} } = await axiosInstance.delete(
        `${endpoints.timeTable.deletePeriod}${id}/`
      );
      return data ; 
    } catch (e) {
      return e;
    }
  };


  export const editPeriod = async (id,payload) => {
    if (!id) return;
    const params = createParams({ id });
    try {        
      const { data = {} } = await axiosInstance.put(
        `${endpoints.timeTable.editPeriod}${id}/`,payload
      );
      return data ; 
      
    } catch (e) {
      return e;
    }
  };

  export const createPeriod = async (payload) => {
    // if (!id) return;
    // const params = createParams({ id });
    try {        
      const { data = {} } = await axiosInstance.post(
        `${endpoints.timeTable.editPeriod}`,payload
      );
      return data ; 
      
    } catch (e) {
      return e;
    }
  };






