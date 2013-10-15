/*global requirejs, require, mocha*/
requirejs.config({
  paths: {
    'jquery': '../bower_components/jquery/jquery',
    'underscore': '../bower_components/underscore/underscore',
    'ventage': '../bower_components/ventage/ventage',
    'mockjax': '../bower_components/jquery-mockjax/jquery.mockjax',
    'nonet': '../nonet'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'mockjax': {
      deps: ['jquery'],
      exports: '$'
    }
  }
});

require([
  // nonet tests
  './nonet.poll'
], function () {
  'use strict';
  mocha.checkLeaks();
  mocha.run();
});