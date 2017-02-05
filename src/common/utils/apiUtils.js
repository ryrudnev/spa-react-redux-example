/* eslint-disable no-bitwise */
import qs from 'qs';
import { flow, curry, defaults, set, unset, pick, mapKeys, isEmpty } from 'lodash/fp';

export const getHeader = curry((param, headers) => {
  if (headers instanceof Headers) {
    return headers.get(param);
  } else if (headers[param] !== null) {
    return headers[param];
  }
  return undefined;
});

export const getContentType = getHeader('content-type');

export const isJsonType = flow(
  getContentType,
  type => type && ~type.indexOf('json'),
);

export const isFormUrlEncodedType = flow(
  getContentType,
  type => type && ~type.indexOf('x-www-form-urlencoded'),
);

export const normalizeBody = (params) => {
  const { headers, body, method } = params;
  if (['GET', 'HEAD'].includes(method)) {
    return unset('body', params);
  }
  if (isFormUrlEncodedType(headers)) {
    return set('body', qs.stringify(body), params);
  } else if (isJsonType(headers)) {
    return set('body', JSON.stringify(body), params);
  }
  return params;
};

const withQs = curry((queryParams, url) =>
  (isEmpty(queryParams) ? url : `${url}?${qs.stringify(queryParams)}`),
);

export const normalizeEndpoint = curry((baseUrl, { path, endpoint, query, ...rest }) =>
  set('endpoint', withQs(query, endpoint || `${baseUrl}/${path}`), rest));

export const accumulate = curry((accumulated, names, params) =>
  Object.keys(params).reduce((acc, key) => (
    names.includes(key)
      ? set([accumulated, key], params[key], unset(key, acc))
      : acc
    )
  , params),
);

export const mapParams = paramsMap => mapKeys(
  key => (paramsMap[key] ? paramsMap[key] : key),
);

export const toJson = curry((names, params) =>
  Object.keys(params).reduce((acc, key) => (
    names.includes(key)
      ? set(key, JSON.stringify(params[key]), acc)
      : acc
  ), params));

export const createApiNormalizer = ({ endpoint: baseUrl }) => flow(
  defaults({
    method: 'GET',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  }),
  mapParams({
    currentPage: 'page',
    sizePerPage: 'per-page',
  }),
  toJson(['filter']),
  accumulate('query', [
    'fields',
    'sort',
    'filter',
    'expand',
    'page',
    'per-page',
  ]),
  normalizeEndpoint(baseUrl),
  normalizeBody,
  pick([
    'endpoint',
    'method',
    'body',
    'headers',
    'credentials',
  ]),
);
