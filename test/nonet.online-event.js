/*global define, suite, test, chai*/
define(['nonet'], function (Nonet) {
  'use strict';
  var assert = chai.assert;

  suite('Nonet^online (event)', function () {
    test('event fires when online method is invoked', function (done) {
      var nonet = new Nonet();
      nonet.on('online', function () {
        done();
      });
      nonet.online();
      nonet.dispose();
    });

    test('delta false if no state change', function (done) {
      var nonet = new Nonet();
      nonet.online();
      nonet.on('online', function (e) {
        assert.isFalse(e.delta);
        done();
      });
      nonet.online();
      nonet.dispose();
    });

    test('delta true if real state change', function (done) {
      var nonet = new Nonet();
      nonet.offline();
      nonet.on('online', function (e) {
        assert.isTrue(e.delta);
        done();
      });
      nonet.online();
      nonet.dispose();
    });
  });

});