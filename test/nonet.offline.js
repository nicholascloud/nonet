/*global define, suite, test, chai*/
define(['nonet'], function (Nonet) {
  'use strict';
  var assert = chai.assert;

  suite('Nonet#offline', function () {
    test('places instance in an online state', function (done) {
      var nonet = new Nonet();
      nonet.on('offline', function () {
        done();
      });
      nonet.offline();
      nonet.dispose();
    });

    test('passes arguments to offline handler', function (done) {
      var nonet = new Nonet();
      var expectedSource = 'SOURCE';
      var expectedEventArgs = {};
      nonet.on('offline', function (e) {
        assert.equal(e.source, expectedSource);
        assert.equal(e.eventArgs, expectedEventArgs);
        done();
      });
      nonet.offline(expectedSource, expectedEventArgs);
      nonet.dispose();
    });
  });

});