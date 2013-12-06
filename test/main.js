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
  './nonet.online',
  './nonet.offline',
  './nonet.toggle',
  './nonet.poll',
  './nonet.unpoll',
  './nonet.dispose',
  './nonet.online-event',
  './nonet.offline-event'
], function () {
  'use strict';
  mocha.checkLeaks();
  mocha.run();
});