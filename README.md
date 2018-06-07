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
