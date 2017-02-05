import { map, flow, get, getOr, toNumber } from 'lodash/fp';

const getDataIds = flow(
  getOr([], 'data'),
  map(get('id')),
);

const getMeta = resp => ({
  currentPage: toNumber(resp.headers.get('X-Pagination-Current-Page')),
  sizePerPage: toNumber(resp.headers.get('X-Pagination-Per-Page')),
  totalSize: toNumber(resp.headers.get('X-Pagination-Total-Count')),
  totalPages: toNumber(resp.headers.get('X-Pagination-Page-Count')),
});

const defaultParseResponse = (fsaResponse) => {
  const data = getDataIds(fsaResponse.payload);
  const options = getMeta(fsaResponse.meta);
  return { data, options };
};

export default defaultParseResponse;
