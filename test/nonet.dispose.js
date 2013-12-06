/*global define, suite, test, setup, chai*/
define(['mockjax', 'nonet'], function ($, Nonet) {
  'use strict';
  var assert = chai.assert;

  suite('Nonet#dispose', function () {
    setup(function (done) {
      $.mockjaxClear();
      done();
    });

    test('instance removed from Nonet collection when disposed', function (done) {
      var nonet = new Nonet();
      assert.include(Nonet._instances, nonet);
      nonet.dispose();
      assert.notInclude(Nonet._instances, nonet);
      done();
    });

    test('polls cleared when disposed', function (done) {
      this.timeout(5000);

      $.mockjax({
        type: 'HEAD',
        url: '/poll1'
      });

      $.mockjax({
        type: 'HEAD',
        url: '/poll2'
      });

      var nonet = new Nonet();
      nonet.poll('/poll1', 500);
      nonet.poll('/poll2', 500);

      var allTimes = 0;

      nonet.on('online', function (e) {
        allTimes += 1;
        if (allTimes === 3) {
          nonet.dispose();
        }
        console.log('poll %s %d', e.source, allTimes);
      });

      setTimeout(function () {
        assert.equal(allTimes, 3);
        done();
      }, 3000);

    });
  });
});