/*global requirejs, require, mocha*/
requirejs.config({
  paths: {
    'jquery': '../bower_components/jquery/jquery',
    'underscore': '../bower_components/underscore/underscore',
    'ventage': '../bower_components/ventage/ventage'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    }
  }
});

require([
  // nonet tests
], function () {
  'use strict';
  mocha.checkLeaks();
  mocha.run();
});