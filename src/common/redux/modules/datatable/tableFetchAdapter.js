import defaultParseResponse from './defaultParseResponse';
import { fetchRequest, fetchRequestSuccess, fetchRequestFailure } from './actions';
import { getOptions } from './selectors';

// Creates fetchAdapter for a table that wraps existing API actionCreator.
//
// For example,
//
// const fetch = tableFetchAdapter('table', fetchTickets);
// dispatch(fetch(fetchOptions));
//
const tableFetchAdapter = (
  table,
  actionCreator,
  parseResonse = defaultParseResponse,
) => fetchOptions => async (dispatch, getState) => {
  const options = fetchOptions || getOptions(table)(getState()) || {};

  dispatch(fetchRequest(table, options));

  const fsaResponse = await dispatch(actionCreator(options));

  if (!fsaResponse.error) {
    const parsed = parseResonse(fsaResponse);
    return dispatch(fetchRequestSuccess(table, parsed));
  }

  return dispatch(fetchRequestFailure(table, fsaResponse));
};

export default tableFetchAdapter;
