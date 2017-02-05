module.exports = {
  plugins: {
    // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
    'postcss-import': {},

    // Allow you to fix url() according to postcss to and/or from options
    'postcss-url': {},

    // PostCSS plugin to add a collection of mixins, shortcuts, helpers and tools for your CSS
    'postcss-utilities': {},

    // Allow you to use ancestors introduces ^& selector which let you reference any parent
    //  ancestor selector with an easy and customizable interface.
    'postcss-nested-ancestors': {},

    // Unwraps nested rules like how Sass does it
    'postcss-nested': {},

    // Magically generate all the @font-face rules
    'postcss-font-magician': {},

    // Postcss flexbox bug fixer
    'postcss-flexbugs-fixes': {},

    // LostGrid is a powerful grid system built in PostCSS that works with any preprocessor and even vanilla CSS. http://lostgrid.org
    lost: {},

    // PostCSS plugin that allows referencing property values without a variable, similar to Stylus.
    'postcss-property-lookup': {},

    // :enter simplifies selectors targeting elements that are designated,
    // as the naming of :hover is somewhat misleading;it specifically means elements designated
    //  with a pointing device, rather than any device.
    'postcss-pseudo-class-enter': {},

    // A little bag of CSS superpowers, built on PostCSS http://simplaio.github.io/rucksack
    'rucksack-css': {},

    // Alloy you to use tomorrow's CSS syntax, today. http://cssnext.io/
    'postcss-cssnext': {
      browsers: ['last 2 versions', '> 5%'],
    },
  },
};
