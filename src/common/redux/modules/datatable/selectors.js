import { get, getOr, flow, mapValues } from 'lodash/fp';

// Main datatable selector
export const datatableSelector = get('datatable');

export const getTable = table => flow(datatableSelector, get(table));

export const getOptions = table => flow(getTable(table), get('options'));

export const getInitial = table => flow(getTable(table), getOr({}, 'initial'));

export const getData = table => flow(getTable(table), get('data'));

export const isTriggerFetch = table => flow(getTable(table), getOr(false, 'triggerFetch'));

export const isFetching = table => flow(getTable(table), getOr(false, 'fetching'));

export const isError = table => flow(getTable(table), getOr(false, 'error'));

export default table => mapValues(
  ac => ac(table),
  { getOptions,
    getInitial,
    getData,
    isTriggerFetch,
    isFetching,
    isError,
  });
