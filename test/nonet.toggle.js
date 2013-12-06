/*global define, suite, test, chai*/
define(['nonet'], function (Nonet) {
  'use strict';
  var assert = chai.assert;

  suite('Nonet#toggle', function () {
    test('toggles instance state', function (done) {
      var nonet = new Nonet();
      nonet.online();
      assert.isTrue(nonet.isOnline());
      nonet.on('offline', function () {
        done();
      });
      nonet.toggle();
      nonet.dispose();
    });

    test('explicitly toggle instance state', function (done) {
      var nonet = new Nonet();
      nonet.online();
      assert.isTrue(nonet.isOnline());
      nonet.on('online', function (e) {
        assert.equal(e.source, 'online-source');
        done();
      });
      nonet.on('offline', function (e) {
        assert.equal(e.source, 'offline-source');
        nonet.toggle('online-source', {}, true);
      });
      nonet.toggle('offline-source', {}, false);
      nonet.dispose();
    });

    test('passes arguments to toggle handler', function (done) {
      var nonet = new Nonet();
      nonet.online();
      assert.isTrue(nonet.isOnline());
      var expectedSource = 'SOURCE';
      var expectedEventArgs = {};
      nonet.on('offline', function (e) {
        assert.equal(e.source, expectedSource);
        assert.equal(e.eventArgs, expectedEventArgs);
        done();
      });
      nonet.toggle(expectedSource, expectedEventArgs);
      nonet.dispose();
    });
  });

});