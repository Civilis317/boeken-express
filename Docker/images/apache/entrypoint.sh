#!/usr/bin/env bash

rm -f /var/run/apache2/*
/usr/sbin/apache2ctl -D FOREGROUND