/*global define, suite, test, setup*/
define(['mockjax', 'nonet'], function ($, Nonet) {
  'use strict';

  suite('Nonet#poll', function () {
    setup(function (done) {
      $.mockjaxClear();
      done();
    });

    test('poll executes at intervals', function (done) {
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
        if (times === 3) {
          nonet.dispose();
          done();
        }
      });

    });
  });

});