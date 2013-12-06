# nonet 2.0.0

Nonet is a library to help detect whether your browser is in an "online" or "offline" state. It supports the following methods of state detection:

- `window.online` and `window.offline` events (if available)
- `window.applicationCache.error` event (if available)
- `window.navigator.onLine` property (if available)
- manual polling

## Prerequisites

- jquery @ 2.x
- underscore @ latest
- [ventage @ 1.x](https://github.com/a2labs/ventage)

## Installation

Nonet may be used as a require.js module, or as a plain browser script.

### require.js module

```javascript
requirejs.configure({
  paths: {
    'jquery': 'path/to/jquery',
    'underscore': 'path/to/underscore',
    'ventage': 'path/to/ventage',
    'nonet': 'path/to/nonet'
  }
});

require(['nonet'], function (Nonet) {
  var nonet = new Nonet();
  // application code
});
```

### plain browser script

```html
<body>
  <script src="path/to/jquery.js"></script>
  <script src="path/to/underscore.js"></script>
  <script src="path/to/ventage.js"></script>
  <script src="path/to/nonet.js"></script>
  <script>
    $(function () {
      var nonet = new Nonet();
      // application code
    });
  </script>
</body>
```

## Usage

When a nonet object is instantiated it will begin in an offline state __UNLESS__ your browser's `navigator` object has an `onLine` property. If it does, this property is evaluated, and the instance will automatically be set to the appropriate state.

The state of a nonet instance may be checked by invoking `isOnline`.

```javascript
var nonet = new Nonet();
// window.navigator.onLine === true
nonet.isOnline(); // true
```

### Events

When a browser `online` or `offline` event occurs, or an application cache error occurs, a nonet instance will know about this immediately and trigger its own `online` and `offline` events.

```javascript
var nonet = new Nonet();

nonet.on('online', function (e) {
  alert('we are so online');
});

nonet.on('offline', function (e) {
  alert('definitely offline now');
});
```

These events accept a single argument that contains three significant properties.

```javascript
{
  /**
   * A string value that represents the "source" of the event.
   * If the event is generated by the browser, the source will begin
   * with "global.". In the case of polls, this will be the "poll
   * key" discussed later. If the event is triggered by your own
   * code, you may supply a (optional) identifier.
   */
  source: "",
  /**
   * Boolean value that indicates if the nonet instance was previously
   * in the opposite state. (Useful for polls that trigger on
   * pre-determined intervals.)
   */
  delta: true,
  /**
   * Objects generated by browser events, or custom event arguments
   * from your calling code.
   */
  eventArgs: {}
}
```

### Manual control

You can manually place a nonet instance into an online or offline state by calling its respective methods. Each method takes two (optional) arguments, the source of the event (String) and arbitrary eventArgs (Object). These will be passed to the instance's respective event handlers.

```javascript
var nonet = new Nonet();
nonet.offline('my-source', {my: "data"});
nonet.online('my-source', {my: "data"});
```

The `toggle` method will invert the state of a nonet instance. It accepts the same "source" and "eventArgs" arguments as `online` and `offline`. Optionally, you may forcibly set a state if a third argument is provided (true === online, false === offline).

```javascript
var nonet = new Nonet();
// in an online state
nonet.toggle('my-source', {my: "data"});
// in an offline state
nonet.toggle('my-source', {my: "data"}, !nonet.isOnline());
// in an online state
```

### Polling

To start a poll, invoke the instance's `poll` method with a URL and interval in milliseconds:

```javascript
var nonet = new Nonet();
var pollKey = nonet.poll('/onepix.gif', 5000);
```

A poll makes HEAD requests to the URL provided, at the specified interval. By default, a poll will wait until the time interval has elapsed before sending its first ping. You can provide a third, boolean argument to force the poll to begin immediately.

```javascript
var pollKey = nonet.poll('/onepix.gif', 5000, true);
```

When a poll is created a unique key is generated and returned to calling code. This can be used to cancel the poll at a later time by calling `unpoll` on the nonet instance.

```javascript
nonet.unpoll(pollKey);
```

A `nonet` instance will not allow you to define two polls for the same URL and duration. It will reject the second and return the poll key from the first.

When a poll object successfully completes its HEAD request, it will trigger the `online` event on the nonet instance. Likewise, if its HEAD request fails, it will trigger the `offline` event on the nonet instance.

To stop all poll objects attached to a nonet instance at once, you may invoke the `unpoll` method on the instance with no arguments.

```javascript
nonet.unpoll();
```

### Disposal

When you are finished with a nonet instance, you should invoke its `dispose` method. This will stop all polls and prevent further browser and application cache events from affecting its state. It will __not__ remove handlers attached to its `online` and `offline` events, however, so be sure to remove them yourself.

```javascript
var nonet = new Nonet();
nonet.on('online', onNonetOnline);
nonet.on('offline', onNonetOffline);
nonet.poll('/onepix.gif', 5000);

// some time later
nonet.dispose();      //all polls stopped
nonet.off('online');  //remove all handlers
nonet.off('offline'); //remove all handlers
```

## License

[MIT License](LICENSE)