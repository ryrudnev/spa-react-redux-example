// Here is where you can define configuration overrides based on the execution environment.
// Supply a key to the default export matching the NODE_ENV that you wish to target, and
// the base configuration will apply your overrides before exporting itself.
module.exports = {
  // ======================================================
  // Overrides when NODE_ENV === 'development'
  // ======================================================
  development: (/* config */) => ({
    proxy_log_level: 'debug',
  }),

  // ======================================================
  // Overrides when NODE_ENV === 'production'
  // ======================================================
  production: (/* config */) => ({
    proxy_api_endpoint: process.env.API_ENDPOINT || 'http://vs.vgg.ru/api/v2/helpdesk',
  }),
};
