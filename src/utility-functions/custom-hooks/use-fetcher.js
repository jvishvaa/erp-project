import { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../config/axios';
import { generateQueryParamSting, setValueAndLabel } from '../index';

const dataSkeleton = {
  data: undefined,
  dataType: undefined,
  fetching: undefined,
  fetchFailed: undefined,
  message: undefined,
  fetchSucceeded: false, // for post|put methods,
};

function useFetcher(props) {
  const {
    url: apiURLfromProps,
    dataType = 'array',
    valueKey,
    labelKey,
    defaultQueryParamObj = {},
    fetchOnLoad = false,
    setValueAndLabel: setValueAndLabelFromProps,
    method: methodFromProps = 'get',
    isCentral = false,
    APIDataKeyName = 'data',
  } = props;

  const [data, setData] = useState(dataSkeleton);

  const fetchData = (dataProp = {}) => {
    const {
      method = methodFromProps,
      url: apiURL = apiURLfromProps,
      queryParamObj = {},
      payLoad = {},
      callbacks: { onStart = () => {}, onResolve = () => {}, onReject = () => {} } = {},
      headers = {},
    } = dataProp || {};

    const skeletonDataObj = {
      ...dataSkeleton,
      dataType,
      metaInfo: { queryParamObj, method },
    };

    setData({ ...skeletonDataObj, fetching: true });

    onStart();

    // const apiUrl = urls.getGradeList + '?' + generateQueryParamSting(queryParamObj)
    const combinedQueryParamObj = Object.assign(defaultQueryParamObj, queryParamObj);
    const apiUrl = `${apiURL}?${generateQueryParamSting(combinedQueryParamObj)}`;
    const headersObj = {
      headers: { ...headers, ...(isCentral ? { 'x-api-key': 'vikash@12345#1231' } : {}) },
    };
    const methodIncludePayload = ['put', 'post'].includes(method);
    const axiosModule = isCentral ? axios : axiosInstance;
    axiosModule[method](apiUrl, methodIncludePayload ? payLoad : headersObj, headersObj)
      .then((responce) => {
        const { [APIDataKeyName]: apiData, message, status_code: statusCodeResponse } =
          responce.data || {};
        let dataObj = {};
        const statusCode = Number(statusCodeResponse);
        if (statusCode > 199 && statusCode < 300) {
          let apiDataWithValueAndLabels = apiData;
          if (Array.isArray(apiData)) {
            if (setValueAndLabelFromProps) {
              apiDataWithValueAndLabels = setValueAndLabelFromProps(apiData);
            } else if (labelKey && valueKey) {
              apiDataWithValueAndLabels = setValueAndLabel(
                apiData || [],
                labelKey,
                valueKey
              );
            }
          }
          dataObj = {
            ...skeletonDataObj,
            fetching: false,
            fetchFailed: false,
            data: apiDataWithValueAndLabels,
            message,
          };

          onResolve(responce);
        } else {
          dataObj = { ...skeletonDataObj, fetching: false, fetchFailed: true, message };

          const fromCatch = false;
          onReject(responce, fromCatch);
        }
        setData({ ...dataObj });
      })
      .catch((err) => {
        const fromCatch = true;
        onReject(err, fromCatch);

        const {
          response: { statusText = 'Failed to connect to server' } = {},
          data: { message: messageFromDev } = {},
        } = err || {};
        const dataObj = {
          ...skeletonDataObj,
          fetching: false,
          fetchFailed: true,
          message: messageFromDev || statusText,
        };
        setData({ ...dataObj });
      });
  };

  useEffect(() => {
    if (fetchOnLoad) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dataObj = { ...data, fetch: fetchData };
  return [dataObj, fetchData];
}

export default useFetcher;
