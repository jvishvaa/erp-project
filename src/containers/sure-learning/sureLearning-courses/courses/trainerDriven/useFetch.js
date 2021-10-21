import {
    useReducer,
    useState,
    useEffect,
    useCallback,
  } from 'react';
import { AlertNotificationContext as useAlert } from '../../../../../context-api/alert-context/alert-state';

  const FETCH_INIT = 'FETCH_INIT';
  const FETCH_SUCCESS = 'FETCH_SUCCESS';
  const FETCH_FAIL = 'FETCH_FAIL';
  
  const fetchReducer = (state, action) => {
    switch (action.type) {
      case FETCH_INIT:
        return {
          ...state,
          isError: false,
          isLoading: true,
        };
      case FETCH_SUCCESS:
        return {
          ...state,
          isError: false,
          isLoading: false,
          data: action.payload.data,
        };
      case FETCH_FAIL: {
        return {
          ...state,
          isError: true,
          isLoading: false,
        };
      }
  
      default:
        return {
          ...state,
        };
    }
  };
  
  const getMessage = (type) => {
    switch (type.toUpperCase()) {
      case 'GET':
        return 'Data Successfully Receive';
      case 'POST':
        return 'Successfully Created';
      case 'PUT':
        return 'Successfully Saved';
      case 'DELETE':
        return 'Successfully Deleted';
      case 'ERROR':
        return 'Somthing went wrong please try again';
      default:
        return 'Data Successfully Fetched';
    }
  };
  
  export default (initialData = null, message) => {
    const errorMessage = (message && message.errorMessage) || null;
    const successMessage = (message && message.successMessage) || null;
    const suppressMessage = (message && message.suppressAlert) || false;
  
    const [state, dispatch] = useReducer(fetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
  
    const [urlData, setUrlData] = useState({
      url: '',
      method: 'get',
      body: null,
      headers: {},
      type: 'json',
    });
  
    const alert = useAlert();
  
    useEffect(() => {
      let abort = false;
      if (urlData.url.length) {
        const customFetch = async () => {
          if (!abort) {
            dispatch({ type: FETCH_INIT });
          }
          const method = urlData.method.toUpperCase();
          const init = {
            method,
            headers: new Headers({ ...urlData.headers }),
          };
  
          if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
            init.body = urlData.body instanceof FormData
              ? urlData.body : JSON.stringify(urlData.body);
          }
          try {
            const response = await fetch(urlData.url, init);
            if (!response.ok) {
              throw Error('Something Went Wrong');
            }
            let resBody = null;
            if (urlData.type === 'blob') {
              resBody = await response.blob();
            } else {
              resBody = await response.json();
            }
  
            if (!abort) {
              dispatch({
                type: FETCH_SUCCESS,
                payload: {
                  data: resBody,
                },
              });
              if (!suppressMessage) {
                alert.success(successMessage || getMessage(method));
              }
            }
          } catch (error) {
            if (!abort) {
              if (!suppressMessage) {
                alert.error(errorMessage || getMessage('ERROR'));
              }
              dispatch({ type: FETCH_FAIL });
            }
          }
        };
  
        customFetch();
      }
      return () => {
        abort = true;
      };
    }, [
      alert,
      errorMessage, successMessage, suppressMessage, urlData]);
  
    // Function which will be used to fetch the data
    const doFetch = useCallback(({
      url, method, body, headers, type,
    }) => {
      const urlUsed = url || '';
      const methodUsed = method || 'get';
      const bodyUsed = body || null;
      const headersUsed = headers || {};
      const typeUsed = type || 'json';
  
      setUrlData({
        url: urlUsed,
        method: methodUsed,
        body: bodyUsed,
        headers: headersUsed,
        type: typeUsed,
      });
    }, []);
    return { ...state, doFetch };
  };
  