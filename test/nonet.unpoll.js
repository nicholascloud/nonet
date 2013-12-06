/*global define, suite, test, setup, chai*/
define(['mockjax', 'nonet'], function ($, Nonet) {
  'use strict';
  var assert = chai.assert;

  suite('Nonet#unpoll', function () {
    setup(function (done) {
      $.mockjaxClear();
      done();
    });

    test('poll stopped after first interval', function (done) {
      this.timeout(5000);

      $.mockjax({
        type: 'HEAD',
        url: '/poll'
      });

      var nonet = new Nonet();
      var pollKey = nonet.poll('/poll', 500);
      var times = 0;
      nonet.on('online', function () {
        times += 1;
        console.log('poll %s %d', pollKey, times);
        nonet.unpoll(pollKey);
      });

      setTimeout(function () {
        nonet.dispose();
        assert.equal(times, 1);
        done();
      }, 3000);

    });

    test('all polls stopped when no key provided', function (done) {
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
      var pollKey1 = nonet.poll('/poll1', 500);
      var pollKey2 = nonet.poll('/poll2', 500);

      var times = {};
      times[pollKey1] = 0;
      times[pollKey2] = 0;
      var allTimes = 0;

      nonet.on('online', function (e) {
        times[e.source] += 1;
        allTimes += 1;
        if (allTimes === 4) {
          nonet.unpoll();
        }
        console.log('poll %s %d', e.source, times[e.source]);
      });

      setTimeout(function () {
        nonet.dispose();
        assert.equal(allTimes, 4);
        assert.equal(times[pollKey1], 2);
        assert.equal(times[pollKey2], 2);
        done();
      }, 3000);

    });
  });
});