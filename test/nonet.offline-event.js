/*global define, suite, test, chai*/
define(['nonet'], function (Nonet) {
  'use strict';
  var assert = chai.assert;

  suite('Nonet^offline (event)', function () {
    test('event fires when offline method is invoked', function (done) {
      var nonet = new Nonet();
      nonet.on('offline', function () {
        done();
      });
      nonet.offline();
      nonet.dispose();
    });

    test('delta false if no state change', function (done) {
      var nonet = new Nonet();
      nonet.offline();
      nonet.on('offline', function (e) {
        assert.isFalse(e.delta);
        done();
      });
      nonet.offline();
      nonet.dispose();
    });

    test('delta true if real state change', function (done) {
      var nonet = new Nonet();
      nonet.online();
      nonet.on('offline', function (e) {
        assert.isTrue(e.delta);
        done();
      });
      nonet.offline();
      nonet.dispose();
    });
  });

});