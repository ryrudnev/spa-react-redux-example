export default {
  // ----------------------------------
  // App configuration
  // ----------------------------------
  app: {
    // DOOM mount node
    containerId: 'app',
    // header options
    head: {
      title: 'ncs',
      titleTemplate: '%s | ncs',
      meta: [
        { name: 'description', content: 'Network Connect System - admin dashboard.' },
        { charset: 'utf-8' },
      ],
    },
  },

  // ----------------------------------
  // Api configuration
  // ----------------------------------
  api: {
    // base endpoint to API
    endpoint: '/api',
  },

  // ----------------------------------
  // Pusher configuration
  // ----------------------------------
  pusher: {
    // base endpoint to Pusher service
    endpoint: '/pusher',
    appName: __DEV__ ? 'devhpdesk' : 'hpdesk',
    timeout: 120,
    retry: 10,
  },
};
