/*global define, suite, test, chai*/
define(['nonet'], function (Nonet) {
  'use strict';
  var assert = chai.assert;

  suite('Nonet#online', function () {
    test('places instance in an online state', function (done) {
      var nonet = new Nonet();
      nonet.on('online', function () {
        done();
      });
      nonet.online();
      nonet.dispose();
    });

    test('passes arguments to online handler', function (done) {
      var nonet = new Nonet();
      var expectedSource = 'SOURCE';
      var expectedEventArgs = {};
      nonet.on('online', function (e) {
        assert.equal(e.source, expectedSource);
        assert.equal(e.eventArgs, expectedEventArgs);
        done();
      });
      nonet.online(expectedSource, expectedEventArgs);
      nonet.dispose();
    });
  });

});