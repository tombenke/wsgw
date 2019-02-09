wsgw
====

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

## About

`wsgw` is a WebSocket server and client with built-in NATS gateway functionality.

This application can act in the following roles:

- a plain WebSocket server,
- a websocket client consuming messages from a topic,
- a websocket and NATS client producing individual and/or bulk messages from file to a topic,
- a gateway that forwards messages among Websocket and NATS topics.

The main purpose of this gateway is to connect web frontend applications to backend services
that are reacheable through messaging middlewares, such as NATS,
and asynchronously pass messages back-and-forth between the services and the frontend.

The backend services can directly connect to the WebSocket server as you can see on the following figure:

![Message flow using only WebSocket](docs/messageflow_wsonly.png)

or it also can connect through an intermediate middleware, such as NATS:

![Message flow using WebSocket and NATS](docs/messageflow_ws_nats.png)

The figures demonstrates a use-case, when the frontend is a redux application,
where the outgoing messages are generated by async actions, and the incoming response messages
are processed by an observer agent,
that dispatches tha arrived messages as simple redux actions into the store.

At the backend side, the business logic is a so-called Event Processing Network,
that is implemented as a ReactiveX pipeline.

Note:
You can use several inbound and outbound topics, and do not have to use both types.
Neither the frontend has to implement full roundtrips of messages.
At the same time, several frontends can connect to the WebSocket server to listen to the inbound messages.

For example you can implement a backend service, which is a sensor event consumer,
that preprocesses and forwards the measured values toward frontend applications that visualize them.
At the same time you can control the backend by sending command messages via the `wsgw` as a message producer client.

### Events vs. topics

The WebSocket uses event handlers to manage the receiving and sending of messages.
The server and the clients can subscribe to event names, that they observe,
and act in case an incoming message arrives.

If we want to send a message from a client to more than one recipient clients,
that connect to the same WebSocket server, we can use the broadcast function, at the server side.

By default the `wsgw` application in server mode subscribes to the "message" event,
and the messages it got immediately broadcasts back to all the clients with the same event "message" name.
So any client, that is subscribed to the "message" topic will get the message (except the original sender).
Here there is some similarity to how the topics work in case of messaging middlewares,
such as the NATS works.

Furthermore, when the server receives an incoming event in the "message",
it checks if it has a `topic` property.
If yes, then it will forward the message to an event named as the value of this property field,
instead of using the original "message" name. Now the clients can subscribe to the topic name,
instead of the "message", then the sender can make difference among the recipients, which should get the message.
The sender always emits the message with the "message" event name. We call it `forwarderEvent`.
The default name of the `forwardEvent` is `"message"`, but you can define a different one, via a server config parameter.

So far we have achieved to use `wsgw` as a server that provides topic-like feature to us in the WebSocket domain.
The target recipiens can be addressed by the `topic` field withing the messages.

It is also possible to define real topics of a messaging middleware that will be connected to this ecosystem.
you can define so called _outbound_ topics to the server,
that should match to the value of the `topic` field of the outgoing messages,
then the server will forward these messages toward not only to the WebSocket events, but to the NATS server topics,
if the `forward` mode is switched on. In this mode, you also can list the _inbound_ NATS topics the `wsgw` will subscribe to,
then forward the arriving messages to the `forwardEvent`, so the forwarder will further broadcasts to the final recipients.
These incoming messages should also contain the `topic` property of course.

## Installation

Run the install command:

    npm install -g wsgw

Check if `wsgw` is properly installed:

    $ wsgw --help

## Usage
### Run in server mode

```bash
    $ wsgw server --help

    app.js server

    Run in server mode

    Options:
      --version             Show version number                            [boolean]
      --help                Show help                                      [boolean]
      --config, -c          The name of the configuration file
                                                             [default: "config.yml"]
      --port, -p            The webSocket server port       [number] [default: 8001]
      --forward, -f         Forwards messages among inbound and outbound topics
                                                          [boolean] [default: false]
      --forwarderEvent, -e  The name of the event the server is listen to forward
                            the incoming messages      [string] [default: "message"]
      --inbound, -i         Comma separated list of inbound NATS topics to forward
                            through websocket                 [string] [default: ""]
      --outbound, -o        Comma separated list of outbound NATS topics to forward
                            towards from websocket            [string] [default: ""]
      --natsUri, -n         NATS server URI used by the pdms adapter.
                                      [string] [default: "nats://demo.nats.io:4222"]
```

For example:

```bash
    $ wsgw server -f
```

The server will listen on `http://localhost:8001` by default.
You can change the port by setting the `WSGW_SERVER_PORT` environment value
as well as by using the `-p` parameter.

This is an other example of using inbound and outbound NATS topics:

```bash
    wsgw server -f -n nats:localhost:4222 -i "IN1,IN2,IN3" -o "OUT1,OUT2"
```

__Note:__ The `wsgw server` mode is useful for having a standalone WebSocket server mostly during development.
If you need a fully functional web server, with content service, authentication, and so on,
then use [easer](https://www.npmjs.com/package/easer) that delivers all these features to you,
including the `wsgw server` mode features as well.


### Run in client mode

#### Run as a message consumer

The consumer client connects to the WebSocket server, and starts observing the selected topic.
Every time a message arrives, prints it out to the console.

```bash
    $ wsgw consumer --help

    Run as a consumer client

    Options:
      --version     Show version number                                    [boolean]
      --help        Show help                                              [boolean]
      --config, -c  The name of the configuration file       [default: "config.yml"]
      --uri, -u     The URI of the WebSocket server
                                         [string] [default: "http://localhost:8001"]
      --topic, -t   The topic (event name) the message will be sent
                                                       [string] [default: "message"]
```

For example:

```bash
    $ wsgw consumer -t "IN1"
```


#### Run as messages producer

```bash
    $ wsgw producer --help

    wsgw producer

    Run as a producer client

    Options:
      --version      Show version number                                   [boolean]
      --help         Show help                                             [boolean]
      --config, -c   The name of the configuration file      [default: "config.yml"]
      --uri, -u      The URI of the WebSocket server
                                         [string] [default: "http://localhost:8001"]
      --topic, -t    The topic (event name) the message will be sent
                                                       [string] [default: "message"]
      --message, -m  The JSON-format message string to send          [default: null]
      --source, -s   The name of the YAML or JSON format source file that holds the
                     messages to send                                [default: null]

```

Send a direct message from the command line:

```bash
    $ wsgw producer -m '{ "a": true, "topic": "OUT1" }'
```

Send messages from a file:

```bash
    $ wsgw producer -s ./commands/producer/fixtures/test_scenario.yml
```

You can use both `-m` and `-s` parameters together.
In this case the direct message will be sent first, then the messages from the file.

This is an example messages file:
```YAML
    ---
    - delay: 200
      message:
          topic: OUT1
          payload:
              id: some-unique-id-1
              text: some plain text 1
    - delay: 100
      message:
          topic: OUT2
          payload:
              id: some-unique-id-2
              text: some plain text 2
    - delay: 300
      message:
          topic: OUT3
          payload:
              id: some-unique-id-3
              text: some plain text 3
```

The file contains an array of message entries, where each entry can contain the following properties:

- `delay`: Delay in milliseconds, to wait before sending the actual message.
  The delay is relative to the previous sending.
- `message`: The message object, to send.
- `file`: The name of the file, that contains the message. First it loads from the file, then sends it.

Note: The messages you want to send to a specific topic should contain the name of the target topic,
in the message as a `topic` property, but the event name you have to send is the `<forwardEvent>` of the server,
that is "message" by default. If you change the name of the `forwardEvent` on the server,
you also have to change it in the `producer` as well. You can use the `-t` argument for this, that is by default set to "message".

The producer command can be used to send messages to websocket server as well as to NATS.
It depends on the protocol part of the server URI.
If the URI starts with `nats://` (for example: `nats://localhost:4222`),
then the messages will be sent through the NATS middleware,
if it starts with `http:` (for example: `http://localhost:8001`), then it uses the websocket protocol.

The inbound/outbound message forwarding automatically happens in case of the websocket mode.
The topic should be `message` (this is the default value) in this case.

__Note:__
The topic handling works differently in case of the `nats:` URIs.
If we sent the messages to a NATS server, the topic should be the one you really want to send the message.
If the message itself contain the topic, it will be automatically sent to that topic, if not defined,
then the topic argument will determine it that you can define with the `-t` or `--topic` switch.
Its default value is `message`.
In case of NATS, the messages will automatically get a `$pubsub: true` property as well,
to properly forward the message to a NATS topic.

## References

- [npac](http://tombenke.github.io/npac).
- [npac-example-cli](http://tombenke.github.io/npac-example-cli).

---

[npm-badge]: https://badge.fury.io/js/wsgw.svg
[npm-url]: https://badge.fury.io/js/
[travis-badge]: https://api.travis-ci.org/tombenke/wsgw.svg
[travis-url]: https://travis-ci.org/tombenke/wsgw
[Coveralls]: https://coveralls.io/github/tombenke/wsgw?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/tombenke/wsgw/badge.svg?branch=master
