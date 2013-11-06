/*global define, window*/
(function (global, factory) {
  'use strict';

  // AMD (require.js) module
  if (typeof define === 'function' && define.amd) {
    return define(['jquery', 'underscore', 'ventage'], function ($, _, Ventage) {
      return factory($, _, Ventage, global);
    });
  }

  // browser
  global.Nonet = factory(global.$, global._, global.Ventage, global);

}(this, function ($, _, Ventage, global/*, undefined*/) {
  'use strict';

  function Poll(url, interval, immediate) {
    var pollKey = Poll.key(url, interval);

    return _.extend(Object.create(new Ventage()), {
      _polling: false,
      _poll: function () {
        var self = this;
        if (self._polling) {
          self.trigger('skipping', self.toString());
          return;
        }
        self._polling = true;
        var promise = $.ajax({
          type: 'HEAD',
          async: true,
          url: url
        });
        promise.done(function () {
          self._polling = false;
          self.trigger('success', self.toString());
        });
        promise.fail(function () {
          self._polling = false;
          self.trigger('failure', self.toString());
        });
      },
      start: function () {
        if (immediate) {
          var self = this;
          setTimeout(function () {
            self._poll();
          }, 0);
        }
        this._interval = setInterval(_.bind(this._poll, this), interval);
      },
      stop: function () {
        if (!this._interval) {
          return;
        }
        clearInterval(this._interval);
      },
      toString: function () {
        return pollKey;
      }
    });
  }

  Poll.key = function (url, interval) {
    return 'poll::' + url + '@' + interval;
  };

  var nonet = {
    isOnline: function () {
      return this._isOnline;
    },
    poll: function (url, interval, immediate) {
      if (arguments.length < 3) {
        immediate = false;
      }
      var poll = new Poll(url, interval, immediate);
      poll.on('failure', _.bind(this.offline, this));
      poll.on('success', _.bind(this.online, this));
      var key = Poll.key(url, interval);
      this._polls[key] = poll;
      poll.start();
      return key;
    },
    _unpollAll: function () {
      _.each(this._polls, function (poll/*, key*/) {
        poll.stop();
        poll.off('failure');
        poll.off('success');
      });
      var keys = _.keys(this._polls);
      this._polls = {};
      return keys;
    },
    _unpollOne: function (key) {
      if (!_.has(this._polls, key)) {
        return;
      }

      var poll = this._polls[key];
      poll.stop();
      poll.off('failure');
      poll.off('success');
      delete this._polls[key];
      return key;
    },
    unpoll: function (key) {
      if (arguments.length === 0) {
        return this._unpollAll();
      }
      return this._unpollOne(key);
    },
    online: function (source) {
      var wasOffline = !this._isOnline;
      this._isOnline = true;
      this.trigger('online', {
        source: source || '',
        delta: wasOffline
      });
    },
    offline: function (source) {
      var wasOnline = this._isOnline;
      this._isOnline = false;
      this.trigger('offline', {
        source: source || '',
        delta: wasOnline
      });
    },
    toggle: function (state, source) {
      if (!!state) {
        this.online(source);
      } else {
        this.offline(source);
      }
    },
    dispose: function () {
      var self = this;
      var keys = _.keys(self._polls);
      _.each(keys, function (key) {
        self.unpoll(key);
      });
      self._polls = {};
    }
  };

  return function () {
    var inst = Object.create(new Ventage());
    inst = _.extend(inst, nonet);
    inst._isOnline = false;
    inst._polls = {};

    global.addEventListener('online', function (/*e*/) {
      inst.online('global.online');
    });

    global.addEventListener('offline', function (/*e*/) {
      inst.offline('global.offline');
    });

    if (!!global.applicationCache) {
      global.applicationCache.addEventListener('error', function (/*e*/) {
        inst.offline('global.appcache.error');
      });
    }

    if (global.navigator.hasOwnProperty('onLine')) {
      inst.toggle(global.navigator.onLine, 'global.navigator.onLine');
    }

    return inst;
  };

}));