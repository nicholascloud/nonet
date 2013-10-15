/*global define, chai, window, suite, test, setup*/
define(['mockjax', 'nonet'], function ($, Nonet) {
  var assert = chai.assert;

  suite('nonet#start', function () {

    setup(function (done) {
      $.mockjaxClear();
      done();
    });

    test('poll executes at intervals', function (done) {
      this.timeout(5000);

      $.mockjax({
        type: 'HEAD',
        url: '/poll',
        responseTime: 200
      });

      var nonet = new Nonet();
      nonet.poll('/poll', 1500);
      var times = 0;
      nonet.on('online', function () {
        times += 1;
        console.log('poll %d', times);
        if (times === 3) {
          nonet.dispose();
          done();
        }
      });

    });
  });
});