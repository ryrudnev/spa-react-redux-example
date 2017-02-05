import { auth } from 'common/redux/modules';
import { wrapAuthOnEnter } from 'common/utils/routingUtils';

export default function createRoutes(store) {
  const connect = wrapAuthOnEnter(store);

  const root = {
    component: require('common/containers/App').default,
    childRoutes: [
      {
        component: require('common/containers/NotAuth').default,
        onEnter: connect(auth.wrappers.UserIsNotAuthenticated),
        childRoutes: [
          require('./Login').default(store),
        ],
      },
      {
        component: require('common/containers/Auth').default,
        onEnter: connect(auth.wrappers.UserIsAuthenticated),
        childRoutes: [
          {
            component: require('common/containers/Layout').default,
            childRoutes: [
              require('./Home').default(store),
              ...require('common/modules/ticket/routes').default(store),
            ],
          },
          require('./NotFound').default(store),
        ],
      },
    ],
  };

  return root;
}
