import endpoints from '../../../config/endpoints';
import axiosInstance from '../../../config/axios';

function createParams(params) {
  return `?${Object.entries(params)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`;
}

export const getErpSystemConfig = async (page, page_size) => {
  if (!page || !page_size) return;
  const params = createParams({ page, page_size });
  try {
    const { data = {} } = await axiosInstance.get(
      `${endpoints.masterManagement.erpSystemConfig}${params}`
    );
    return data || [];
  } catch (e) {
    return [];
  }
};

export const deleteErpSystemConfig = async (payload) => {
  try {
    const { data = {} } = await axiosInstance.delete(
      `${endpoints.masterManagement.erpSystemConfig}`,
      {
        data: {
          ...payload,
        },
      }
    );
    return data || [];
  } catch (e) {
    return [];
  }
};

export const createErpSystemConfig = async (payload, isEdit = false) => {
  if (
    !Object.values(payload)
      .filter((value) => value !== undefined)
      .every(Boolean)
  ) {
    return;
  }
  try {
    const { data = {} } = await axiosInstance[isEdit ? 'put' : 'post'](
      `${endpoints.masterManagement.erpSystemConfig}`,
      payload
    );
    return data || [];
  } catch (e) {
    return [];
  }
};
