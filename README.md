wsgw
====

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

## About

WebSocket server and client with built-in NATS gateway functionality

## Installation

Run the install command:

    npm install -g wsgw

Check if  is properly installed:

    $ wsgw --help

## Usage
### Use in server mode

```bash
    $ wsgw server --help

    app.js server

    Run in server mode

    Options:
      --version      Show version number                                   [boolean]
      --help         Show help                                             [boolean]
      --config, -c   The name of the configuration file      [default: "config.yml"]
      --forward, -f  Forwards messages among inbound and outbound topics
                                                          [boolean] [default: false]
      --natsUri, -n  NATS server URI used by the pdms adapter.
                                      [string] [default: "nats://demo.nats.io:4222"]
```

For example:

```bash
    $ wsgw server -f
```

The server will listen on `http://localhost:8001` by default.
You can change the port by setting the `WSGW_SERVER_PORT` environment value.

### Use in client mode

#### Message consumer

The consumer client connects to the WebSocket server, and starts observing the selected topic.
Every time a message arrives, prints it out to the console.

```bash
    $ wsgw producer --help

    wsgw consumer

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
    $ wsgw consumer -t "TMA"
```


#### Message producer

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
    $ wsgw producer -m '{ "a": true, "topic": "TMA" }'
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
          topic: TMA
          payload:
              id: some-unique-id-1
              text: some plain text 1
    - delay: 100
      message:
          topic: TMA
          payload:
              id: some-unique-id-2
              text: some plain text 2
    - delay: 300
      message:
          topic: TMA
          payload:
              id: some-unique-id-3
              text: some plain text 3
```

The file contains an array of message entries, where each entry can contain the following properties:

- `delay`: Delay in milliseconds, to wait before sending the actual message. (NOT IMPLEMENTED YET)
- `message`: The message object.
- `file`: The name of the file, that contains the message.


## Get Help

To learn more about the tool visit the [homepage](http://tombenke.github.io/wsgw/).

## References

- [npac](http://tombenke.github.io/npac).
- [npac-example-cli](http://tombenke.github.io/npac-example-cli).

---

This project was generated from the [npac-pdms-be-archetype](https://github.com/tombenke/npac-pdms-be-archetype)
project archetype, using the [kickoff](https://github.com/tombenke/kickoff) utility.

[npm-badge]: https://badge.fury.io/js/wsgw.svg
[npm-url]: https://badge.fury.io/js/
[travis-badge]: https://api.travis-ci.org/tombenke/wsgw.svg
[travis-url]: https://travis-ci.org/tombenke/wsgw
[Coveralls]: https://coveralls.io/github/tombenke/wsgw?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/tombenke/wsgw/badge.svg?branch=master
