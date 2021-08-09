#!/bin/sh

# check for the pid and kill it
pkill -TERM -f Works.js

# start a new one
node Works.js
