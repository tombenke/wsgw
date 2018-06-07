#!/bin/bash

export app="node dist/app.js"

export workdir=`pwd`
export PDMS_NATS_URI="nats://demo.nats.io:4222"
#export PDMS_NATS_URI="nats://localhost:4222"

$app
