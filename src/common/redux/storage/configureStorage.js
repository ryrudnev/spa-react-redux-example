import createMigration from 'redux-persist-migrate';
import CookieStorage from 'redux-persist-cookie-storage';
import createFilter from 'redux-persist-transform-filter';

// Migrate redux state between versions with redux-persist.
// https://github.com/wildlifela/redux-persist-migrate
export function migrate() {
  const migrationReducerKey = 'ui';

  const manifest = {
    1: state => state,
  };

  return createMigration(manifest, migrationReducerKey);
}

export default function configureStorage(options) {
  const {
    cookies,
  } = options;

  const authSubsetFilter = createFilter('auth', ['user', 'isAuthenticated']);

  return {
    whitelist: ['ui', 'auth'],
    storage: new CookieStorage({ cookies }),
    transforms: [authSubsetFilter],
  };
}
