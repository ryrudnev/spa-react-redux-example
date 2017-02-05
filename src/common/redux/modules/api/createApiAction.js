import { CALL_API, validateRSAA } from 'redux-api-middleware';
import invariant from 'invariant';
import { flow, identity, isFunction, isArray, isNull } from 'lodash/fp';
import config from 'client/config';
import { createApiNormalizer } from 'common/utils/apiUtils';

const defaultApiNormalizer = createApiNormalizer(config.api);

const defaultMetaCreator = (action, state, resp) => resp;

/**
 * Wraps an action creator so that its return value is the payload of a Redux Standard API-calling Actions. (see https://github.com/agraboso/redux-api-middleware#redux-standard-api-calling-actions)
 * @param  [array] types
 * @param  {function} payloadCreator
 * @param  {function} apiNormalizer
 * @return {function}
 */
export default function createApiAction(
  types,
  payloadCreator = identity,
  metaCreator = defaultMetaCreator,
  apiNormalizer = defaultApiNormalizer,
) {
  invariant(
    isArray(types) && types.length === 3,
    'Expected types to be an array of three elements.',
  );

  invariant(
    isFunction(payloadCreator) || isNull(payloadCreator),
    'Expected payloadCreator to be a function, undefined or null.',
  );

  let finalPayloadCreator = isNull(payloadCreator)
    ? identity
    : payloadCreator;

  if (isFunction(apiNormalizer)) {
    finalPayloadCreator = flow(finalPayloadCreator, apiNormalizer);
  }

  const apiActionCreator = (...args) => {
    const payload = finalPayloadCreator(...args, types);

    const rsaa = {
      [CALL_API]: {
        types: isFunction(metaCreator)
          ? types.map(type => ({ type, meta: metaCreator }))
          : types,
        ...payload,
      },
    };

    const validationErrors = validateRSAA(rsaa);
    invariant(
      !validationErrors.length,
      `Passed to the invalid payload to create RSAA action:\n ${validationErrors.join(';\n')}`,
    );

    return rsaa;
  };

  apiActionCreator.types = types;

  return apiActionCreator;
}
