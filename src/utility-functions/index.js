/* eslint-disable import/prefer-default-export */
import axiosInstance from '../config/axios';

export const isVideo = (filename) => {
  const inputExt = filename.split('.').pop();

  const videoFileExts = ['mp4', '3gp', 'avi'];

  return videoFileExts.some((ext) => ext.toUpperCase() === inputExt.toUpperCase());
};
export const isAudio = (filename) => {
  const inputExt = filename.split('.').pop();

  const audioFileExts = ['mp3', 'wav', 'aac'];

  return audioFileExts.some((ext) => ext.toUpperCase() === inputExt.toUpperCase());
};
export const generateQueryParamSting = (queryParamObj = {}) => {
  const paramsObj = { ...queryParamObj };
  const createQuery = (params) =>
    params
      .filter((param) => param[1] !== undefined)
      .map((param) => `${param[0]}=${param[1]}`)
      .join('&');
  const query = createQuery(Object.entries(paramsObj));
  return query;
};

export function setValueAndLabel(data = [], labelKey, valueKey) {
  return data.map((item) => {
    const { [labelKey]: labelKeyValue, [valueKey]: valueKeyValue } = item || {};
    return { ...item, label: labelKeyValue, value: valueKeyValue };
  });
}

export function timeDeltaDiff(startTimeField, endTimeField, getAsString) {
  if (startTimeField && endTimeField) {
    const startTime = new Date(startTimeField).getTime();
    const endTime = new Date(endTimeField).getTime();

    let delta = Math.abs(endTime - startTime) / 1000;

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    let seconds = delta % 60;
    seconds = Math.floor(seconds);
    const value = `${days ? `${days}days, ` : ''}${hours ? `${hours}hours, ` : ''}${
      minutes ? `${minutes}minutes, ` : ''
    }${seconds ? `${seconds}seconds.` : ''}`;
    if (getAsString) {
      return {
        days,
        hours,
        minutes,
        seconds,
      };
    }
    return value || '0';
  }
  return '';
}

export function getModuleInfo(moduleName) {
  const navData = JSON.parse(localStorage.getItem('navigationData')) || {};
  function getModuleId(moduleName) {
    let returnObj = {};
    navData.every((parentModule) => {
      const {
        id: parentId,
        parent_modules: parentName,
        child_module: childModules,
      } = parentModule || {};
      if (parentName === moduleName) {
        returnObj = {
          id: parentId,
          name: parentName,
          isParentModule: true,
          parent: parentModule,
        };
        return false;
      }
      return childModules.every((childModule) => {
        const { child_id: childId, child_name: chuldName } = childModule || {};
        if (chuldName === moduleName) {
          returnObj = {
            id: childId,
            name: chuldName,
            isParentModule: false,
            parent: parentModule,
            child: childModule,
          };
          return false;
        } else {
          return true;
        }
      });
    });
    return returnObj;
  }
  return moduleName ? getModuleId(moduleName) : navData;
}

export function getSubDomainName() {
  const { hostname } = new URL(axiosInstance.defaults.baseURL); // "dev.olvorchidnaigaon.letseduvate.com"
  const hostSplitArray = hostname.split('.');
  const subDomainLevels = hostSplitArray.length - 2;
  let domain = '';
  let subDomain = '';
  let subSubDomain = '';
  // if (hostSplitArray.length > 2) {
  //   domain = hostSplitArray.slice(hostSplitArray.length - 2).join('');
  // }
  if (subDomainLevels === 2) {
    //dev.olvorchidnaigaon.letseduvate.com
    subSubDomain = hostSplitArray[0];
    subDomain = hostSplitArray[1];
  } else if (subDomainLevels === 1) {
    //olvorchidnaigaon.letseduvate.com
    subDomain = hostSplitArray[0];
  }
  return subDomain || '';
}

export function colorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = '#',
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }
  return rgb;
}

export function isMsAPI() {
  let userDetails = JSON.parse(localStorage.getItem('userDetails'));
  if (userDetails?.token) {
    return axiosInstance.get(`/erp_user/oncls-ms-config/`).then((response) => {
      localStorage.setItem('isMsAPI', response?.data?.result[0]);
      response?.data?.result[0]
        ? localStorage.setItem('launchDate', response?.data?.result[1])
        : localStorage.removeItem('launchDate');
      return response;
    });
  }
}

export function handleDownloadPdf(data, title) {
  let link = document.createElement('a');
  link.setAttribute(
    'href',
    URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
  );
  link.download = `${title}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function handleDownloadExcel(data, title) {
  let link = document.createElement('a');
  link.setAttribute(
    'href',
    URL.createObjectURL(
      new Blob([data], {
        type: 'application/vnd.ms-excel',
      })
    )
  );
  title && (link.download = `${title}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export const parseJwt = (token) => {
  try {
    return JSON.parse(window.atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
